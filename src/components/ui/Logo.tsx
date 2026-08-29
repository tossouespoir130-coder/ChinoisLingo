'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
}

export function Logo({
  className = '',
  variant = 'full',
  size = 'md',
  href = '/tableau-de-bord',
}: LogoProps) {
  // Height configurations
  const heightStyles = {
    sm: variant === 'full' ? 'h-6 sm:h-7' : 'w-7 h-7',
    md: variant === 'full' ? 'h-8 sm:h-9' : 'w-9 h-9',
    lg: variant === 'full' ? 'h-10 sm:h-12' : 'w-11 h-11',
    xl: variant === 'full' ? 'h-14 sm:h-16' : 'w-16 h-16',
  };

  const content = (
    <div className={`inline-flex items-center gap-2 group transition-transform duration-200 active:scale-95 select-none ${className}`}>
      {variant === 'full' ? (
        <div className={`relative ${heightStyles[size]} aspect-[684/221] shrink-0`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="ChinoisLingo Logo"
            className="w-full h-full object-contain drop-shadow-2xs group-hover:scale-102 transition-transform duration-300"
            loading="eager"
          />
        </div>
      ) : (
        <div className={`relative ${heightStyles[size]} rounded-2xl flex items-center justify-center shrink-0`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/chinoislingo-icon.png"
            alt="ChinoisLingo Icon"
            className="w-full h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            loading="eager"
          />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} title="ChinoisLingo" className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
