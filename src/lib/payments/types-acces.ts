/**
 * Types partagés du contrôle d'accès.
 *
 * Fichier volontairement minuscule et sans dépendance : il est importé aussi
 * bien par la configuration des droits que par les pages de contenu, sans
 * jamais créer de cycle d'imports.
 */

export type ContentTypeAcces =
  | 'chansons'
  | 'articles'
  | 'histoires'
  | 'dialogues'
  | 'podcasts'
  | 'videos';
