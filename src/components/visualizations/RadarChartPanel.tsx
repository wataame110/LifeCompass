import React from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer
} from 'recharts';

interface Props {
  data: Record<string, number>;
}

export default function RadarChartPanel({ data }: Props) {
  // 能力と価値観の組み合わせで12軸に絞る
  const keys = [
    { key: '論理思考力', label: '論理' },
    { key: '問題解決能力', label: '解決' },
    { key: '創造性', label: '創造' },
    { key: '実行力', label: '実行' },
    { key: '継続力', label: '継続' },
    { key: 'リーダーシップ', label: '統率' },
    { key: '協調性', label: '協調' },
    { key: '学習能力', label: '学習' },
    { key: 'マネジメント能力', label: '管理' },
    { key: 'コミュニケーション能力', label: '対話' },
  ];

  const chartData = keys.map(k => ({
    subject: k.label,
    A: data[k.key] ?? 50,
    fullMark: 100,
  }));

  return (
    <div className="w-full aspect-[4/3] max-w-lg mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
          <Radar name="あなた" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
