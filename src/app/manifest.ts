import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ChinoisLingo — Le chinois devient facile',
    short_name: 'ChinoisLingo',
    description: 'Plateforme d’apprentissage complète du mandarin pour les francophones : vocabulaire HSK, répétition espacée, audio synchronisé et formations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#6200EE',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
