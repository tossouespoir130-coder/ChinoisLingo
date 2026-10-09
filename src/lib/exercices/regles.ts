import { estSerieReussieParRubrique, estScoreParfait } from './configRubriques';

export { estSerieReussieParRubrique, estScoreParfait };

/** Une série est réussie si le score atteint le seuil de points requis (ex. 4/5 ou 2/3). */
export function estSerieReussie(score: number, totalQuestions: number, rubriqueId?: string): boolean {
  return estSerieReussieParRubrique(score, totalQuestions, rubriqueId);
}

/** Niveaux où le cycle d'écoute est joué deux fois, comme à l'examen officiel. */
export function estDoubleEcoute(niveau: string): boolean {
  return ['HSK 1', 'HSK 2', 'HSK 3'].includes(niveau);
}

/**
 * Une série est-elle publiée ? Même règle que le reste d'Écoute & Lecture :
 * sans date, immédiatement visible ; avec une date « AAAA-MM-JJ », visible à
 * partir de 12 h 00 GMT ce jour-là.
 */
export function estSeriePubliee(datePublication: string | undefined, maintenant: Date = new Date()): boolean {
  if (!datePublication) return true;
  const texte = datePublication.trim();
  const ms = /^\d{4}-\d{2}-\d{2}$/.test(texte)
    ? new Date(`${texte}T12:00:00Z`).getTime()
    : new Date(texte).getTime();
  if (Number.isNaN(ms)) return true;
  return maintenant.getTime() >= ms;
}
