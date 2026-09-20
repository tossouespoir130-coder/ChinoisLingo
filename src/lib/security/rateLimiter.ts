import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

// Instance Redis Upstash configurée automatiquement si les variables d'environnement sont présentes
let upstashClient: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  upstashClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Limiteurs Upstash par fenêtre glissante (mis en cache)
const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(maxRequests: number, windowSeconds: number): Ratelimit | null {
  if (!upstashClient) return null;
  const key = `${maxRequests}_${windowSeconds}`;
  let limiter = upstashLimiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: upstashClient,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
      analytics: true,
      prefix: 'chinoislingo:ratelimit',
    });
    upstashLimiters.set(key, limiter);
  }
  return limiter;
}

// ── Repli en mémoire pour dev local / multi-instances ───────────────────────
interface RateLimitEntry {
  timestamps: number[];
}
const memoryStore = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function purgeExpired(now: number, windowMs: number) {
  for (const [key, entry] of memoryStore.entries()) {
    entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);
    if (entry.timestamps.length === 0) {
      memoryStore.delete(key);
    }
  }
}

function verifierMemoire(
  key: string,
  maxRequests: number,
  windowSeconds: number
): { autorise: boolean; restants: number; attenteSecondes: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    purgeExpired(now, windowMs);
    lastCleanup = now;
  }

  let entry = memoryStore.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    memoryStore.set(key, entry);
  }

  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0];
    const attenteSecondes = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      autorise: false,
      restants: 0,
      attenteSecondes,
    };
  }

  entry.timestamps.push(now);

  return {
    autorise: true,
    restants: maxRequests - entry.timestamps.length,
    attenteSecondes: 0,
  };
}

/**
 * Vérifie et applique une limitation de débit persistante :
 * 1. Priorité 1 : Upstash Redis (distribué et persistant entre toutes les instances serverless Vercel).
 * 2. Priorité 2 : Repli mémoire local si Upstash n'est pas encore provisionné.
 */
export async function verifierRateLimit(
  key: string,
  maxRequests: number = 5,
  windowSeconds: number = 300
): Promise<{ autorise: boolean; restants: number; attenteSecondes: number; source: 'upstash' | 'memoire' }> {
  const upstashLimiter = getUpstashLimiter(maxRequests, windowSeconds);

  if (upstashLimiter) {
    try {
      const { success, remaining, reset } = await upstashLimiter.limit(key);
      const now = Date.now();
      const attenteSecondes = Math.max(1, Math.ceil((reset - now) / 1000));

      return {
        autorise: success,
        restants: remaining,
        attenteSecondes: success ? 0 : attenteSecondes,
        source: 'upstash',
      };
    } catch (err) {
      console.error('[RateLimiter] Erreur Upstash Redis, bascule sur le repli mémoire:', err);
    }
  }

  const resMem = verifierMemoire(key, maxRequests, windowSeconds);
  return {
    ...resMem,
    source: 'memoire',
  };
}

/**
 * Contrôle de débit persistant en base de données pour les initiations de paiement (Checkout).
 * Interroge directement la table `payments` de Supabase pour compter les sessions créées
 * dans les N dernières minutes. Fonctionne à 100% de manière persistante sur Vercel sans aucun service tiers.
 */
export async function verifierRateLimitCheckoutDB(
  adminClient: SupabaseClient<Database>,
  userId: string,
  maxCreations: number = 5,
  fenetreMinutes: number = 5
): Promise<{ autorise: boolean; totalRecents: number; attenteSecondes: number }> {
  const limiteDate = new Date(Date.now() - fenetreMinutes * 60 * 1000).toISOString();

  const { count, error } = await adminClient
    .from('payments')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', limiteDate);

  if (error) {
    console.error('[RateLimiterDB] Erreur lors du comptage des paiements récents:', error);
    // En cas d'erreur de requête, on ne bloque pas un utilisateur légitime
    return { autorise: true, totalRecents: 0, attenteSecondes: 0 };
  }

  const total = count ?? 0;
  if (total >= maxCreations) {
    return {
      autorise: false,
      totalRecents: total,
      attenteSecondes: fenetreMinutes * 60,
    };
  }

  return {
    autorise: true,
    totalRecents: total,
    attenteSecondes: 0,
  };
}
