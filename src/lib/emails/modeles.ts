/**
 * Modèles des e-mails d'abonnement.
 *
 * Styles en ligne et mise en page par tableaux : c'est la seule forme que
 * Gmail, Outlook et les applications mobiles affichent de façon fiable — ils
 * ignorent les feuilles de style et la plupart des mises en page modernes.
 *
 * Chaque modèle produit aussi une version texte, affichée par les clients qui
 * bloquent le HTML et prise en compte par les filtres anti-spam.
 *
 * Fonctions pures, sans réseau ni secret.
 */

import { resumeOffreGratuite } from '@/lib/payments/acces';
import {
  PLANS,
  Plan,
  Devise,
  formaterMontant,
  prixMensuelEquivalent,
  economiePourcent,
} from '@/lib/payments/plans';
// Type seul : `desabonnement.ts` est réservé au serveur, ce fichier reste pur.
import type { LiensDesabonnement } from './desabonnement';

/**
 * Jours avant l'échéance où partent les rappels. La tâche planifiée en déduit
 * ses fenêtres d'envoi, et l'e-mail de confirmation les annonce : les deux
 * restent donc toujours d'accord.
 */
export const JOURS_RAPPEL = { j7: 7, j3: 3 } as const;

export interface ContenuEmail {
  sujet: string;
  html: string;
  texte: string;
  /** Renseigné pour les relances commerciales : en-têtes List-Unsubscribe. */
  desabonnement?: LiensDesabonnement;
}

interface Destinataire {
  /** URL publique du site, sans barre finale. */
  base: string;
  /** `null` donne un simple « Bonjour, ». */
  prenom: string | null;
}

export interface DonneesConfirmation extends Destinataire {
  nomPlan: string;
  /** Montant déjà formaté, ex. « 8 888 FCFA ». */
  montant: string;
  finPeriode: Date;
  /** Jours offerts inclus dans la période ; 0 sans bonus. */
  bonusJours: number;
}

/** Données de la série d'échéance : avant, le jour J, puis après. */
export interface DonneesEcheance extends Destinataire {
  nomPlan: string;
  finPeriode: Date;
  /**
   * Écart en jours calendaires entre l'échéance et le jour de l'envoi :
   * 7 → dans une semaine, 0 → aujourd'hui, −3 → il y a trois jours.
   */
  ecart: number;
  /** L'échéance est-elle déjà passée au moment de l'envoi ? */
  terminee: boolean;
  /**
   * Un paiement Mobile Money ne se reconduit jamais ; une carte n'arrive dans
   * cette série que si l'apprenant a annulé son renouvellement.
   */
  moyen: 'mobile_money' | 'carte';
  /** Grille proposée pour se réabonner. */
  devise: Devise;
  /**
   * Liens de désabonnement, posés uniquement sur les relances commerciales
   * (J+3 et J+7). Les messages de service n'en portent pas.
   */
  desabonnement?: LiensDesabonnement;
}

const CHEMIN_ABONNEMENT = '/mon-compte?tab=subscription';

const NOM_GRILLE: Record<Devise, string> = {
  XOF: 'Les formules Mobile Money :',
  EUR: 'Les formules par carte :',
};

// ─────────────────────────────────────────────────────────────────────────
// Confirmation d'abonnement (Mobile Money)
// ─────────────────────────────────────────────────────────────────────────

export function modeleConfirmation(d: DonneesConfirmation): ContenuEmail {
  const echeance = dateLongue(d.finPeriode);

  const lignes: [string, string][] = [
    ['Formule', d.nomPlan],
    ['Montant réglé', d.montant],
    ['Accès complet jusqu’au', echeance],
  ];
  if (d.bonusJours > 0) {
    lignes.push(['Bonus de bienvenue', `${d.bonusJours} jours offerts`]);
  }

  return {
    sujet: 'Votre abonnement ChinoisLingo est activé 🎉',
    ...rendre({
      base: d.base,
      apercu: `Accès complet jusqu’au ${echeance}. Merci pour votre confiance !`,
      titre: 'Votre abonnement est activé 🎉',
      blocs: [
        { type: 'paragraphe', texte: salutation(d.prenom) },
        {
          type: 'paragraphe',
          texte:
            'Merci pour votre confiance ! Votre paiement Mobile Money a bien été reçu : tout le catalogue ChinoisLingo vous est désormais ouvert — le vocabulaire HSK 1 à 6, Écoute & Lecture et toutes les formations.',
        },
        { type: 'recapitulatif', lignes },
        {
          type: 'paragraphe',
          texte: `**Aucun prélèvement automatique** : un paiement Mobile Money ne se renouvelle pas tout seul. Pour que la fin de votre accès ne vous surprenne pas, nous vous écrirons **${JOURS_RAPPEL.j7} jours** puis **${JOURS_RAPPEL.j3} jours** avant l’échéance.`,
        },
      ],
      bouton: { libelle: 'Commencer à apprendre', chemin: '/tableau-de-bord' },
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Avant l'échéance : J-7 et J-3
// ─────────────────────────────────────────────────────────────────────────

export function modeleRappelJ7(d: DonneesEcheance): ContenuEmail {
  const echeance = dateLongue(d.finPeriode);
  const quand = delai(d.ecart);
  const carte = d.moyen === 'carte';

  const blocs: Bloc[] = [
    { type: 'paragraphe', texte: salutation(d.prenom) },
    {
      type: 'paragraphe',
      texte: carte
        ? `Votre **${d.nomPlan}** prend fin le **${echeance}**. Vous avez annulé son renouvellement automatique : aucun prélèvement ne sera effectué.`
        : `Votre **${d.nomPlan}** prend fin le **${echeance}**. Comme il a été réglé par Mobile Money, il ne se renouvelle pas automatiquement.`,
    },
  ];

  if (carte) {
    blocs.push({
      type: 'paragraphe',
      texte:
        'Vous changez d’avis ? Réactivez-le en un clic depuis votre compte : il se poursuivra sans interruption, sans rien ressaisir.',
    });
  } else {
    blocs.push(
      ...blocsTarifs(
        d.devise,
        `Renouveler dès maintenant ne vous fait perdre aucun jour : la nouvelle période s’ajoute à la fin de celle en cours. ${NOM_GRILLE[d.devise]}`
      )
    );
  }

  return {
    sujet: `Votre abonnement ChinoisLingo se termine ${quand}`,
    ...rendre({
      base: d.base,
      apercu: carte
        ? `Vous avez annulé votre abonnement : l’accès complet s’arrête le ${echeance}.`
        : `Renouvelez par Mobile Money pour garder l’accès complet après le ${echeance}.`,
      titre: `Votre accès complet se termine ${quand}`,
      blocs,
      bouton: {
        libelle: carte ? 'Réactiver mon abonnement' : 'Renouveler mon abonnement',
        chemin: CHEMIN_ABONNEMENT,
      },
    }),
  };
}

export function modeleRappelJ3(d: DonneesEcheance): ContenuEmail {
  const echeance = dateLongue(d.finPeriode);
  const demain = d.ecart <= 1;
  const carte = d.moyen === 'carte';

  return {
    sujet: demain
      ? 'Votre accès complet à ChinoisLingo se termine demain'
      : `Plus que ${d.ecart} jours d’accès complet à ChinoisLingo`,
    ...rendre({
      base: d.base,
      apercu: `Votre ${d.nomPlan} prend fin le ${echeance}. ${
        carte ? 'Réactivez-le en un clic.' : 'Renouvelez en quelques instants par Mobile Money.'
      }`,
      titre: demain ? 'Votre accès complet se termine demain' : `Plus que ${d.ecart} jours d’accès complet`,
      blocs: [
        { type: 'paragraphe', texte: salutation(d.prenom) },
        ...blocsOffreGratuite(
          `Votre **${d.nomPlan}** prend fin le **${echeance}**. Sans renouvellement, votre compte repassera à l’offre gratuite, qui se limite à :`
        ),
        {
          type: 'paragraphe',
          texte:
            'Rien ne sera perdu pour autant : votre progression et vos mots enregistrés restent sur votre compte, et vous retrouverez tout le catalogue dès que vous renouvelez.',
        },
      ],
      bouton: {
        libelle: carte ? 'Réactiver mon abonnement' : 'Renouveler maintenant',
        chemin: CHEMIN_ABONNEMENT,
      },
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Le jour de l'échéance
// ─────────────────────────────────────────────────────────────────────────

export function modeleExpiration(d: DonneesEcheance): ContenuEmail {
  const echeance = dateLongue(d.finPeriode);
  const carte = d.moyen === 'carte';

  // Échéance encore à venir, plus tard dans la journée.
  if (!d.terminee) {
    return {
      sujet: 'Votre abonnement ChinoisLingo se termine aujourd’hui',
      ...rendre({
        base: d.base,
        apercu: `Dernier jour d’accès complet. ${
          carte ? 'Réactivez votre abonnement en un clic.' : 'Renouvelez par Mobile Money pour continuer.'
        }`,
        titre: 'Dernier jour d’accès complet',
        blocs: [
          { type: 'paragraphe', texte: salutation(d.prenom) },
          {
            type: 'paragraphe',
            texte: `Votre **${d.nomPlan}** prend fin **aujourd’hui**. Sans renouvellement, votre compte repassera à l’offre gratuite d’ici la fin de la journée.`,
          },
          {
            type: 'paragraphe',
            texte: carte
              ? 'Réactivez-le maintenant : il se poursuivra sans interruption.'
              : 'Renouvelez maintenant pour continuer sans interruption : les heures qui restent ne sont pas perdues, la nouvelle période s’y ajoute.',
          },
        ],
        bouton: {
          libelle: carte ? 'Réactiver mon abonnement' : 'Renouveler maintenant',
          chemin: CHEMIN_ABONNEMENT,
        },
      }),
    };
  }

  return {
    sujet: 'Votre abonnement ChinoisLingo a pris fin',
    ...rendre({
      base: d.base,
      apercu: 'Votre compte est repassé à l’offre gratuite. Votre progression vous attend.',
      titre: 'Votre abonnement a pris fin',
      blocs: [
        { type: 'paragraphe', texte: salutation(d.prenom) },
        ...blocsOffreGratuite(
          `Votre **${d.nomPlan}** a pris fin le **${echeance}**. Votre compte est repassé à l’offre gratuite, qui se limite à :`
        ),
        {
          type: 'paragraphe',
          texte:
            'Votre progression et vos mots enregistrés sont conservés : réabonnez-vous pour retrouver tout le catalogue HSK 1 à 6.',
        },
        ...blocsTarifs(d.devise, NOM_GRILLE[d.devise]),
      ],
      bouton: { libelle: 'Me réabonner', chemin: CHEMIN_ABONNEMENT },
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Après l'échéance : J+3 et J+7, tant que l'apprenant n'a pas renouvelé
// ─────────────────────────────────────────────────────────────────────────

export function modeleRelance(d: DonneesEcheance, derniere: boolean): ContenuEmail {
  const echeance = dateLongue(d.finPeriode);
  const depuis = Math.abs(d.ecart);

  const blocs: Bloc[] = [
    { type: 'paragraphe', texte: salutation(d.prenom) },
    {
      type: 'paragraphe',
      texte: `Depuis le **${echeance}**, votre compte est limité à l’offre gratuite. Votre progression et vos mots enregistrés sont toujours là : il suffit de vous réabonner pour retrouver le vocabulaire HSK 1 à 6, Écoute & Lecture et toutes les formations.`,
    },
    ...blocsTarifs(d.devise, NOM_GRILLE[d.devise]),
  ];

  if (derniere) {
    blocs.push({
      type: 'paragraphe',
      texte: 'C’est notre dernier message à ce sujet : nous ne vous écrirons plus pour ce renouvellement.',
    });
  }

  return {
    sujet: derniere
      ? 'Dernier rappel : reprenez votre apprentissage du chinois'
      : 'Votre progression vous attend sur ChinoisLingo',
    desabonnement: d.desabonnement,
    ...rendre({
      base: d.base,
      desabonnement: d.desabonnement,
      apercu: `Votre abonnement a pris fin le ${echeance}. Tout le catalogue vous attend.`,
      titre: derniere
        ? 'Reprenez votre apprentissage du chinois'
        : `Votre abonnement a pris fin il y a ${depuis} jours`,
      blocs,
      bouton: { libelle: 'Me réabonner', chemin: CHEMIN_ABONNEMENT },
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Formulations
// ─────────────────────────────────────────────────────────────────────────

function salutation(prenom: string | null): string {
  return prenom ? `Bonjour ${prenom},` : 'Bonjour,';
}

/**
 * Date longue en temps universel : les fenêtres d'envoi sont calculées en
 * jours UTC, la date affichée doit l'être aussi — sinon « aujourd'hui »
 * pourrait côtoyer la date de la veille.
 */
function dateLongue(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** « dans 7 jours », « demain », « aujourd’hui » — en jours calendaires. */
function delai(ecart: number): string {
  if (ecart <= 0) return 'aujourd’hui';
  if (ecart === 1) return 'demain';
  return `dans ${ecart} jours`;
}

/** « **Pass 6 Mois** : 39 999 FCFA, soit 6 667 FCFA par mois (−25 %) » */
function ligneTarif(plan: Plan, devise: Devise): string {
  const prix = `**${plan.nom}** : ${formaterMontant(plan.montant[devise], devise)}`;
  const economie = economiePourcent(plan, devise);
  return economie > 0
    ? `${prix}, soit ${prixMensuelEquivalent(plan, devise)} par mois (−${economie} %)`
    : prix;
}

function blocsTarifs(devise: Devise, introduction: string): Bloc[] {
  return [
    { type: 'paragraphe', texte: introduction },
    { type: 'liste', elements: PLANS.map((plan) => ligneTarif(plan, devise)) },
  ];
}

function blocsOffreGratuite(introduction: string): Bloc[] {
  return [
    { type: 'paragraphe', texte: introduction },
    { type: 'liste', elements: resumeOffreGratuite() },
  ];
}

// ─────────────────────────────────────────────────────────────────────────
// Rendu HTML et texte
// ─────────────────────────────────────────────────────────────────────────

const VIOLET = '#6200EE';
const TURQUOISE = '#03DAC5';
const VERT_COCHE = '#00897B';
const TEXTE = '#212121';
const TEXTE_DOUX = '#424242';
const GRIS = '#757575';
const FOND = '#F4F1FB';
const FOND_ENCADRE = '#F7F3FF';
const POLICE = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const PIED = 'Vous recevez cet e-mail au sujet de votre abonnement ChinoisLingo.';

/** Contenu d'un e-mail, décrit une seule fois puis rendu en HTML et en texte. */
type Bloc =
  | { type: 'paragraphe'; texte: string }
  | { type: 'recapitulatif'; lignes: [libelle: string, valeur: string][] }
  | { type: 'liste'; elements: string[] };

interface Message {
  base: string;
  /** Aperçu affiché par la boîte de réception à côté du sujet. */
  apercu: string;
  titre: string;
  blocs: Bloc[];
  bouton: { libelle: string; chemin: string };
  desabonnement?: LiensDesabonnement;
}

function echapper(valeur: string): string {
  return valeur
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Typographie française : espace insécable avant « : ; ! ? % » et à
 * l'intérieur des guillemets, pour qu'un signe ne tombe jamais seul en début
 * de ligne sur un écran étroit.
 */
function typographie(texte: string): string {
  return texte.replace(/ ([:;!?%»])/g, '\u00A0$1').replace(/« /g, '«\u00A0');
}

/**
 * `**texte**` devient du gras. L'échappement a lieu AVANT : un prénom saisi
 * par l'apprenant ne peut donc pas injecter de balise dans l'e-mail.
 */
function enrichir(texte: string): string {
  return echapper(typographie(texte)).replace(
    /\*\*(.+?)\*\*/g,
    `<strong style="color:${TEXTE};">$1</strong>`
  );
}

function sansMarques(texte: string): string {
  return typographie(texte).replace(/\*\*(.+?)\*\*/g, '$1');
}

function blocHtml(bloc: Bloc): string {
  switch (bloc.type) {
    case 'paragraphe':
      return `<p style="margin:0 0 16px;font-family:${POLICE};font-size:15px;line-height:1.65;color:${TEXTE_DOUX};">${enrichir(bloc.texte)}</p>`;

    case 'recapitulatif':
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px;background:${FOND_ENCADRE};border-radius:14px;">
<tr><td style="padding:12px 20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${bloc.lignes
  .map(
    ([libelle, valeur]) => `<tr>
<td style="padding:6px 12px 6px 0;font-family:${POLICE};font-size:13px;color:${GRIS};">${echapper(libelle)}</td>
<td align="right" style="padding:6px 0;font-family:${POLICE};font-size:14px;font-weight:700;color:${TEXTE};">${echapper(valeur)}</td>
</tr>`
  )
  .join('\n')}
</table>
</td></tr>
</table>`;

    case 'liste':
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">
${bloc.elements
  .map(
    (element) => `<tr>
<td valign="top" style="padding:3px 10px 3px 0;font-family:${POLICE};font-size:15px;font-weight:700;color:${VERT_COCHE};">✓</td>
<td style="padding:3px 0;font-family:${POLICE};font-size:15px;line-height:1.5;color:${TEXTE_DOUX};">${enrichir(element)}</td>
</tr>`
  )
  .join('\n')}
</table>`;
  }
}

function blocTexte(bloc: Bloc): string {
  switch (bloc.type) {
    case 'paragraphe':
      return sansMarques(bloc.texte);
    case 'recapitulatif':
      return bloc.lignes.map(([libelle, valeur]) => `${libelle} : ${valeur}`).join('\n');
    case 'liste':
      return bloc.elements.map((element) => `  ✓ ${sansMarques(element)}`).join('\n');
  }
}

function rendre(m: Message): { html: string; texte: string } {
  const urlBouton = `${m.base}${m.bouton.chemin}`;
  const urlCompte = `${m.base}${CHEMIN_ABONNEMENT}`;

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${echapper(m.titre)}</title>
</head>
<body style="margin:0;padding:0;background:${FOND};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${echapper(m.apercu)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${FOND};">
<tr><td align="center" style="padding:32px 12px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#FFFFFF;border-radius:20px;overflow:hidden;">
<tr><td style="height:6px;line-height:6px;font-size:0;background-color:${VIOLET};background-image:linear-gradient(90deg,${VIOLET},${TURQUOISE});">&nbsp;</td></tr>
<tr><td align="center" style="padding:32px 32px 8px;">
<a href="${m.base}" style="text-decoration:none;"><img src="${m.base}/chinoislingo-logo.png" width="168" alt="ChinoisLingo" style="display:block;width:168px;max-width:100%;height:auto;border:0;"></a>
</td></tr>
<tr><td style="padding:20px 32px 4px;">
<h1 style="margin:0 0 18px;font-family:${POLICE};font-size:22px;line-height:1.3;font-weight:800;color:${TEXTE};">${echapper(m.titre)}</h1>
${m.blocs.map(blocHtml).join('\n')}
</td></tr>
<tr><td align="center" style="padding:8px 32px 28px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="center" bgcolor="${VIOLET}" style="border-radius:999px;">
<a href="${urlBouton}" style="display:inline-block;padding:14px 34px;font-family:${POLICE};font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">${echapper(m.bouton.libelle)}</a>
</td>
</tr></table>
</td></tr>
<tr><td style="padding:0 32px 32px;font-family:${POLICE};font-size:15px;line-height:1.6;color:${TEXTE_DOUX};">
À très vite,<br><strong style="color:${TEXTE};">L’équipe ChinoisLingo</strong>
</td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
<tr><td align="center" style="padding:20px 16px 8px;font-family:${POLICE};font-size:12px;line-height:1.6;color:${GRIS};">
<strong style="color:${VIOLET};">ChinoisLingo</strong> — Le chinois devient facile<br>
${echapper(PIED)}<br>
<a href="${urlCompte}" style="color:${GRIS};text-decoration:underline;">Gérer mon abonnement</a>${
  m.desabonnement
    ? ` &nbsp;·&nbsp; <a href="${m.desabonnement.page}" style="color:${GRIS};text-decoration:underline;">Ne plus recevoir ces e-mails</a>`
    : ''
}
</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`;

  const texte = [
    m.titre,
    '',
    ...m.blocs.flatMap((bloc) => [blocTexte(bloc), '']),
    `${m.bouton.libelle} : ${urlBouton}`,
    '',
    'À très vite,',
    'L’équipe ChinoisLingo',
    '',
    '—',
    'ChinoisLingo — Le chinois devient facile',
    PIED,
    `Gérer mon abonnement : ${urlCompte}`,
    ...(m.desabonnement ? [`Ne plus recevoir ces e-mails : ${m.desabonnement.page}`] : []),
  ].join('\n');

  return { html, texte };
}
