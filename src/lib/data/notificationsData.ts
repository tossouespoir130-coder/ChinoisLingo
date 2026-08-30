export interface NotificationItem {
  id: string;
  source: 'founder' | 'system';
  founderName?: string;
  founderRole?: string;
  founderAvatar?: string;
  type?: 'streak' | 'audio' | 'vocab' | 'video';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_video_xiaoli_ep1',
    source: 'founder',
    founderName: 'Espoir Chinois',
    founderRole: 'Fondateur de ChinoisLingo',
    founderAvatar: '/espoir-chinois.jpg',
    type: 'video',
    title: 'Nouvelle Série Vidéo : Les Aventures de Xiao Li 🎬',
    message: 'Découvrez les aventures immersives de Xiao Li, un chaton curieux à Pékin, pour apprendre vos premiers mots et phrases du HSK 1 en vidéo animée.',
    timestamp: 'Nouveau',
    isRead: false,
    actionUrl: '/ecoute-lecture?type=videos&id=video_xiaoli_ep1',
    actionLabel: 'Regarder la vidéo'
  },
  {
    id: 'notif_course_verites',
    source: 'founder',
    founderName: 'Espoir Chinois',
    founderRole: 'Fondateur de ChinoisLingo',
    founderAvatar: '/espoir-chinois.jpg',
    type: 'video',
    title: '13 Vérités Brutales sur le Chinois Découvertes Trop Tard 🎬',
    message: 'Une masterclass vidéo exclusive pour déconstruire les illusions, corriger les erreurs de méthode et progresser rapidement en mandarin.',
    timestamp: 'Il y a 10 min',
    isRead: false,
    actionUrl: '/formation?course=course_13_verites_brutales',
    actionLabel: 'Voir la masterclass'
  },
  {
    id: 'notif_course_tons',
    source: 'founder',
    founderName: 'Espoir Chinois',
    founderRole: 'Fondateur de ChinoisLingo',
    founderAvatar: '/espoir-chinois.jpg',
    type: 'video',
    title: 'Nouvelle Formation : Maîtriser les Tons en Chinois 🎯',
    message: 'Domptez les 4 intonations et le ton neutre avec ma méthode pas à pas pour vous faire comprendre naturellement par les natifs.',
    timestamp: 'Il y a 30 min',
    isRead: false,
    actionUrl: '/formation?course=course_maitrise_tons_chinois',
    actionLabel: 'Lancer la formation'
  },
  {
    id: 'notif_course_vhsk1',
    source: 'founder',
    founderName: 'Espoir Chinois',
    founderRole: 'Fondateur de ChinoisLingo',
    founderAvatar: '/espoir-chinois.jpg',
    title: 'Nouvelle Formation : Vocabulaire HSK 1 Mot par Mot 📚',
    message: 'Une formation évolutive animée par Espoir Chinois dont le but est de couvrir l’intégralité des 150 mots et expressions clés du HSK 1 avec des ajouts réguliers.',
    timestamp: 'Aujourd’hui',
    isRead: false,
    actionUrl: '/formation?course=course_vocabulaire_hsk1_fondamental',
    actionLabel: 'Commencer le HSK 1'
  },
  {
    id: 'notif_founder_1',
    source: 'founder',
    founderName: 'Espoir Chinois',
    founderRole: 'Fondateur de ChinoisLingo',
    founderAvatar: '/espoir-chinois.jpg',
    title: 'Bienvenue sur ChinoisLingo ! 🌟',
    message: 'Heureux de vous accompagner dans votre apprentissage du mandarin. La méthode par immersion et répétition espacée est prête pour vous.',
    timestamp: 'Récemment',
    isRead: true,
    actionUrl: '/formation',
    actionLabel: 'Découvrir les formations'
  },
  {
    id: 'notif_sys_audio',
    source: 'system',
    type: 'audio',
    title: 'Nouvelle Histoire Audio Disponible 🎧',
    message: '« Une Journée à Pékin » avec paroles interactives et Pinyin synchronisé est désormais accessible.',
    timestamp: 'Récemment',
    isRead: true,
    actionUrl: '/ecoute-lecture',
    actionLabel: 'Écouter maintenant'
  }
];
