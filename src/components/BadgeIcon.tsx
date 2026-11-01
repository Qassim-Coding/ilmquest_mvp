import React from 'react';
import { BadgeDef } from '../lib/learning';
import { Translations } from '../i18n/translations';

// Couleur de chaque badge une fois gagné (classes Tailwind de la palette)
const BADGE_STYLES: Record<BadgeDef['kind'], { shape: string; text: string }> = {
  names: { shape: 'fill-primary', text: 'fill-soft-ink' },
  'first-challenge': { shape: 'fill-accent', text: 'fill-accent-ink' },
  perfect: { shape: 'fill-info', text: 'fill-info-ink' },
  'study-days': { shape: 'fill-accent', text: 'fill-accent-ink' },
};

/** Texte court affiché au centre du badge */
function badgeCenter(badge: BadgeDef): string {
  if (badge.kind === 'first-challenge') return '1';
  if (badge.kind === 'perfect') return '100';
  return String(badge.value);
}

/** Libellé affiché sous le badge */
export function badgeLabel(badge: BadgeDef, t: Translations): string {
  switch (badge.kind) {
    case 'names':
      return t.challenge.badgeNames(badge.value);
    case 'first-challenge':
      return t.challenge.badgeFirst;
    case 'perfect':
      return t.challenge.badgePerfect;
    case 'study-days':
      return t.challenge.badgeStudy(badge.value);
    default:
      return '';
  }
}

interface BadgeIconProps {
  badge: BadgeDef;
  earned: boolean;
  className?: string;
}

/** Étoile à huit branches (motif géométrique), sans personnage ni emoji */
export default function BadgeIcon({ badge, earned, className = 'w-11 h-11' }: BadgeIconProps) {
  const style = BADGE_STYLES[badge.kind];
  const center = badgeCenter(badge);
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g className={earned ? style.shape : 'fill-track'}>
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)" />
      </g>
      <circle cx="12" cy="12" r="5.6" className="fill-surface" />
      <text
        x="12"
        y={center.length > 2 ? 13.3 : 13.9}
        textAnchor="middle"
        fontSize={center.length > 2 ? 3.8 : 5.2}
        fontWeight={800}
        className={earned ? style.text : 'fill-muted'}
      >
        {center}
      </text>
    </svg>
  );
}
