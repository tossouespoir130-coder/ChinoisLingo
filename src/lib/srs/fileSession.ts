import { debutDuJour, estDue, REGLAGES, type EtatCarte } from './planificateur';

/**
 * File d'une session de révision, comme un paquet Anki :
 * - les cartes en apprentissage, dès qu'elles sont dues ;
 * - les révisions dont l'échéance est passée ;
 * - les nouvelles cartes, dans la limite quotidienne du paquet.
 */
export interface FileSession {
  apprentissage: string[];
  revisions: string[];
  nouvelles: string[];
}

export function construireFile(
  hanzisDuPaquet: string[],
  etats: Record<string, EtatCarte>,
  maintenant: Date,
  limiteNouvellesParJour: number,
  melanger: (liste: string[]) => string[]
): FileSession {
  const paquet = Array.from(new Set(hanzisDuPaquet));
  const debutJour = debutDuJour(maintenant).getTime();

  const apprentissage: string[] = [];
  const revisions: string[] = [];
  const jamaisVues: string[] = [];
  let nouvellesDuJour = 0;

  for (const hz of paquet) {
    const etat = etats[hz];
    if (!etat) {
      jamaisVues.push(hz);
      continue;
    }
    if (new Date(etat.premiereRevision).getTime() >= debutJour) nouvellesDuJour++;
    if (etat.etat === 'revision') {
      if (estDue(etat, maintenant)) revisions.push(hz);
    } else {
      apprentissage.push(hz);
    }
  }

  revisions.sort((a, b) => new Date(etats[a].echeance).getTime() - new Date(etats[b].echeance).getTime());
  const restantes = Math.max(0, limiteNouvellesParJour - nouvellesDuJour);

  return { apprentissage, revisions, nouvelles: melanger(jamaisVues).slice(0, restantes) };
}

/** Prochaine carte à présenter, ou `null` si la session est terminée. */
export function prochaineCarte(file: FileSession, etats: Record<string, EtatCarte>, maintenant: Date): string | null {
  const parEcheance = (liste: string[]) =>
    [...liste].sort((a, b) => new Date(etats[a].echeance).getTime() - new Date(etats[b].echeance).getTime());

  const apprentissageDues = parEcheance(file.apprentissage.filter((hz) => estDue(etats[hz], maintenant)));
  if (apprentissageDues.length > 0) return apprentissageDues[0];
  if (file.revisions.length > 0) return file.revisions[0];
  if (file.nouvelles.length > 0) return file.nouvelles[0];

  // Plus rien d'autre : on avance une carte en apprentissage due sous peu (comme Anki).
  const enAvance = parEcheance(
    file.apprentissage.filter((hz) => estDue(etats[hz], maintenant, REGLAGES.avanceApprentissageMin))
  );
  return enAvance[0] ?? null;
}

/** Retire la carte notée de la file et la range selon son nouvel état. */
export function mettreAJourFile(file: FileSession, carte: EtatCarte): FileSession {
  const sans = (liste: string[]) => liste.filter((hz) => hz !== carte.hanzi);
  return {
    revisions: sans(file.revisions),
    nouvelles: sans(file.nouvelles),
    apprentissage: carte.etat === 'revision' ? sans(file.apprentissage) : [...sans(file.apprentissage), carte.hanzi],
  };
}

/** Compteurs affichés en tête de session (bleu / rouge / vert dans Anki). */
export function compteurs(file: FileSession) {
  return {
    nouvelles: file.nouvelles.length,
    apprentissage: file.apprentissage.length,
    revisions: file.revisions.length,
  };
}
