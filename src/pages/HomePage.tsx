import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Users, Lock, Sparkles, ArrowRight, Shield, Heart, Target } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-lc-primary-50 dark:from-lc-dark-bg dark:to-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lc-primary-100 dark:bg-lc-primary-900/30 text-lc-primary-700 dark:text-lc-primary-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>完全無料・会員登録不要・勧誘なし</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              あなたの
              <span className="text-lc-primary-600 dark:text-lc-primary-400">人生の取扱説明書</span>
              を作ろう
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              幼少期から現在までの人生を分析し、性格・能力・価値観・キャリアまで統合的に理解する。
              <br className="hidden sm:block" />
              就活生・転職者・人生に迷う全ての人へ。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/diagnosis" className="lc-btn-primary text-lg px-8 py-4 gap-2">
                <Compass className="w-5 h-5" />
                診断をはじめる
              </Link>
              <Link to="/result" className="lc-btn-outline text-lg px-8 py-4">
                過去の結果を見る
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" />個人情報不要</span>
              <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" />完全無料</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" />勧誘・誘導なし</span>
              <span className="flex items-center gap-1.5"><Target className="w-4 h-4" />ローカル保存</span>
            </div>
          </div>
        </section>

        {/* Ad Space */}
        <div className="max-w-5xl mx-auto px-4 mb-8">
          <div className="lc-ad-space">
            <span>広告スペース（自動広告挿入可能）</span>
          </div>
        </div>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Life Compassが提供する分析
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="lc-card p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-lc-primary-100 dark:bg-lc-primary-900/30 flex items-center justify-center text-lc-primary-600 dark:text-lc-primary-400 mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Analysis Flow */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            診断の流れ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="lc-card p-6 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-lc-primary-600 text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 mt-2">{s.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Second Ad */}
        <div className="max-w-5xl mx-auto px-4 mb-8">
          <div className="lc-ad-space">
            <span>広告スペース（自動広告挿入可能）</span>
          </div>
        </div>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            あなた自身を理解する第一歩を踏み出そう
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            診断は5分〜15分程度。途中で中断してもブラウザに自動保存されます。
          </p>
          <Link to="/diagnosis" className="lc-btn-accent text-lg px-8 py-4 gap-2">
            今すぐ診断を始める
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const features = [
  { title: 'MBTI×Big Five統合', desc: 'MBTI・Big Five・YG・DISC・認知特性を掛け合わせた多角的な性格診断', icon: <Users className="w-6 h-6" /> },
  { title: '人生年表分析', desc: '幼少期から現在までのライフストーリーを年表化し、パターンと価値観の変遷を可視化', icon: <Target className="w-6 h-6" /> },
  { title: '能力マッピング', desc: '論理思考・創造性・実行力・リーダーシップ等10の能力を独自スコアリング', icon: <Sparkles className="w-6 h-6" /> },
  { title: 'キャリアシミュレーション', desc: '現状維持・成長・リスク・独立の4ルートを確率的に予測', icon: <Compass className="w-6 h-6" /> },
  { title: '就活支援キット', desc: '自己PR3パターン・ガクチカ・志望動機・想定質問20問以上を自動生成', icon: <Shield className="w-6 h-6" /> },
  { title: '完全プライバシー', desc: 'メール不要・SNS不要。データはあなたのブラウザ内にローカル保存', icon: <Lock className="w-6 h-6" /> },
];

const steps = [
  { title: 'プロフィール入力', desc: '年齢・性別などの基本情報を入力します（匿名OK）' },
  { title: '年代別質問回答', desc: '幼少期から現在まで、人生の各段階を振り返って回答' },
  { title: '結果を見る', desc: 'AI分析エンジンが統合分析し、レポート・チャート・就活支援を自動生成' },
];
