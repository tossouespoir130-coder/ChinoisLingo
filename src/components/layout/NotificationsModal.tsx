'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Portal } from '@/components/ui/Portal';
import { usePreferences } from '@/context/PreferencesContext';
import {
  Bell,
  X,
  Flame,
  Headphones,
  Sparkles,
  CheckCheck,
  ArrowRight,
  Clock
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  source: 'founder' | 'system';
  founderName?: string;
  founderRole?: string;
  founderAvatar?: string;
  type?: 'streak' | 'audio' | 'vocab';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_course_verites',
    source: 'founder',
    founderName: 'Espoir Chinois',
    founderRole: 'Fondateur de ChinoisLingo',
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
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
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
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
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
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
    founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
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

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationsChange?: (unreadCount: number) => void;
}

import { fetchNotifications, markNotificationAsRead } from '@/lib/services/notificationService';

export function NotificationsModal({ isOpen, onClose, onNotificationsChange }: NotificationsModalProps) {
  const router = useRouter();
  const { userAvatar } = usePreferences();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<'all' | 'founder' | 'system'>('all');

  // Load live notifications from Supabase
  useEffect(() => {
    async function loadNotifs() {
      const dbNotifs = await fetchNotifications();
      if (dbNotifs.length > 0) {
        const formatted: NotificationItem[] = dbNotifs.map((n) => ({
          id: n.id,
          source: (n.source === 'founder' ? 'founder' : 'system') as 'founder' | 'system',
          founderName: n.source === 'founder' ? 'Espoir Chinois' : undefined,
          founderRole: n.source === 'founder' ? 'Fondateur de ChinoisLingo' : undefined,
          founderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          title: n.title,
          message: n.message,
          timestamp: 'Récemment',
          isRead: !!n.is_read,
          actionUrl: n.action_url || '/tableau-de-bord',
          actionLabel: 'Consulter',
        }));
        setNotifications(formatted);
      }
    }

    loadNotifs();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const founderUnreadCount = notifications.filter(n => n.source === 'founder' && !n.isRead).length;

  useEffect(() => {
    if (isOpen) {
      if (onNotificationsChange) {
        onNotificationsChange(0);
      }
      const timer = setTimeout(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onNotificationsChange]);

  const markAllAsRead = async () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    if (onNotificationsChange) onNotificationsChange(0);

    for (const notif of notifications) {
      if (!notif.isRead) {
        await markNotificationAsRead(notif.id);
      }
    }
  };

  const markAsRead = async (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    setNotifications(updated);
    if (onNotificationsChange) {
      onNotificationsChange(updated.filter(n => !n.isRead).length);
    }
    await markNotificationAsRead(id);
  };

  const handleAction = (notif: NotificationItem) => {
    markAsRead(notif.id);
    if (notif.actionUrl) {
      onClose();
      router.push(notif.actionUrl);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'founder') return n.source === 'founder';
    if (activeFilter === 'system') return n.source === 'system';
    return true;
  });

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] flex items-start justify-center sm:justify-end p-4 sm:p-6 pt-16 sm:pt-20 bg-black/50 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="nixtio-card w-full max-w-lg bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[88vh] animate-scaleUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E0E0E0] dark:border-[#2D2D2D] flex items-center justify-between gap-3 bg-white dark:bg-[#1E1E1E]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center shadow-xs">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-[#212121] dark:text-[#F5F5F5]">
                  Centre de Notifications
                </h3>
                <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                  {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Toutes les notifications sont à jour'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1 btn-press"
                  title="Tout marquer comme lu"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tout lire</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#757575] hover:bg-slate-100 dark:hover:bg-[#2A2A2A] transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Segmented Filter Pills */}
          <div className="px-4 py-2 bg-[#FAFAFA] dark:bg-[#181818] border-b border-[#E0E0E0] dark:border-[#2D2D2D] flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              type="button"
              onClick={(e) => {
                setActiveFilter('all');
                e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all btn-press ${activeFilter === 'all'
                  ? 'bg-[#212121] dark:bg-white text-white dark:text-[#212121] shadow-xs'
                  : 'text-[#757575] dark:text-[#A0A0A0] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
            >
              Tous ({notifications.length})
            </button>

            {/* Founder Exclusive Purple Tab */}
            <button
              type="button"
              onClick={(e) => {
                setActiveFilter('founder');
                e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all btn-press ${activeFilter === 'founder'
                  ? 'bg-[#6200EE] text-white shadow-xs shadow-[#6200EE]/30'
                  : 'text-[#6200EE] dark:text-[#BB86FC] bg-[#6200EE]/10 hover:bg-[#6200EE]/20'
                }`}
            >
              <span>Espoir Chinois (Fondateur)</span>
              {founderUnreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#DD2C00]" />
              )}
            </button>

            {/* System Tab */}
            <button
              type="button"
              onClick={(e) => {
                setActiveFilter('system');
                e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all btn-press ${activeFilter === 'system'
                  ? 'bg-[#03DAC5] text-[#004D40] dark:text-black font-extrabold shadow-xs'
                  : 'text-[#757575] dark:text-[#A0A0A0] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
            >
              Système ({notifications.filter(n => n.source === 'system').length})
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {filteredNotifications.map((notif) => {
              const isFounder = notif.source === 'founder';

              if (isFounder) {
                /* ========================================================
                   EXCLUSIVE VIOLET/PURPLE STYLING FOR ESPOIR CHINOIS (FOUNDER)
                   ======================================================== */
                const founderImage = userAvatar || notif.founderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleAction(notif)}
                    className={`p-4 rounded-2xl transition-all cursor-pointer border relative overflow-hidden group btn-press ${notif.isRead
                        ? 'bg-[#6200EE]/[0.03] dark:bg-[#6200EE]/10 border-[#6200EE]/20'
                        : 'bg-gradient-to-br from-[#6200EE]/[0.10] via-[#BB86FC]/[0.06] to-[#6200EE]/[0.03] dark:from-[#6200EE]/25 dark:to-[#1E1E1E] border-[#6200EE] shadow-md shadow-[#6200EE]/15 ring-1 ring-[#6200EE]/30'
                      }`}
                  >
                    {/* Top Founder Identity Row */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={founderImage}
                            alt={notif.founderName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6200EE] shadow-sm shrink-0"
                          />
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#6200EE] text-white flex items-center justify-center text-[9px] shadow-xs">
                            <Sparkles className="w-2.5 h-2.5" />
                          </span>
                        </div>

                        <div className="min-w-0">
                          <span className="font-display font-black text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] truncate block">
                            {notif.founderName}
                          </span>
                          <p className="text-[10px] font-semibold text-[#6200EE] dark:text-[#BB86FC] truncate">
                            {notif.founderRole}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center gap-1 text-[10px] text-[#757575] dark:text-[#A0A0A0]">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{notif.timestamp}</span>
                        </div>
                        {!notif.isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#6200EE] dark:bg-[#BB86FC] ring-2 ring-white dark:ring-[#1E1E1E] animate-pulse" />
                        )}
                      </div>
                    </div>

                    {/* Subject & Message Body */}
                    <div className="space-y-1 pl-12">
                      <h4 className="font-display font-extrabold text-xs sm:text-sm text-[#6200EE] dark:text-[#BB86FC]">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-[#212121] dark:text-[#E0E0E0] leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                );
              }

              /* ========================================================
                 SYSTEM NOTIFICATIONS: SANS BADGE ENCADRÉ REDONDANT (ICÔNE + TITRE ÉPURÉ)
                 ======================================================== */
              const getSystemStyle = () => {
                switch (notif.type) {
                  case 'audio':
                    return {
                      icon: <Headphones className="w-4 h-4 text-[#00897B] dark:text-[#03DAC5]" />,
                      iconBg: 'bg-[#03DAC5]/15',
                      actionColor: 'text-[#00897B] dark:text-[#03DAC5]',
                      dotColor: 'bg-[#03DAC5]',
                      borderAccent: 'hover:border-[#03DAC5]/50',
                      unreadBg: 'bg-[#03DAC5]/[0.04] dark:bg-[#03DAC5]/[0.05] border-[#03DAC5]/30'
                    };
                  case 'vocab':
                    return {
                      icon: <Sparkles className="w-4 h-4 text-[#E91E63] dark:text-[#F06292]" />,
                      iconBg: 'bg-[#E91E63]/15',
                      actionColor: 'text-[#E91E63] dark:text-[#F06292]',
                      dotColor: 'bg-[#E91E63]',
                      borderAccent: 'hover:border-[#E91E63]/50',
                      unreadBg: 'bg-[#E91E63]/[0.04] dark:bg-[#E91E63]/[0.05] border-[#E91E63]/30'
                    };
                  case 'streak':
                  default:
                    return {
                      icon: <Flame className="w-4 h-4 fill-[#FFA000] text-[#FF5722]" />,
                      iconBg: 'bg-[#FF9800]/15',
                      actionColor: 'text-[#E65100] dark:text-[#FFB74D]',
                      dotColor: 'bg-[#FF9800]',
                      borderAccent: 'hover:border-[#FF9800]/50',
                      unreadBg: 'bg-[#FF9800]/[0.04] dark:bg-[#FF9800]/[0.05] border-[#FF9800]/30'
                    };
                }
              };

              const style = getSystemStyle();

              return (
                <div
                  key={notif.id}
                  onClick={() => handleAction(notif)}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 group border btn-press ${style.borderAccent} ${notif.isRead
                      ? 'bg-[#FAFAFA] dark:bg-[#252525] border-[#E0E0E0] dark:border-[#333333]'
                      : `${style.unreadBg} shadow-2xs`
                    }`}
                >
                  <div className={`w-8 h-8 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}>
                    {style.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1.5">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] truncate">
                        {notif.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-[#9E9E9E] shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{notif.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#757575] dark:text-[#CCCCCC] leading-relaxed mt-1 line-clamp-2">
                      {notif.message}
                    </p>

                    {notif.actionLabel && (
                      <div className={`mt-2 flex items-center gap-1 text-xs font-bold ${style.actionColor} group-hover:translate-x-0.5 transition-transform`}>
                        <span>{notif.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {!notif.isRead && (
                    <span className={`w-2 h-2 rounded-full ${style.dotColor} shrink-0 mt-2`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#FAFAFA] dark:bg-[#181818] border-t border-[#E0E0E0] dark:border-[#2D2D2D] text-center text-xs text-[#757575] dark:text-[#A0A0A0]">
            <span>Avec ChinoisLingo, le chinois devient facile.</span>
          </div>
        </div>
      </div>
    </Portal>
  );
}
