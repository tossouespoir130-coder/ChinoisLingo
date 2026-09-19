export type ProfilType = 
  | 'entrepreneur'
  | 'professionnel' 
  | 'etudiant' 
  | 'independant' 
  | 'autre';

export type MotivationType = 
  | 'etudes' 
  | 'voyage' 
  | 'travail' 
  | 'passion' 
  | 'autre';

export type NiveauType = 
  | 'debutant' 
  | 'intermediaire_bas' 
  | 'intermediaire_avance';

export interface OnboardingState {
  profil: ProfilType | '';
  profilLabel: string;
  motivation: MotivationType | '';
  motivationLabel: string;
  niveau: NiveauType | '';
  niveauLabel: string;
  recommandationHSK: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5';
  recommandationTitre: string;
  recommandationDescription: string;
  recommandationLien: string;
  rappels: boolean;
}
