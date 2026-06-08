import React from 'react';
import type { FutureScenario } from '@/types';

interface Props {
  scenarios: FutureScenario[];
}

export default function ScenarioMap({ scenarios }: Props) {
  const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        {scenarios.map((s, i) => (
          <div key={s.title} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0"
              style={{ backgroundColor: colors[i % colors.length] }}
            >
              {s.probability}%
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{s.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.description}</p>
            </div>
            <div className="hidden sm:block w-1/3">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${s.probability}%`, backgroundColor: colors[i % colors.length] }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
