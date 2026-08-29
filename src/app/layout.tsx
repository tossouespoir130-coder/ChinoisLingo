import type { Metadata, Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans, Noto_Sans_SC, Noto_Sans } from 'next/font/google';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-hanzi',
  display: 'swap',
  weight: ['400', '500', '700', '900'],
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-pinyin',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ChinoisLingo — Le chinois devient facile',
  description:
    'Avec ChinoisLingo, le chinois devient facile. Plateforme d’apprentissage complète du mandarin pour les francophones : vocabulaire, répétition espacée, écoute & lecture audio synchronisée, formations et livres.',
};

import { AuthProvider } from '@/lib/auth/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${notoSansSC.variable} ${notoSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-screen text-slate-900 selection:bg-rose-200 selection:text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
