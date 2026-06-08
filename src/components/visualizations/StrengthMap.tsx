import React from 'react';
import type { PersonalityTrait } from '@/types';

interface Props {
  traits: PersonalityTrait[];
}

export default function StrengthMap({ traits }: Props) {
  const items = traits.slice(0, 8);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(t => (
        <div
          key={t.name}
          className="p-4 rounded-xl border border-lc-primary-100 dark:border-lc-primary-900/20 bg-lc-primary-50/30 dark:bg-lc-primary-900/5 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-lc-primary-100 dark:bg-lc-primary-900/20 flex items-center justify-center mx-auto mb-2">
            <span className="text-lg font-bold text-lc-primary-700 dark:text-lc-primary-300">{t.score}</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t.description.slice(0, 30)}{t.description.length > 30 ? '…' : ''}</p>
          <div className="mt-2 text-[10px] text-gray-400">
            {t.score > 60 ? '活かせる環境: 裁量が大きい場所' :
             t.score > 40 ? '活かせる環境: バランス型' : '改善優先'}
          </div>
        </div>
      ))}
    </div>
  );
}
