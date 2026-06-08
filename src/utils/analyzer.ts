import type { Answer, UserProfile, AnalysisResult, PersonalityTrait, CareerFit, FutureScenario, OrganizationFit } from '@/types';

// ===== スコアマッピング =====
const SCORE_KEYS = [
  // Big Five
  'openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism',
  // DISC
  'dominance', 'influence', 'steadiness', 'compliance',
  // Cognitive
  'logic', 'intuition', 'sensation', 'feeling',
  // Abilities
  'thinking', 'problem_solving', 'creativity', 'execution', 'perseverance',
  'leadership', 'teamwork', 'learning', 'management', 'communication',
  // Values
  'money', 'stability', 'freedom', 'challenge', 'family',
  'honor', 'social_contribution', 'growth', 'approval', 'independence',
  // Others
  'empathy', 'resilience', 'sociability', 'flexibility', 'adaptability',
  'entrepreneurship', 'responsibility', 'idealism', 'anxiety', 'pressure',
  'curiosity', 'discipline', 'passion', 'practicality', 'ambition',
  'focus', 'loyalty', 'sensitivity', 'introspection', 'conformity',
  'competitiveness', 'expression', 'versatility', 'relationship',
  'planning', 'risk', 'action', 'initiative', 'expertise',
];

// ===== 分析エンジン =====
export function analyzeAnswers(answers: Answer[], profile: UserProfile): AnalysisResult {
  const scores: Record<string, number> = {};
  SCORE_KEYS.forEach(k => scores[k] = 50);

  // 回答をスコアに変換
  answers.forEach(ans => processAnswer(ans, scores));

  // 補正・正規化
  const clamped: Record<string, number> = {};
  Object.entries(scores).forEach(([k, v]) => {
    clamped[k] = Math.max(0, Math.min(100, Math.round(v)));
  });

  // Big Five
  const bigFive = {
    openness: clamped.openness,
    conscientiousness: clamped.conscientiousness,
    extraversion: clamped.extraversion,
    agreeableness: clamped.agreeableness,
    neuroticism: clamped.neuroticism,
  };

  // DISC
  const disc = {
    dominance: clamped.dominance,
    influence: clamped.influence,
    steadiness: clamped.steadiness,
    compliance: clamped.compliance,
  };

  // Cognitive
  const cognitive = {
    logic: clamped.logic,
    intuition: clamped.intuition,
    sensation: clamped.sensation,
    feeling: clamped.feeling,
  };

  // MBTI 推測
  const mbti = inferMBTI(clamped);

  // 能力スコア
  const abilities = {
    '論理思考力': clamped.logic + clamped.thinking,
    '問題解決能力': clamped.problem_solving + clamped.thinking,
    '創造性': clamped.creativity + clamped.openness,
    '実行力': clamped.execution + clamped.action,
    '継続力': clamped.perseverance + clamped.discipline,
    'リーダーシップ': clamped.leadership + clamped.dominance,
    '協調性': clamped.teamwork + clamped.agreeableness,
    '学習能力': clamped.learning + clamped.curiosity,
    'マネジメント能力': clamped.management + clamped.planning,
    'コミュニケーション能力': clamped.communication + clamped.empathy,
  };

  const abilityScores = Object.entries(abilities)
    .map(([name, s]) => ({ name, score: Math.min(100, Math.round(s / 2)), description: abilityDesc(name) }));

  // 価値観
  const values = {
    'お金': clamped.money,
    '安定': clamped.stability,
    '自由': clamped.freedom,
    '挑戦': clamped.challenge,
    '家族': clamped.family,
    '名誉': clamped.honor,
    '社会貢献': clamped.social_contribution,
    '成長': clamped.growth,
    '承認欲求': clamped.approval,
    '独立志向': clamped.independence,
  };

  const valueScores = Object.entries(values)
    .map(([name, score]) => ({ name, score: Math.round(score), importance: Math.round(score) }));

  // 性格特徴トップ10（強み/弱みに分けるための素）
  const allTraits: PersonalityTrait[] = [
    ...abilityScores.map(a => ({ ...a, name: a.name })),
    { name: '共感力', score: clamped.empathy, description: '他人の感情を理解し寄り添う力' },
    { name: '回復力', score: clamped.resilience, description: '困難から立ち直る力' },
    { name: '社交性', score: clamped.sociability, description: '人と仲良くなる力' },
    { name: '柔軟性', score: clamped.flexibility, description: '変化に適応する力' },
    { name: '適応力', score: clamped.adaptability, description: '環境に応じて変化する力' },
    { name: '起業家精神', score: clamped.entrepreneurship, description: '新しいことを生み出す力' },
    { name: '責任感', score: clamped.responsibility, description: '責任を果たそうとする力' },
    { name: '計画力', score: clamped.planning, description: '未来を見据えて計画する力' },
  ];

  // 強みTOP10
  const strengths = [...allTraits].sort((a, b) => b.score - a.score).slice(0, 10);
  // 弱みTOP10
  const weaknesses = [...allTraits].sort((a, b) => a.score - b.score).slice(0, 10);

  // 環境
  const suitableEnv = inferSuitableEnv(clamped);
  const unsuitableEnv = inferUnsuitableEnv(clamped);
  const stress = inferStress(clamped);

  // 適職
  const career = inferCareer(clamped, values);

  // 不向き職種
  const unfitCareer = inferUnfitCareer(clamped, values);

  // 組織適性
  const orgFit = inferOrganizationFit(clamped, values);

  // 将来シナリオ
  const scenarios = generateScenarios(clamped, values, profile);

  // 就活支援
  const jh = generateJobHuntingSupport(clamped, strengths, weaknesses, profile, values);

  // 可視化データ
  const timeline = buildTimeline(answers);
  const visScores: Record<string, number> = {};
  [...abilityScores, ...valueScores].forEach(s => { visScores[s.name] = s.score; });
  Object.entries(bigFive).forEach(([k, v]) => { visScores[`BigFive_${k}`] = v; });
  Object.entries(disc).forEach(([k, v]) => { visScores[`DISC_${k}`] = v; });

  // 人生サマリー
  const summary = generateLifeSummary(clamped, strengths, weaknesses, profile, mbti);

  return {
    lifeSummary: summary,
    personalityReport: {
      mbti,
      bigFive,
      disc,
      cognitive,
      traits: allTraits,
      thinkingTendency: inferThinking(clamped),
      behaviorTendency: inferBehavior(clamped),
      decisionTendency: inferDecision(clamped),
    },
    strengthsTop10: strengths,
    weaknessesTop10: weaknesses,
    suitableEnvironments: suitableEnv,
    unsuitableEnvironments: unsuitableEnv,
    stressFactors: stress,
    suitableCareers: career,
    unsuitableCareers: unfitCareer,
    organizationFit: orgFit,
    futureScenarios: scenarios,
    jobHuntingSupport: jh,
    timeline,
    scores: visScores,
  };
}

function processAnswer(ans: Answer, scores: Record<string, number>) {
  const val = ans.value;
  const qId = ans.questionId;

  // Scale type (+10 for each level)
  if (typeof val === 'number') {
    if (qId.includes('money')) { scores.money = 35 + val * 6.5; }
    else if (qId.includes('stability')) { scores.stability = 35 + val * 6.5; }
    else if (qId.includes('freedom')) { scores.freedom = 35 + val * 6.5; }
    else if (qId.includes('challenge')) { scores.challenge = 35 + val * 6.5; }
    else if (qId.includes('family')) { scores.family = 35 + val * 6.5; }
    else if (qId.includes('honor')) { scores.honor = 35 + val * 6.5; }
    else if (qId.includes('social')) { scores.social_contribution = 35 + val * 6.5; }
    else if (qId.includes('independence')) { scores.independence = 35 + val * 6.5; }
    else if (qId.includes('approval')) { scores.approval = 35 + val * 6.5; }
    else if (qId.includes('satisfaction')) { scores.growth = Math.min(100, scores.growth + val * 3); }
    return;
  }

  // Single / multiple with embedded scores (from question options)
  // Since we don't pass options here, use keyword heuristic fallback for text
  if (typeof val === 'string') {
    applyKeywordScores(val, scores);
    return;
  }
  if (Array.isArray(val)) {
    val.forEach(v => {
      if (typeof v === 'string') applyKeywordScores(v, scores);
    });
  }
}

function applyKeywordScores(text: string, scores: Record<string, number>) {
  const t = text.toLowerCase();
  const map: Record<string, string[]> = {
    extraversion: ['友達', '人', '話す', '楽しい', '多く', '広がっ'],
    introversion: ['一人', '静か', '内', '自分', '深く', '創る'],
    openness: ['新しい', '挑戦', '変化', '自由', '興味', '多様'],
    conscientiousness: ['計画', '締切', '責任', '完璧', '努力', '達成'],
    neuroticism: ['不安', '心配', '怖', '緊張', 'ストレス', '落ち込'],
    agreeableness: ['協力', '仲間', '助け', '優し', '思いやり', '調和'],
    creativity: ['作る', '創造', 'アイデア', 'デザイン', '想像', '表現'],
    leadership: ['リーダ', 'まとめ', '指導', '決断', '率い', 'キャプテン'],
    teamwork: ['チーム', '協力', 'サポート', '一緒', '連携', '信頼'],
    thinking: ['思考', '分析', '論理', '考察', '研究', '知る'],
    communication: ['伝える', '説明', '話す', '発表', '文章', '説得'],
    resilience: ['立ち直', '諦め', '克服', '乗り越え', '粘り', '強い'],
    perseverance: ['続け', '努力', '根性', '勉強', '練習', '毎日'],
    entrepreneurship: ['起業', 'ビジネス', 'サービス', '企画', '売る', '収益'],
    flexibility: ['柔軟', '変化', '適応', '転換', '断捨離'],
    empathy: ['共感', '相手', '気遣い', '寄り添い', '人の気持ち'],
    discipline: ['規律', 'ルール', '習慣', '決まり', '規律'],
    conformity: ['みんな', '周り', '合わせ', 'ノリ', '流れ'],
    independence: ['独立', '一人', '独自', '自分で', '自ら'],
    planning: ['計画', '未来', '目標', 'スケジュール', '戦略'],
    action: ['動く', '体', '実行', '実践', '行動'],
    logic: ['論理', '数学', '理系', '証明', '構造'],
    curiosity: ['知り', '興味', '探求', '発見', '謎'],
    practicality: ['実務', '現場', '具体的', '役に立つ', 'スキル'],
    sociability: ['社交', '飲み会', '交流', '仲良く', '人脈'],
    achievement: ['成果', '目標', '合格', '受賞', '成績'],
    dominance: ['主導', '勝つ', '主張', '押す', 'トップ'],
    influence: ['影響', '人気', '発信', '明るい', '元気'],
    steadiness: ['安定', '落ち着き', '忍耐', ' supporter', '支え'],
    compliance: ['正確', '規定', '守る', '枠内', '確認'],
  };

  Object.entries(map).forEach(([key, keywords]) => {
    const found = keywords.some(k => t.includes(k));
    if (found) scores[key] = Math.min(100, scores[key] + 4);
  });

  // Negative emotions
  if (t.includes('不安') || t.includes('悩') || t.includes('苦') || t.includes('辛')) {
    scores.neuroticism = Math.min(100, scores.neuroticism + 5);
  }
  if (t.includes('嬉し') || t.includes('達成') || t.includes('成功') || t.includes('自信')) {
    scores.extraversion = Math.min(100, scores.extraversion + 3);
    scores.resilience = Math.min(100, scores.resilience + 4);
  }
}

function inferMBTI(s: Record<string, number>): string {
  let type = '';
  type += s.introversion > s.extraversion ? 'I' : 'E';
  type += s.intuition > s.sensation ? 'N' : 'S';
  type += s.feeling > s.logic ? 'F' : 'T';
  type += s.perseverance > s.flexibility ? 'J' : 'P';
  return type;
}

function abilityDesc(name: string): string {
  const map: Record<string, string> = {
    '論理思考力': '物事を冷静に分析し筋道を立てて考える力',
    '問題解決能力': '課題を特定し、最適な解を導き出す力',
    '創造性': '既存の枠にとらわれず新しい価値を生み出す力',
    '実行力': '考えたことをすぐに行動に移す力',
    '継続力': '目標に向かって諦めず続ける力',
    'リーダーシップ': '人をまとめ目標に導く力',
    '協調性': 'チームの目標に向かって協力する力',
    '学習能力': '新しい知識やスキルを吸収する力',
    'マネジメント能力': 'プロジェクトや人を円滑に管理する力',
    'コミュニケーション能力': '自分の考えを適切に伝え相手を理解する力',
  };
  return map[name] || '';
}

function inferThinking(s: Record<string, number>): string {
  if (s.logic > 60 && s.openness > 60) return '論理的かつ独創的に物事を考える傾向です。新しいアイデアを論理的に検証するのが得意です。';
  if (s.logic > 60) return '論理的に物事を整理し、客観的な視点で判断する傾向です。';
  if (s.intuition > 60) return '直感や全体像を重視し、ひらめきを頼りに考える傾向です。';
  if (s.feeling > 60) return '人の感情や状況の雰囲気を重視して考える傾向です。';
  return 'バランスの取れた思考傾向です。状況に応じて考え方を切り替えられます。';
}

function inferBehavior(s: Record<string, number>): string {
  if (s.extraversion > 60 && s.action > 60) return '外向的で行動的。人と接する中でエネルギーを得るタイプです。';
  if (s.introversion > 60) return '内向的で静かな環境を好む。一人の時間でエネルギーを回復するタイプです。';
  if (s.perseverance > 60) return '計画的で継続的に物事を進める。努力を重視するタイプです。';
  if (s.flexibility > 60) return '柔軟に対応し、変化を恐れず適応するタイプです。';
  return '状況に応じて行動パターンを変えられるバランス型です。';
}

function inferDecision(s: Record<string, number>): string {
  if (s.logic > 60 && s.planning > 55) return 'データと計画を重視し、慎重に決定する傾向です。';
  if (s.intuition > 60) return '直感と経験を頼りに、スピーディーに決断する傾向です。';
  if (s.feeling > 60) return '人の気持ちや関係性を優先した判断をする傾向です。';
  if (s.risk > 55) return 'リスクを恐れず、チャンスを伸ばす決断をする傾向です。';
  return '情報を集めた上で、バランスを取って決定する傾向です。';
}

function inferSuitableEnv(s: Record<string, number>): string[] {
  const env: string[] = [];
  if (s.introversion > 55) env.push('静かで集中できる職場');
  if (s.extraversion > 55) env.push('活発なコミュニケーションが飛び交う職場');
  if (s.openness > 60) env.push('新しい試みや挑戦が歓迎される環境');
  if (s.stability > 60) env.push('明確な評価基準と安定した業務プロセスがある環境');
  if (s.freedom > 60) env.push('裁量権が大きく柔軟な働き方が認められる環境');
  if (s.leadership > 60) env.push('リーダーシップを発揮できる環境');
  if (s.teamwork > 60) env.push('チームで協働する文化のある組織');
  if (s.creativity > 60) env.push('アイデアが尊重され自由な発想が評価される環境');
  if (env.length === 0) env.push('バランスの取れた環境');
  return env.slice(0, 6);
}

function inferUnsuitableEnv(s: Record<string, number>): string[] {
  const env: string[] = [];
  if (s.introversion > 60) env.push('絶えず人と話さなければならない営業偏重の環境');
  if (s.extraversion > 60) env.push('完全な一人作業が求められる環境');
  if (s.neuroticism > 60) env.push('急な変更や不明確な指示が多い環境');
  if (s.openness < 40) env.push('頻繁な改革・変化が求められる環境');
  if (s.stability > 70) env.push('将来の保証がなく不安定な環境');
  if (s.freedom < 40) env.push('細かい指示や監視が厳しい環境');
  if (env.length === 0) env.push('極端な長時間労働やパワハラのある環境');
  return env.slice(0, 5);
}

function inferStress(s: Record<string, number>): string[] {
  const st: string[] = [];
  if (s.neuroticism > 60) st.push('人間関係のトラブルや対人ストレス');
  if (s.conscientiousness > 70) st.push('締切や完璧主義からのプレッシャー');
  if (s.approval > 65) st.push('評価や他人からの判断を気にしすぎること');
  if (s.stability > 70) st.push('将来の不確実性や変化');
  if (s.independence > 70) st.push('自由度が低く裁量がない状況');
  if (s.flexibility > 70) st.push('同じことの繰り返しやルーチン作業');
  if (st.length === 0) st.push('過度な負荷が続く状況');
  return st.slice(0, 5);
}

function inferCareer(s: Record<string, number>, values: Record<string, number>): CareerFit[] {
  const careers: { c: string; score: number; reason: string }[] = [
    { c: 'コンサルタント・戦略プランナー', score: s.thinking + s.logic + s.planning, reason: '論理的思考と戦略立案力が活かせる職種です。' },
    { c: 'エンジニア・プログラマー', score: s.logic + s.creativity + s.independence, reason: '論理的かつ創造的に問題解決できる環境です。' },
    { c: 'デザイナー・アートディレクター', score: s.creativity + s.openness + s.expression, reason: '独創的な感性と表現力が求められます。' },
    { c: '営業・マーケター', score: s.extraversion + s.communication + s.influence, reason: '人との関わりと説得力を活かせます。' },
    { c: '人材開発・組織コンサルタント', score: s.empathy + s.leadership + s.communication, reason: '人を成長させることに喜びを感じるタイプに適しています。' },
    { c: '起業家・事業開発', score: s.entrepreneurship + s.risk + s.initiative, reason: '新しい価値を創造しリスクを取る力が求められます。' },
    { c: '研究者・大学教員', score: s.curiosity + s.thinking + s.perseverance, reason: '深く探求し知識を追求する姿勢が活かせます。' },
    { c: '医療・福祉・カウンセラー', score: s.empathy + s.empathy + s.responsibility, reason: '人を支え気遣う力が最も求められる分野です。' },
    { c: '公務員・行政職', score: s.stability + s.responsibility + s.discipline, reason: '安定と規律を大切にする性格に合致します。' },
    { c: '投資家・ファイナンシャルアドバイザー', score: s.logic + s.risk + s.money, reason: 'リスク判断と論理的な数字感覚が活かせます。' },
    { c: '作家・編集者・ライター', score: s.creativity + s.introspection + s.introversion, reason: '一人で深く考え表現する力が活かせます。' },
    { c: '法律家・弁護士・公認会計士', score: s.logic + s.discipline + s.responsibility, reason: '論理的で綿密な作業が求められます。' },
    { c: '教師・トレーナー', score: s.empathy + s.leadership + s.communication, reason: '人に教え導く喜びが強い人に適しています。' },
    { c: 'プロジェクトマネージャー', score: s.management + s.planning + s.teamwork, reason: '複数の要素を整理しプロジェクトを推進する力が必要です。' },
    { c: 'クリエイター・YouTuber・インフルエンサー', score: s.creativity + s.sociability + s.entrepreneurship, reason: '自己表現と発信力を組み合わせた新しい働き方です。' },
  ];

  return careers
    .map(c => ({ career: c.c, fit: Math.min(100, Math.round(c.score / 3)), reason: c.reason }))
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 10);
}

function inferUnfitCareer(s: Record<string, number>, values: Record<string, number>): CareerFit[] {
  const careers: { c: string; score: number; reason: string }[] = [
    { c: 'セールス・テレアポ', score: s.introversion + s.resilience, reason: '外向性と断られても続ける回復力が求められますが、オススメできません。' },
    { c: '完全リモート・フリーランス', score: s.stability + s.conformity, reason: '自律性と自己管理が重要ですが、不安定さを嫌う傾向が強いため不向きです。' },
    { c: 'スタートアップ初期メンバー', score: s.stability + s.planning, reason: '極度の不安定さと多様な役割が求められます。' },
    { c: '看護師・介護職（夜勤必須）', score: s.neuroticism, reason: '疲労とストレスが大きく、回復力が試されます。' },
    { c: '軍人・警察官', score: s.independence + s.flexibility, reason: '厳格な上下関係と命令服従が求められます。' },
    { c: '監査役・内部統制専門', score: s.openness + s.creativity, reason: '創造性より規律と網羅性が求められます。' },
    { c: '芸能・タレント', score: s.introversion + s.stability, reason: '承認欲求を燃料にし、不安定な環境下で活躍する必要があります。' },
    { c: '工場ライン作業員', score: s.creativity + s.entrepreneurship, reason: '創造力や裁量が及ぼす影響がほぼない環境です。' },
  ];
  // Using a simpler scoring since self_care doesn't exist; use baseline logic
  const mapped = careers.map(c => {
    let score = c.score;
    if (c.c.includes('セールス')) score = 100 - (s.introversion > 60 ? 20 : 0) - (s.resilience < 40 ? 20 : 0);
    else if (c.c.includes('フリーランス')) score = 100 - (s.stability > 70 ? 30 : 0);
    else if (c.c.includes('スタートアップ')) score = 100 - (s.stability > 70 ? 35 : 0);
    else if (c.c.includes('看護')) score = 100 - (s.empathy > 60 ? 0 : 20);
    else if (c.c.includes('軍人')) score = 100 - (s.conformity < 40 ? 30 : 0);
    else if (c.c.includes('監査')) score = 100 - (s.creativity > 70 ? 30 : 0);
    else if (c.c.includes('芸能')) score = 100 - (s.extraversion < 50 ? 20 : 0);
    else if (c.c.includes('工場')) score = 100 - (s.creativity > 60 ? 25 : 0);
    return { career: c.c, fit: Math.max(0, Math.min(100, Math.round(score))), reason: c.reason };
  });
  return mapped.sort((a, b) => a.fit - b.fit).slice(0, 8);
}

function inferOrganizationFit(s: Record<string, number>, values: Record<string, number>): OrganizationFit[] {
  const orgs = [
    { type: 'スタートアップ・ベンチャー', fit: s.entrepreneurship + s.challenge + s.risk, reason: '変化とスピード、成長機会を重視する人に向いています。' },
    { type: '中小企業・個人事業主', fit: s.independence + s.freedom + s.practicality, reason: '裁量権が大きく柔軟な働き方が求められます。' },
    { type: '大企業・上場企業', fit: s.stability + s.discipline + s.conformity, reason: 'システムや評価基準が整い、安定を得られます。' },
    { type: '公務員・自治体', fit: s.responsibility + s.stability + s.social_contribution, reason: '社会貢献と安定を優先する人に適しています。' },
    { type: 'フリーランス', fit: s.independence + s.freedom + s.flexibility, reason: '自律性とスキルが求められますが自由度は最高です。' },
    { type: '起業・独立', fit: s.entrepreneurship + s.risk + s.initiative, reason: 'リスクと責任を背負いながら自ら道を切り開く力が必要です。' },
  ];
  return orgs.map(o => ({ type: o.type, fit: Math.min(100, Math.round(o.fit / 3)), reason: o.reason })).sort((a, b) => b.fit - a.fit);
}

function generateScenarios(s: Record<string, number>, values: Record<string, number>, profile: UserProfile): FutureScenario[] {
  const scenarios: FutureScenario[] = [];

  // 現状維持
  scenarios.push({
    title: '現状維持ルート',
    probability: s.stability > 60 ? 55 : 25,
    description: '今の環境・仕事を継続しながら、着実にスキルを磨いていく未来です。',
    steps: [
      '現在の職場で実績を積み重ねる',
      '専門性を高めながら信頼を構築する',
      '中期的な昇進・昇格を目指す',
      'ワークライフバランスを保ちながら生活基盤を固める',
    ],
  });

  // 成長
  scenarios.push({
    title: '成長ルート',
    probability: s.challenge > 60 ? 45 : 30,
    description: '新しいスキルや環境に積極的に飛び込み、キャリアアップを目指す未来です。',
    steps: [
      '新しい分野や資格の習得に取り組む',
      '異動・転職や業務拡張で視野を広げる',
      '専門家としてのポジションを確立する',
      'リーダーシップの場を増やしていく',
    ],
  });

  // リスク
  scenarios.push({
    title: 'リスクルート',
    probability: Math.max(10, Math.round((s.neuroticism + (100 - s.stability)) / 4)),
    description: '予期せぬ変化やストレスにより、現状とは異なる流れになる可能性があります。',
    steps: [
      '過度なストレスが蓄積しないよう健康管理を優先する',
      'メンタルサポート体制や人間関係の潤滑油を意識する',
      '計画Bを常に持ち、柔軟に対応する',
      '小さなリスクから段階的に対応力を磨く',
    ],
  });

  // 独立
  scenarios.push({
    title: '独立・副業ルート',
    probability: Math.min(40, Math.round((s.entrepreneurship + s.independence + s.freedom) / 3)),
    description: '本業と並行して自分の事業やスキルを磨き、独立への橋渡しをする未来です。',
    steps: [
      '副業・個人プロジェクトで実績を積む',
      '収益基盤を少しずつ作る',
      '専門性を確立し顧客や評価を得る',
      '環境が整った段階で独立を選択する',
    ],
  });

  // 確率の正規化（合計100%に近づけるが、個別の肯定確率として表示）
  const total = scenarios.reduce((sum, sc) => sum + sc.probability, 0);
  scenarios.forEach(sc => { sc.probability = Math.round((sc.probability / total) * 100); });

  return scenarios;
}

function generateJobHuntingSupport(
  s: Record<string, number>,
  strengths: PersonalityTrait[],
  weaknesses: PersonalityTrait[],
  profile: UserProfile,
  values: Record<string, number>
) {
  const topStrength = strengths[0]?.name ?? '強み';
  const topWeak = weaknesses[0]?.name ?? '改善点';

  const selfPR = [
    {
      title: '長所重視型',
      text: `私の${topStrength}を活かし、チームや組織に即戦力として貢献したいと考えています。過去の経験から、この強みを活かして目標を達成してきました。`,
    },
    {
      title: '成長志向型',
      text: `私は${topWeak}を認識しつつも、この点を補うための意識と行動を続けています。課題を素直に受け止め、成長し続ける姿勢が私の強みです。`,
    },
    {
      title: '価値観重視型',
      text: `${values.stability > 50 ? '誠実さと責任感' : '柔軟性と挑戦心'}を大切にしながら、組織のミッションに共感し長期的に貢献したいと考えています。`,
    },
  ];

  const strengthAnswer = `私が最も強みだと感じているのは「${topStrength}」です。これまでの経験で、この強みがあったからこそ困難を乗り越えられた場面が多くあります。将来もこの強みを活かし続けたいと考えています。`;
  const weaknessAnswer = `私の課題は「${topWeak}」だと考えています。ただ、これを認識した上で、過去には${topWeak}を補うために〇〇の工夫をしてきました。今後も継続して意識していきます。`;
  const gakuchika = `大学時代（学生時代）に最も力を入れたことは、${s.entrepreneurship > 55 ? '個人プロジェクトや企画の実施' : s.study_focus ? '学業や資格取得' : '部活動やサークルでの活動'}です。この中で${topStrength}を存分に活かし、チームや自分自身の成長に繋げることができました。`;
  const motivation = `貴社の〇〇という点に強く共感し、私の${topStrength}を発揮しながら社会貢献をしたいと考えています。${values.stability > 60 ? '長期的に責任を持って働ける環境' : '成長できる環境'}を求めており、御社が最適だと確信しています。`;
  const careerVision = `5年後には、${s.leadership > 60 ? 'チームを率いるリーダー' : '専門家として確固たる地位'}を築き、10年後には${s.entrepreneurship > 60 ? '新しい事業やプロダクトの立ち上げ' : '組織の中核を担い社会に価値を届ける'}存在になりたいと考えています。`;

  const interviewQ: { question: string; answer: string }[] = [
    { question: '自己紹介をお願いします', answer: `私は${profile.currentAge}歳で、${topStrength}を強みとしてきました。学生時代から社会人まで、一貫してこの強みを活かしてきました。` },
    { question: '学生時代に力を入れたこと（ガクチカ）は？', answer: gakuchika },
    { question: 'あなたの強みは？', answer: strengthAnswer },
    { question: 'あなたの弱みは？', answer: weaknessAnswer },
    { question: '志望動機は？', answer: motivation },
    { question: 'キャリアビジョンは？', answer: careerVision },
    { question: 'ストレスの発散方法は？', answer: '趣味や運動、友人との時間を大切にし、客観的に状況を整理することでリセットしています。' },
    { question: 'チームワークとリーダーシップどちらが得意？', answer: s.leadership > 60 ? 'リーダーシップを発揮しつつ、メンバーの意見を活かす型が得意です。' : 'サポート役としてチームを支える協調型ですが、必要な時は前に出ることもできます。' },
    { question: '失敗談を教えてください', answer: '過去に納期に間に合わないミスがありました。二度と繰り返さないため、計画を細分化し進捗管理を徹底するようになりました。' },
    { question: '他社受験状況は？', answer: '貴社を第一志望としており、他社と比較しても御社の〇〇に一番共感しています。' },
    { question: '入社後にしたいことは？', answer: 'まずは現場の声を聞き、貢献できるところから始めたいと考えています。' },
    { question: 'どんな仕事がしたい？', answer: '自分の強みを活かしながら、成果が目に見えて実感できる仕事がしたいです。' },
    { question: '効率重視か品質重視か？', answer: s.conscientiousness > 60 ? '品質重視ですが、適切な段階で効率も考えます。' : '効率重視ですが、品質の最低ラインは必ず守ります。' },
    { question: 'トラブル対応の経験は？', answer: '予期せぬ問題が起きた際、まず影響を整理し、関係者に適切に共有した上で解決策を探しました。' },
    { question: '誰かと対立した経験は？', answer: '意見の相違があった際、相手の意見をきちんと聞いた上で、共通の目的を再確認し解決しました。' },
    { question: 'あなたを一言で表すと？', answer: `${s.extraversion > 55 ? '能動的で人を巻き込む' : '冷静で観察力がある'}タイプです。` },
    { question: '入社して配属されたら何から始めますか？', answer: 'まず先輩や周囲に学び、業務の流れと組織文化を理解することから始めます。' },
    { question: '帰属意識の高め方は？', answer: '小さな成功を重ね、チーム内で信頼関係を構築することで自然と帰属意識が高まると考えています。' },
    { question: '転職理由は？', answer: '現状の成長よりも、御社で新しい挑戦と大きな成果を出したいと考えたためです。' },
    { question: '自分を動物に例えると？', answer: s.leadership > 60 ? 'ライオン型（先頭に立って仲間を導く）' : s.teamwork > 60 ? 'アリ型（地道に協力して成果を積み上げる）' : '猫型（独自のペースで高い集中力を発揮する）' },
  ];

  const concerns: string[] = [];
  if (s.neuroticism > 60) concerns.push('ストレス耐性や精神安定性についての確認があるかもしれません');
  if (s.introversion > 70) concerns.push('コミュニケーション能力やチームワークへの不安を持たれる可能性があります');
  if (s.job_hopping) concerns.push('早期離職のリスクについて懸念されるかもしれません');
  if (s.entrepreneurship > 70) concerns.push('独立志向が読まれ、長期的な定着度に懸念が出る可能性があります');
  if (concerns.length === 0) concerns.push('特に大きな懸念ポイントは見当たりませんが、面接で堂々と話せる準備をしましょう');

  const esSupport = `ES記入のポイント：${topStrength}を強みとして明確に伝え、具体的なエピソード（数字や状況・行動・結果）で補強してください。${topWeak}については「認識している＋改善している」という流れにすると好印象です。`;

  return {
    selfPR,
    strengthAnswer,
    weaknessAnswer,
    gakuchika,
    motivationTemplate: motivation,
    careerVision,
    interviewQuestions: interviewQ,
    concerns,
    esSupport,
  };
}

function buildTimeline(answers: Answer[]): AnalysisResult['timeline'] {
  const stageLabels: Record<string, string> = {
    childhood: '幼少期', elementary: '小学生', junior_high: '中学生', high_school: '高校生', university: '大学生', current: '現在',
  };
  const timeline: AnalysisResult['timeline'] = [];
  answers.forEach(a => {
    if (a.stage) {
      const ageMap: Record<string, number> = { childhood: 3, elementary: 10, junior_high: 14, high_school: 17, university: 20, current: 25 };
      const emotion: 'positive' | 'neutral' | 'negative' = a.category === 'success' ? 'positive' : a.category === 'failure' ? 'negative' : 'neutral';
      const val = typeof a.value === 'string' ? a.value.slice(0, 20) + (a.value.length > 20 ? '…' : '') : '回答あり';
      timeline.push({
        age: ageMap[a.stage] ?? 20,
        label: stageLabels[a.stage] ?? a.stage,
        event: val,
        emotion,
      });
    }
  });
  return timeline.sort((a, b) => a.age - b.age);
}

function generateLifeSummary(s: Record<string, number>, strengths: PersonalityTrait[], weaknesses: PersonalityTrait[], profile: UserProfile, mbti: string): string {
  const top = strengths[0]?.name ?? '強み';
  const bottom = weaknesses[0]?.name ?? '課題';
  const intro = `${profile.currentAge}歳のあなたは、全体的に${s.extraversion > 55 ? '外向的で人との関わりを大切にする' : s.introversion > 55 ? '内省的で一人の時間を大切にする' : 'バランスの取れた'}性格傾向を持っています。`;
  const analysis = `MBTIでは${mbti}型、Big Fiveでは開放性${s.openness > 55 ? 'が高く' : 'は控えめ'}、誠実性${s.conscientiousness > 55 ? 'が高く' : 'は平均的'}、外向性${s.extraversion > 55 ? 'が高い' : 'はやや低め'}という結果が出ています。`;
  const ability = `能力面では${top}が特に際立っており、一方で${bottom}については意識的な改善が効果的です。`;
  const values = s.stability > 60 ? '安定と継続を重視する傾向' : s.challenge > 60 ? '成長と挑戦を最優先する傾向' : 'バランス型の価値観';
  const future = `将来は${s.entrepreneurship > 60 ? '独立や新規事業への挑戦' : s.stability > 60 ? '確固たる地位と安定を築く' : '柔軟にキャリアを探索する'}ルートが適しています。総じて、今の段階で自分を理解し、${top}を活かした道を選ぶことが成功の鍵となります。`;
  return `${intro}${analysis}${ability}価値観では${values}が強く、${future}`;
}
