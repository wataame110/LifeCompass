import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass, Download, Printer, Share2, ChevronRight, Lightbulb,
  TrendingUp, AlertTriangle, UserCheck, Building2, MapPin,
  Brain, Award, ShieldAlert, Zap, FileText, ArrowLeft,
  Loader2
} from 'lucide-react';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { analyzeAnswers } from '@/utils/analyzer';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import RadarChartPanel from '@/components/visualizations/RadarChartPanel';
import TimelinePanel from '@/components/visualizations/TimelinePanel';
import LifeCompassPanel from '@/components/visualizations/LifeCompassPanel';
import ScenarioMap from '@/components/visualizations/ScenarioMap';
import StrengthMap from '@/components/visualizations/StrengthMap';

export default function ResultPage() {
  const { state } = useDiagnosis();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'summary' | 'personality' | 'skills' | 'career' | 'future' | 'job' | 'visual'>('summary');

  const result = useMemo(() => {
    if (!state.profile || state.answers.length === 0) return null;
    return analyzeAnswers(state.answers, state.profile);
  }, [state]);

  if (!state.profile || state.answers.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-lc-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">診断データがありません</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">まずは診断を完了させてください。</p>
            <Link to="/diagnosis" className="lc-btn-primary">診断を始める</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <Loader2 className="w-10 h-10 animate-spin text-lc-primary-600" />
        </main>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'summary', label: 'サマリー', icon: <Compass className="w-4 h-4" /> },
    { id: 'personality', label: '性格分析', icon: <Brain className="w-4 h-4" /> },
    { id: 'skills', label: '能力・価値観', icon: <Award className="w-4 h-4" /> },
    { id: 'career', label: 'キャリア', icon: <Building2 className="w-4 h-4" /> },
    { id: 'future', label: '将来予測', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'job', label: '就活支援', icon: <FileText className="w-4 h-4" /> },
    { id: 'visual', label: '可視化', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col" id="result-root">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">診断結果レポート</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {state.profile?.currentAge}歳・{state.profile?.gender === 'male' ? '男性' : state.profile?.gender === 'female' ? '女性' : state.profile?.gender === 'other' ? 'その他' : '非公開'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => window.print()} className="lc-btn-outline text-sm px-4 py-2 gap-1.5" title="印刷">
              <Printer className="w-4 h-4" /> 印刷
            </button>
            <Link to="/export" className="lc-btn-primary text-sm px-4 py-2 gap-1.5">
              <Download className="w-4 h-4" /> 保存
            </Link>
          </div>
        </div>

        {/* Ad */}
        <div className="lc-ad-space mb-6">
          <span>広告スペース</span>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 pb-2 mb-6 scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? 'bg-lc-primary-600 text-white'
                  : 'bg-white dark:bg-lc-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'summary' && <SummaryTab result={result} />}
          {activeTab === 'personality' && <PersonalityTab result={result} />}
          {activeTab === 'skills' && <SkillsTab result={result} />}
          {activeTab === 'career' && <CareerTab result={result} />}
          {activeTab === 'future' && <FutureTab result={result} />}
          {activeTab === 'job' && <JobTab result={result} />}
          {activeTab === 'visual' && <VisualTab result={result} />}
        </motion.div>

        {/* Bottom Ad */}
        <div className="lc-ad-space mt-8">
          <span>広告スペース</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SummaryTab({ result }: { result: NonNullable<ReturnType<typeof analyzeAnswers>> }) {
  return (
    <div className="space-y-6">
      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-3">
          <FileText className="w-5 h-5" />
          <h2 className="font-bold text-lg">人生サマリー</h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{result.lifeSummary}</p>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
          <Award className="w-5 h-5" />
          <h2 className="font-bold text-lg">強み TOP10</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.strengthsTop10.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
              <span className="w-7 h-7 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center text-xs font-bold text-green-800 dark:text-green-300">{i + 1}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{s.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.description}</p>
              </div>
              <div className="ml-auto">
                <ScoreRing score={s.score} color="text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 mb-4">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="font-bold text-lg">弱み TOP10（改善ポイント）</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.weaknessesTop10.map((w, i) => (
            <div key={w.name} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
              <span className="w-7 h-7 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center text-xs font-bold text-red-800 dark:text-red-300">{i + 1}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{w.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{w.description}</p>
              </div>
              <div className="ml-auto">
                <ScoreRing score={w.score} color="text-red-500" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  return (
    <div className={`text-sm font-bold ${color}`}>{score}点</div>
  );
}

function PersonalityTab({ result }: { result: NonNullable<ReturnType<typeof analyzeAnswers>> }) {
  return (
    <div className="space-y-6">
      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-4">
          <Brain className="w-5 h-5" />
          <h2 className="font-bold text-lg">推定 MBTI: <span className="text-2xl font-extrabold">{result.personalityReport.mbti}</span></h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          ※MBTIはライフストーリーからの推定です。公式検査ではありません。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ReportBox title="思考傾向" text={result.personalityReport.thinkingTendency} icon={<Lightbulb className="w-4 h-4" />} />
          <ReportBox title="行動傾向" text={result.personalityReport.behaviorTendency} icon={<Zap className="w-4 h-4" />} />
          <ReportBox title="意思決定傾向" text={result.personalityReport.decisionTendency} icon={<UserCheck className="w-4 h-4" />} />
        </div>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-accent-600 dark:text-lc-accent-400 mb-4">
          <Award className="w-5 h-5" />
          <h2 className="font-bold text-lg">Big Five（五因子モデル）</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(result.personalityReport.bigFive).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-200">{bigFiveLabel(key)}</span>
                <span className="text-gray-500 dark:text-gray-400">{value}点</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-lc-primary-500 rounded-full transition-all" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-4">
          <Award className="w-5 h-5" />
          <h2 className="font-bold text-lg">DISC理論</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(result.personalityReport.disc).map(([key, value]) => (
            <div key={key} className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{discLabel(key)}</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SkillsTab({ result }: { result: NonNullable<ReturnType<typeof analyzeAnswers>> }) {
  return (
    <div className="space-y-6">
      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-4">
          <Award className="w-5 h-5" />
          <h2 className="font-bold text-lg">能力マップ</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="ability-map">
          {result.personalityReport.traits.slice(0, 10).map(t => (
            <div key={t.name} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</span>
                <span className="text-lc-primary-600 dark:text-lc-primary-400 font-bold">{t.score}点</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-lc-primary-500 rounded-full" style={{ width: `${t.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-accent-600 dark:text-lc-accent-400 mb-4">
          <Compass className="w-5 h-5" />
          <h2 className="font-bold text-lg">価値観マップ</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" id="value-map">
          {Object.entries(result.scores)
            .filter(([k]) => ['お金','安定','自由','挑戦','家族','名誉','社会貢献','成長','承認欲求','独立志向'].some(v => k.includes(v)))
            .map(([k, v]) => (
            <div key={k} className="text-center p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{k.replace(/(BigFive_|DISC_|Values_)/,'')}</p>
              <p className="text-xl font-bold text-lc-accent-600 dark:text-lc-accent-400">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
          <MapPin className="w-5 h-5" />
          <h2 className="font-bold text-lg">得意な環境</h2>
        </div>
        <ul className="space-y-2">
          {result.suitableEnvironments.map((e, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              {e}
            </li>
          ))}
        </ul>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="font-bold text-lg">苦手な環境</h2>
        </div>
        <ul className="space-y-2">
          {result.unsuitableEnvironments.map((e, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              {e}
            </li>
          ))}
        </ul>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-4">
          <Zap className="w-5 h-5" />
          <h2 className="font-bold text-lg">ストレス要因</h2>
        </div>
        <ul className="space-y-2">
          {result.stressFactors.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
              <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-300 shrink-0">{i + 1}</span>
              {s}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CareerTab({ result }: { result: NonNullable<ReturnType<typeof analyzeAnswers>> }) {
  return (
    <div className="space-y-6">
      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
          <Award className="w-5 h-5" />
          <h2 className="font-bold text-lg">適職候補 TOP10</h2>
        </div>
        <div className="space-y-3">
          {result.suitableCareers.map((c, i) => (
            <div key={c.career} className="p-4 rounded-xl border border-green-100 dark:border-green-900/20 bg-green-50/50 dark:bg-green-900/5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center text-xs font-bold text-green-800 dark:text-green-300">{i + 1}</span>
                <h3 className="font-bold text-gray-900 dark:text-white">{c.career}</h3>
                <span className="ml-auto text-sm font-bold text-green-600 dark:text-green-400">適合度 {c.fit}%</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 ml-10">{c.reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 mb-4">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="font-bold text-lg">不向きな職種</h2>
        </div>
        <div className="space-y-3">
          {result.unsuitableCareers.map((c, i) => (
            <div key={c.career} className="p-4 rounded-xl border border-red-100 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/5">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{c.career}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{c.reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-4">
          <Building2 className="w-5 h-5" />
          <h2 className="font-bold text-lg">組織適性</h2>
        </div>
        <div className="space-y-3">
          {result.organizationFit.map(o => (
            <div key={o.type} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{o.type}</h3>
                <span className="text-sm font-bold text-lc-primary-600 dark:text-lc-primary-400">適合度 {o.fit}%</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{o.reason}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FutureTab({ result }: { result: NonNullable<ReturnType<typeof analyzeAnswers>> }) {
  return (
    <div className="space-y-6">
      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-bold text-lg">将来シナリオ分析（確率的予測）</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          ※断定ではなく、あなたの回答から導かれた確率的な仮説です。参考として活用してください。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.futureScenarios.map(s => (
            <div key={s.title} className="p-5 rounded-xl border border-lc-primary-100 dark:border-lc-primary-900/20 bg-lc-primary-50/50 dark:bg-lc-primary-900/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white">{s.title}</h3>
                <span className="px-3 py-1 rounded-full bg-lc-primary-100 dark:bg-lc-primary-900/30 text-lc-primary-700 dark:text-lc-primary-300 text-xs font-bold">
                  {s.probability}%
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{s.description}</p>
              <ul className="space-y-1.5">
                {s.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <ChevronRight className="w-3.5 h-3.5 text-lc-primary-500 mt-0.5 shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="lc-card p-6">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
            <MapPin className="w-5 h-5" />
            <h2 className="font-bold text-lg">得意な環境</h2>
          </div>
          <ul className="space-y-2">
            {result.suitableEnvironments.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {e}
              </li>
            ))}
          </ul>
        </section>
        <section className="lc-card p-6">
          <div className="flex items-center gap-2 text-red-500 dark:text-red-400 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="font-bold text-lg">苦手な環境</h2>
          </div>
          <ul className="space-y-2">
            {result.unsuitableEnvironments.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                {e}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function JobTab({ result }: { result: NonNullable<ReturnType<typeof analyzeAnswers>> }) {
  const j = result.jobHuntingSupport;
  return (
    <div className="space-y-6">
      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-4">
          <FileText className="w-5 h-5" />
          <h2 className="font-bold text-lg">自己PR（3パターン）</h2>
        </div>
        <div className="space-y-4">
          {j.selfPR.map((pr, i) => (
            <div key={i} className="p-4 rounded-xl border border-lc-primary-100 dark:border-lc-primary-900/20 bg-lc-primary-50/30 dark:bg-lc-primary-900/5">
              <h3 className="font-semibold text-sm text-lc-primary-700 dark:text-lc-primary-300 mb-2">{pr.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{pr.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
          <Award className="w-5 h-5" />
          <h2 className="font-bold text-lg">強みの面接回答例</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-green-50 dark:bg-green-900/10 p-4 rounded-xl">{j.strengthAnswer}</p>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-4">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="font-bold text-lg">弱みの面接回答例</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl">{j.weaknessAnswer}</p>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-accent-600 dark:text-lc-accent-400 mb-4">
          <FileText className="w-5 h-5" />
          <h2 className="font-bold text-lg">学生時代に力を入れたこと（ガクチカ）</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl">{j.gakuchika}</p>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-4">
          <FileText className="w-5 h-5" />
          <h2 className="font-bold text-lg">志望動機テンプレート</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl">{j.motivationTemplate}</p>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-4">
          <Compass className="w-5 h-5" />
          <h2 className="font-bold text-lg">キャリアビジョン例</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl">{j.careerVision}</p>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-4">
          <UserCheck className="w-5 h-5" />
          <h2 className="font-bold text-lg">想定面接質問＆回答例（20問以上）</h2>
        </div>
        <div className="space-y-4">
          {j.interviewQuestions.map((q, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
              <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Q{i + 1}. {q.question}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{q.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="font-bold text-lg">面接官が懸念しそうなポイント</h2>
        </div>
        <ul className="space-y-2">
          {j.concerns.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-xs font-bold text-red-700 dark:text-red-300 shrink-0">{i + 1}</span>
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-accent-600 dark:text-lc-accent-400 mb-4">
          <FileText className="w-5 h-5" />
          <h2 className="font-bold text-lg">ES作成支援</h2>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{j.esSupport}</p>
      </section>
    </div>
  );
}

function VisualTab({ result }: { result: NonNullable<ReturnType<typeof analyzeAnswers>> }) {
  return (
    <div className="space-y-6">
      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-4">
          <Compass className="w-5 h-5" />
          <h2 className="font-bold text-lg">レーダーチャート：能力×価値観</h2>
        </div>
        <RadarChartPanel data={result.scores} />
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-accent-600 dark:text-lc-accent-400 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-bold text-lg">人生年表</h2>
        </div>
        <TimelinePanel timeline={result.timeline} />
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-4">
          <MapPin className="w-5 h-5" />
          <h2 className="font-bold text-lg">強み発揮条件マップ</h2>
        </div>
        <StrengthMap traits={result.strengthsTop10} />
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-4">
          <Compass className="w-5 h-5" />
          <h2 className="font-bold text-lg">人生コンパス</h2>
        </div>
        <LifeCompassPanel result={result} />
      </section>

      <section className="lc-card p-6">
        <div className="flex items-center gap-2 text-lc-primary-600 dark:text-lc-primary-400 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-bold text-lg">将来シナリオマップ</h2>
        </div>
        <ScenarioMap scenarios={result.futureScenarios} />
      </section>
    </div>
  );
}

function ReportBox({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2 text-lc-primary-600 dark:text-lc-primary-400">
        {icon}
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{text}</p>
    </div>
  );
}

function bigFiveLabel(key: string): string {
  const map: Record<string, string> = {
    openness: '開放性（Openness）',
    conscientiousness: '誠実性（Conscientiousness）',
    extraversion: '外向性（Extraversion）',
    agreeableness: '協調性（Agreeableness）',
    neuroticism: '神経症的傾向（Neuroticism）',
  };
  return map[key] || key;
}

function discLabel(key: string): string {
  const map: Record<string, string> = {
    dominance: '支配型（D）',
    influence: '影響型（I）',
    steadiness: '安定型（S）',
    compliance: '慎重型（C）',
  };
  return map[key] || key;
}

function CheckCircle2(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
