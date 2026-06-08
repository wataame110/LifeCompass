import React from 'react';
import type { AnalysisResult } from '@/types';

interface Props {
  timeline: AnalysisResult['timeline'];
}

export default function TimelinePanel({ timeline }: Props) {
  const events = timeline.length > 0 ? timeline : [
    { age: 3, label: '幼少期', event: 'データなし', emotion: 'neutral' as const },
  ];

  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-lc-primary-200 dark:bg-lc-primary-800" />
      <div className="space-y-4">
        {events.map((e, i) => (
          <div key={i} className="relative">
            <div className={`absolute -left-4 top-1 w-3 h-3 rounded-full border-2 ${
              e.emotion === 'positive' ? 'bg-green-400 border-green-500' :
              e.emotion === 'negative' ? 'bg-red-400 border-red-500' :
              'bg-gray-300 border-gray-400'
            }`} />
            <div className="bg-white dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-lc-primary-600 dark:text-lc-primary-400">{e.label}</span>
                <span className="text-xs text-gray-400">（{e.age}歳頃）</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{e.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
