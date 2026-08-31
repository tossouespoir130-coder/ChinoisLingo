'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Flame, User, LogOut, Settings, CreditCard, UserCheck, ChevronDown } from 'lucide-react';
import { mockCurrentUser, mockUserStreak } from '@/lib/mock/dashboard';
import { usePreferences } from '@/context/PreferencesContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NotificationsModal } from './NotificationsModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { fetchMergedNotifications } from '@/lib/services/notificationService';

const topTabs = [
  { name: 'Accueil', href: '/tableau-de-bord' },
  { name: 'Vocabulaire', href: '/vocabulaire' },
  { name: 'Écoute & Lecture', href: '/ecoute-lecture' },
  { name: 'Formations', href: '/formation' },
  { name: 'Livres & Programmes', href: '/livres' },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { userAvatar, userName } = usePreferences();
  const { user, profile, signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Sync and update unread count persistently
  useEffect(() => {
    async function updateCount() {
      try {
        const notifs = await fetchMergedNotifications();
        const unread = notifs.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch {
        setUnreadCount(0);
      }
    }

    updateCount();

    const handleNotificationsUpdated = () => {
      updateCount();
    };

    window.addEventListener('chinoislingo_notifications_updated', handleNotificationsUpdated);
    return () => {
      window.removeEventListener('chinoislingo_notifications_updated', handleNotificationsUpdated);
    };
  }, []);

  // Close profile menu upon clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    await signOut();
    router.push('/connexion');
  };

  return (
    <>
      <header className="w-full flex items-center justify-between gap-3 py-1">
        {/* Brand Logo (Visible on All Devices - Extra Compact & Refined) */}
        <div className="flex items-center shrink-0">
          <Link
            href="/tableau-de-bord"
            className="inline-flex items-center hover:opacity-85 active:scale-95 transition-all btn-press select-none py-1"
            title="ChinoisLingo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="ChinoisLingo"
              className="h-6 sm:h-7 md:h-8 w-auto max-w-[135px] sm:max-w-[165px] object-contain drop-shadow-xs"
            />
          </Link>
        </div>

        {/* Desktop Only Centered Segmented Control (Hidden on iPad Pro & Mobile - xl breakpoint) */}
        <nav className="hidden xl:flex items-center gap-1.5 p-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] backdrop-blur-md">
          {topTabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all btn-press ${
                  isActive
                    ? 'bg-[#6200EE] text-white shadow-xs'
                    : 'text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Quick Search, Streak Pill, Notifications & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Universal Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-white hover:border-[#6200EE] active:scale-95 transition-all text-xs font-medium shadow-2xs btn-press"
            title="Recherche globale (⌘K ou /)"
          >
            <Search className="w-3.5 h-3.5 text-[#757575]" />
            <span className="hidden sm:inline text-xs text-[#757575]">Rechercher...</span>
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[9.5px] font-mono font-bold text-[#757575]">
              ⌘K
            </kbd>
          </button>

          {/* User Streak Pill with Vivid Dynamic Flames Animation */}
          <div 
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-extrabold shadow-2xs"
            title={`${mockUserStreak.current} jours de pratique consécutifs !`}
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span className="font-mono">{mockUserStreak.current}</span>
          </div>

          {/* Interactive Notifications Bell -> Opens Notification Modal */}
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen(true);
              setUnreadCount(0);
            }}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#1E1E1E] text-[#757575] dark:text-[#A0A0A0] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:bg-slate-50 dark:hover:bg-[#252525] active:scale-90 transition-all shadow-xs btn-press"
            aria-label="Centre de notifications"
            title="Centre de notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#E53935] text-white font-extrabold text-[9px] sm:text-[9.5px] leading-none flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-[#1E1E1E]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar / Dropdown Menu (Toujours visible et accessible) */}
          <div className="relative" ref={profileMenuRef}>
            {(() => {
              const displayAvatar = (profile?.avatar_url && !profile.avatar_url.includes('photo-1534528741775')) 
                ? profile.avatar_url 
                : (userAvatar || '/espoir-chinois.jpg');
              return (
                <>
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-xs ring-2 ring-transparent hover:ring-[#6200EE] cursor-pointer"
                    title={`Profil : ${profile?.username || profile?.full_name || userName || 'Espoir Chinois'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayAvatar}
                      alt={profile?.username || profile?.full_name || userName || 'Profil'}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {/* Profile Dropdown Card */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-xl border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-2xl shadow-black/10 p-3.5 space-y-3 z-50 animate-slideUp">
                      {/* User Info Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-[#E0E0E0] dark:border-[#2D2D2D]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={displayAvatar}
                          alt={profile?.username || 'Profil'}
                          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#6200EE]/20 shadow-xs"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] truncate">
                            {profile?.username || profile?.full_name || userName || 'Espoir Chinois'}
                          </h4>
                          <p className="text-[10px] text-[#757575] dark:text-[#A0A0A0] truncate">
                            {profile?.email || user?.email || 'espoirchinois@gmail.com'}
                          </p>
                        </div>
                      </div>

                      {/* Navigation Links : 1. Profil -> 2. Abonnement -> 3. Préférences */}
                      <div className="space-y-1">
                  <Link
                    href="/mon-compte?tab=profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-[#6200EE]/10 hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#757575]" />
                    <span>Mon Profil</span>
                  </Link>

                  <Link
                    href="/mon-compte?tab=subscription"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-[#6200EE]/10 hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-[#757575]" />
                    <span>Abonnement</span>
                  </Link>

                  <Link
                    href="/mon-compte?tab=preferences"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-[#6200EE]/10 hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#757575]" />
                    <span>Préférences</span>
                  </Link>
                </div>

                {/* Authentication Action Button: Toujours Se déconnecter */}
                <div className="pt-2 border-t border-[#E0E0E0] dark:border-[#2D2D2D]">
                  <button
                    onClick={handleSignOut}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white text-xs font-bold transition-all btn-press cursor-pointer group"
                    title="Se déconnecter de votre compte"
                  >
                    <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  </div>
</header>

      {/* Global Interactive Modals */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationsModal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)}
        onNotificationsChange={(count) => setUnreadCount(count)}
      />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
