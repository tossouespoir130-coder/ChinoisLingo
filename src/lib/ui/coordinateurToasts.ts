/**
 * Coordinateur des notifications flottantes.
 *
 * Le rappel de révision et l'annonce de nouveau contenu sont tous deux
 * positionnés en bas à droite, à quelques pixels près : affichés en même
 * temps, ils se chevauchaient et devenaient illisibles.
 *
 * Une seule notification occupe donc l'emplacement à la fois. Celle qui
 * arrive alors qu'il est pris s'abonne et apparaîtra dès sa libération,
 * plutôt que d'être perdue.
 *
 * Volontairement minimal : un module partagé suffit, ces composants vivant
 * tous deux dans le même arbre React sans lien de parenté direct.
 */

let occupant: string | null = null;
const enAttente = new Set<() => void>();

/**
 * Tente de réserver l'emplacement.
 * Retourne `true` si la notification peut s'afficher.
 */
export function reserverEmplacement(id: string): boolean {
  if (occupant !== null && occupant !== id) return false;
  occupant = id;
  return true;
}

/** Libère l'emplacement et réveille les notifications en attente. */
export function libererEmplacement(id: string): void {
  if (occupant !== id) return;
  occupant = null;

  // Copie avant parcours : un abonné peut se désabonner en réagissant.
  const aPrevenir = Array.from(enAttente);
  enAttente.clear();
  aPrevenir.forEach((cb) => cb());
}

/**
 * S'inscrit pour être prévenu de la libération de l'emplacement.
 * Retourne la fonction de désinscription.
 */
export function attendreEmplacement(rappel: () => void): () => void {
  enAttente.add(rappel);
  return () => enAttente.delete(rappel);
}
