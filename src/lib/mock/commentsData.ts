export interface CourseComment {
  id: string;
  courseId: string;
  lessonId: string;
  authorName: string;
  authorAvatar: string;
  isInstructor?: boolean;
  authorRole?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: CourseComment[];
}

export const initialCourseComments: CourseComment[] = [
  // Commentaires pour la leçon 1 du HSK 1 (Le verbe 是 shì)
  {
    id: 'comm_hsk1_1',
    courseId: 'course_vocabulaire_hsk1_fondamental',
    lessonId: 'vhsk1_ep1',
    authorName: 'Alexandre M.',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    content: 'Merci pour l\'explication très claire sur le piège de ne pas mettre 是 devant un adjectif ! C\'était exactement mon erreur.',
    timestamp: 'Il y a 2 heures',
    likes: 4,
    replies: [
      {
        id: 'reply_hsk1_1',
        courseId: 'course_vocabulaire_hsk1_fondamental',
        lessonId: 'vhsk1_ep1',
        authorName: 'Espoir Chinois',
        authorAvatar: '/espoir-chinois.jpg',
        isInstructor: true,
        authorRole: 'Formateur',
        content: 'Exactement Alexandre ! Retiens bien : en chinois, l\'adjectif porte en lui-même la valeur de verbe qualificatif, donc 是 est inutile ici. Continue comme ça ! 🚀',
        timestamp: 'Il y a 1 heure',
        likes: 7
      }
    ]
  },
  {
    id: 'comm_hsk1_2',
    courseId: 'course_vocabulaire_hsk1_fondamental',
    lessonId: 'vhsk1_ep1',
    authorName: 'Sophie L.',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    content: 'La prononciation au 4e ton sec est tellement mieux comprise maintenant. Hâte de voir la suite !',
    timestamp: 'Il y a 5 heures',
    likes: 2
  },

  // Commentaires pour la masterclass 13 Vérités Brutales
  {
    id: 'comm_verites_1',
    courseId: 'course_13_verites_brutales',
    lessonId: 'verites_ep1',
    authorName: 'Thomas D.',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    content: 'Cette vidéo m\'a ouvert les yeux. J\'ai passé 6 mois à apprendre des listes isolées de caractères sans jamais pratiquer l\'oral. Tout change dès aujourd\'hui !',
    timestamp: 'Hier',
    likes: 12,
    replies: [
      {
        id: 'reply_verites_1',
        courseId: 'course_13_verites_brutales',
        lessonId: 'verites_ep1',
        authorName: 'Espoir Chinois',
        authorAvatar: '/espoir-chinois.jpg',
        isInstructor: true,
        authorRole: 'Formateur',
        content: 'C\'est l\'erreur n°1 de 90% des apprenants Thomas. En te focalisant sur les structures orales et le vocabulaire contextuel, tu vas gagner un temps précieux ! 💪',
        timestamp: 'Hier',
        likes: 9
      }
    ]
  },

  // Commentaires pour la masterclass Tons
  {
    id: 'comm_tons_1',
    courseId: 'course_maitrise_tons_chinois',
    lessonId: 'tons_ep1',
    authorName: 'Camille R.',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    content: 'L\'exercice avec la main pour accompagner la hauteur de chaque ton fonctionne à merveille ! Merci Espoir !',
    timestamp: 'Il y a 3 heures',
    likes: 6
  }
];
