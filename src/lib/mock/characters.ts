import personnagesJson from '@/content/personnages.json';

export interface Character {
  id: string;
  name: string;
  pinyinName: string;
  country: string;
  nationality: string;
  role: string;
  traits: string[];
  context: string;
  color: string;
  badge: string;
  avatar: string;
}

const avatarsMap: Record<string, string> = {
  espoir_chinois: '/espoir-chinois.jpg',
  katia: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  brice: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  aicha: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
  jean_luc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  fatou: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  wang_wei: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
};

export const mockCharacters: Character[] = (personnagesJson.personnages || []).map((p: any) => ({
  id: p.id,
  name: p.nom,
  pinyinName: p.nomChinois,
  country: p.paysOrigine,
  nationality: p.nationalite,
  role: p.role,
  traits: p.traitsCaractere || [],
  context: p.contexteApparition,
  color: p.couleurUI || '#6200EE',
  badge: p.badgeRole,
  avatar: avatarsMap[p.id] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
}));
