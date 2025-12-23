'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Crown, Medal, Award } from 'lucide-react';

interface DramaItem {
  rank: string;
  title: string;
  book_id: string;
  image: string;
  views: string;
  episodes: string;
}

interface HeroSectionProps {
  trending: DramaItem[];
}

export const HeroSection: React.FC<HeroSectionProps> = (props) => {
  const { trending } = props;

  if (!trending || trending.length === 0) {
    return null;
  }

  const top3 = trending.slice(0, 3);
  const hero = top3[0];
  const sideCards = top3.slice(1);

  const getRankBadge = (rank: string) => {
    const rankNum = parseInt(rank);
    if (rankNum === 1) {
      return {
        icon: Crown,
        className: 'bg-yellow-500 text-white',
        text: 'TOP 1'
      };
    }
    if (rankNum === 2) {
      return {
        icon: Medal,
        className: 'bg-zinc-400 text-white',
        text: 'TOP 2'
      };
    }
    if (rankNum === 3) {
      return {
        icon: Award,
        className: 'bg-amber-600 text-white',
        text: 'TOP 3'
      };
    }
    return null;
  };

  const renderHeroCard = () => {
    if (!hero) return null;
    
    const badge = getRankBadge(hero.rank);
    const IconComponent = badge?.icon;

    return React.createElement(
      'div',
      { className: 'lg:col-span-2 relative group cursor-pointer overflow-hidden rounded-xl' },
      React.createElement(
        Link,
        { href: `/watch/${hero.book_id}` },
        React.createElement(
          'div',
          { className: 'relative aspect-video lg:aspect-[2/1]' },
          React.createElement(Image, {
            src: hero.image,
            alt: hero.title,
            fill: true,
            className: 'object-cover transition-transform duration-300 group-hover:scale-105',
            referrerPolicy: 'no-referrer'
          }),
          React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' }),
          React.createElement(
            'div',
            { className: 'absolute bottom-0 left-0 right-0 p-6 lg:p-8' },
            React.createElement(
              'div',
              { className: 'flex items-center gap-3 mb-3' },
              badge && IconComponent && React.createElement(
                'div',
                { className: `flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${badge.className}` },
                React.createElement(IconComponent, { className: 'w-4 h-4' }),
                badge.text
              ),
              React.createElement(
                'span',
                { className: 'text-zinc-300 text-sm' },
                `🔥 ${hero.views} views`
              )
            ),
            React.createElement(
              'h1',
              { className: 'text-2xl lg:text-4xl font-bold text-white mb-3 line-clamp-2' },
              hero.title
            ),
            React.createElement(
              'div',
              { className: 'flex items-center gap-4 text-zinc-300 text-sm mb-4' },
              React.createElement(
                'span',
                null,
                `${hero.episodes} episodes`
              )
            ),
            React.createElement(
              'button',
              { className: 'bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors' },
              React.createElement(Play, { className: 'w-5 h-5' }),
              'Watch Now'
            )
          )
        )
      )
    );
  };

  const renderSideCards = () => {
    return React.createElement(
      'div',
      { className: 'space-y-6' },
      sideCards.map((item) => {
        const badge = getRankBadge(item.rank);
        const IconComponent = badge?.icon;
        
        return React.createElement(
          Link,
          { key: item.rank, href: `/watch/${item.book_id}` },
          React.createElement(
            'div',
            { className: 'relative group cursor-pointer overflow-hidden rounded-lg' },
            React.createElement(
              'div',
              { className: 'relative aspect-video' },
              React.createElement(Image, {
                src: item.image,
                alt: item.title,
                fill: true,
                className: 'object-cover transition-transform duration-300 group-hover:scale-105',
                referrerPolicy: 'no-referrer'
              }),
              React.createElement('div', { className: 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' }),
              React.createElement(
                'div',
                { className: 'absolute bottom-0 left-0 right-0 p-4' },
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-2 mb-2' },
                  badge && IconComponent && React.createElement(
                    'div',
                    { className: `flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${badge.className}` },
                    React.createElement(IconComponent, { className: 'w-3 h-3' }),
                    badge.text
                  )
                ),
                React.createElement(
                  'h3',
                  { className: 'text-lg font-bold text-white mb-1 line-clamp-2' },
                  item.title
                ),
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-3 text-zinc-300 text-xs' },
                  React.createElement('span', null, `🔥 ${item.views}`),
                  React.createElement('span', null, `${item.episodes} eps`)
                )
              )
            )
          )
        );
      })
    );
  };

  return React.createElement(
    'div',
    { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12' },
    renderHeroCard(),
    renderSideCards()
  );
};