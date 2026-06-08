import React from 'react';
import { Compass } from 'lucide-react';
import type { AnalysisResult } from '@/types';

interface Props {
  result: AnalysisResult;
}

export default function LifeCompassPanel({ result }: Props) {
  // 簡易コンパス：北=成長、南=安定、東=社会貢献、西=独立
  const directions: Record<string, number> = {
    N: result.scores['成長'] ?? 50,
    S: result.scores['安定'] ?? 50,
    E: result.scores['社会貢献'] ?? 50,
    W: result.scores['独立志向'] ?? 50,
    NE: result.scores['挑戦'] ?? 50,
    NW: result.scores['自由'] ?? 50,
    SE: result.scores['家族'] ?? 50,
    SW: result.scores['お金'] ?? 50,
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      {/* Compass background */}
      <div className="absolute inset-0 rounded-full border-4 border-lc-primary-200 dark:border-lc-primary-800 bg-white dark:bg-gray-900" />
      {/* Cross lines */}
      <div className="absolute top-0 left-1/2 w-px h-full bg-lc-primary-100 dark:bg-lc-primary-900" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-lc-primary-100 dark:bg-lc-primary-900" />

      {/* Dots */}
      {Object.entries(directions).map(([dir, score]) => {
        const pos = dirPosition(dir);
        return (
          <div
            key={dir}
            className="absolute"
            style={{
              left: `calc(${pos.x}% + ((${score} - 50) / 100) * ${pos.dx}%)`,
              top: `calc(${pos.y}% + ((${score} - 50) / 100) * ${pos.dy}%)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-3 h-3 rounded-full bg-lc-primary-500" />
          </div>
        );
      })}

      {/* Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-lc-primary-600 text-white flex items-center justify-center shadow-lg">
        <Compass className="w-6 h-6" />
      </div>

      {/* Labels */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-lc-primary-600 dark:text-lc-primary-400">成長</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-lc-primary-600 dark:text-lc-primary-400">安定</div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-lc-primary-600 dark:text-lc-primary-400">独立</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-lc-primary-600 dark:text-lc-primary-400">社会</div>
    </div>
  );
}

function dirPosition(dir: string): { x: number; y: number; dx: number; dy: number } {
  switch (dir) {
    case 'N': return { x: 50, y: 10, dx: 0, dy: -15 };
    case 'S': return { x: 50, y: 90, dx: 0, dy: 15 };
    case 'E': return { x: 90, y: 50, dx: 15, dy: 0 };
    case 'W': return { x: 10, y: 50, dx: -15, dy: 0 };
    case 'NE': return { x: 85, y: 15, dx: 10, dy: -10 };
    case 'NW': return { x: 15, y: 15, dx: -10, dy: -10 };
    case 'SE': return { x: 85, y: 85, dx: 10, dy: 10 };
    case 'SW': return { x: 15, y: 85, dx: -10, dy: 10 };
    default: return { x: 50, y: 50, dx: 0, dy: 0 };
  }
}
