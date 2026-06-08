import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, User, Calendar, ArrowRight,
  CheckCircle2, Baby, School, GraduationCap, Briefcase, Users
} from 'lucide-react';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { getQuestions } from '@/data/questions';
import type { UserProfile, LifeStage, Question } from '@/types';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const stageMeta: Record<LifeStage, { label: string; icon: React.ReactNode; description: string }> = {
  childhood: { label: '幼少期', icon: <Baby className="w-5 h-5" />, description: '0〜6歳頃の家庭環境・遊び方・出来事' },
  elementary: { label: '小学生', icon: <School className="w-5 h-5" />, description: '7〜12歳の学校生活・部活・成功と挫折' },
  junior_high: { label: '中学生', icon: <School className="w-5 h-5" />, description: '13〜15歳の部活・人間関係・恋愛・価値観' },
  high_school: { label: '高校生', icon: <GraduationCap className="w-5 h-5" />, description: '16〜18歳の文理選択・部活・将来設計' },
  university: { label: '大学生', icon: <GraduationCap className="w-5 h-5" />, description: '19〜22歳の学部・サークル・キャリア意識' },
  current: { label: '現在', icon: <Briefcase className="w-5 h-5" />, description: '現在の仕事・生活・価値観・将来ビジョン' },
};

export default function DiagnosisPage() {
  const { state, dispatch } = useDiagnosis();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(state.profile ?? { birthYear: 2000, gender: 'no_answer', currentAge: 24 });
  const [phase, setPhase] = useState<'profile' | 'questions' | 'review'>('profile');
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [tempAnswers, setTempAnswers] = useState<Record<string, string | string[] | number>>({});

  const stages = useMemo(() => {
    const all = ['childhood', 'elementary', 'junior_high', 'high_school', 'university', 'current'] as LifeStage[];
    const ageMap: Record<string, number> = {
      childhood: 6, elementary: 12, junior_high: 15, high_school: 18, university: 22, current: 999,
    };
    return all.filter(s => profile.currentAge >= (ageMap[s] || 0));
  }, [profile.currentAge]);

  const questions = useMemo(() => getQuestions(profile.currentAge), [profile.currentAge]);
  const currentStage = stages[currentStageIdx];
  const stageQuestions = useMemo(() => questions.filter(q => q.stage === currentStage), [questions, currentStage]);
  const currentQuestion = stageQuestions[currentQIdx];

  const progress = useMemo(() => {
    const total = questions.length;
    const answered = stages.slice(0, currentStageIdx).reduce((sum, st) => sum + questions.filter(q => q.stage === st).length, 0) + currentQIdx;
    return Math.round((answered / total) * 100);
  }, [questions, stages, currentStageIdx, currentQIdx]);

  const handleProfileNext = () => {
    if (profile.currentAge < 10 || profile.currentAge > 80) {
      alert('年齢は10〜80歳の範囲で入力してください');
      return;
    }
    dispatch({ type: 'SET_PROFILE', payload: profile });
    setPhase('questions');
  };

  const handleAnswer = useCallback((qId: string, value: string | string[] | number) => {
    setTempAnswers(prev => ({ ...prev, [qId]: value }));
  }, []);

  const handleNext = () => {
    if (!currentQuestion) return;
    if (currentQuestion.required && (tempAnswers[currentQuestion.id] === undefined || tempAnswers[currentQuestion.id] === '')) {
      alert('この質問は必須です。回答してください。');
      return;
    }

    // Save answer
    dispatch({
      type: 'ADD_ANSWERS',
      payload: [{
        questionId: currentQuestion.id,
        value: tempAnswers[currentQuestion.id] ?? '',
        category: currentQuestion.category,
        stage: currentQuestion.stage,
      }],
    });

    if (currentQIdx < stageQuestions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
    } else if (currentStageIdx < stages.length - 1) {
      dispatch({ type: 'COMPLETE_STAGE', payload: currentStage });
      setCurrentStageIdx(prev => prev + 1);
      setCurrentQIdx(0);
    } else {
      dispatch({ type: 'COMPLETE_STAGE', payload: currentStage });
      setPhase('review');
    }
  };

  const handlePrev = () => {
    if (currentQIdx > 0) {
      setCurrentQIdx(prev => prev - 1);
    } else if (currentStageIdx > 0) {
      setCurrentStageIdx(prev => prev - 1);
      const prevStage = stages[currentStageIdx - 1];
      const prevQuestions = questions.filter(q => q.stage === prevStage);
      setCurrentQIdx(prevQuestions.length - 1);
    }
  };

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_DIAGNOSIS' });
    navigate('/result');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {phase === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lc-card p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-lc-primary-100 dark:bg-lc-primary-900/30 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-lc-primary-600 dark:text-lc-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">まずは簡単なプロフィール入力</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">年齢に応じて質問が変動します。個人情報は保存されません。</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="lc-label">現在の年齢</label>
                <input
                  type="number"
                  className="lc-input"
                  value={profile.currentAge}
                  onChange={e => setProfile(p => ({ ...p, currentAge: Number(e.target.value), birthYear: new Date().getFullYear() - Number(e.target.value) }))}
                  min={10}
                  max={80}
                />
              </div>
              <div>
                <label className="lc-label">生年（任意）</label>
                <input
                  type="number"
                  className="lc-input"
                  value={profile.birthYear}
                  onChange={e => setProfile(p => ({ ...p, birthYear: Number(e.target.value), currentAge: new Date().getFullYear() - Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="lc-label">性別（任意・回答しなくてもOK）</label>
                <select
                  className="lc-select"
                  value={profile.gender}
                  onChange={e => setProfile(p => ({ ...p, gender: e.target.value as UserProfile['gender'] }))}
                >
                  <option value="no_answer">回答しない</option>
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                  <option value="other">その他</option>
                </select>
              </div>
            </div>

            <button onClick={handleProfileNext} className="lc-btn-primary w-full mt-8 gap-2">
              診断を始める
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {phase === 'questions' && currentQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Progress */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-lc-primary-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">{progress}%</span>
            </div>

            {/* Stage badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lc-primary-50 dark:bg-lc-primary-900/20 text-lc-primary-700 dark:text-lc-primary-300 text-sm font-medium">
                {stageMeta[currentStage].icon}
                {stageMeta[currentStage].label}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{stageMeta[currentStage].description}</span>
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="lc-card p-6 sm:p-8"
              >
                <p className="text-sm text-lc-primary-600 dark:text-lc-primary-400 font-medium mb-2">
                  {stageMeta[currentStage].label}の質問 {currentQIdx + 1}/{stageQuestions.length}
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{currentQuestion.text}</h3>
                {currentQuestion.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{currentQuestion.description}</p>
                )}

                {currentQuestion.type === 'single' && (
                  <div className="space-y-2">
                    {currentQuestion.options?.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                          tempAnswers[currentQuestion.id] === opt.value
                            ? 'border-lc-primary-500 bg-lc-primary-50 dark:bg-lc-primary-900/20 text-lc-primary-700 dark:text-lc-primary-300 font-medium'
                            : 'border-gray-200 dark:border-gray-600 hover:border-lc-primary-300 dark:hover:border-lc-primary-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'multiple' && (
                  <div className="space-y-2">
                    {currentQuestion.options?.map(opt => {
                      const selected = ((tempAnswers[currentQuestion.id] as string[]) || []).includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            const current = ((tempAnswers[currentQuestion.id] as string[]) || []);
                            const next = selected ? current.filter(v => v !== opt.value) : [...current, opt.value];
                            handleAnswer(currentQuestion.id, next);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                            selected
                              ? 'border-lc-primary-500 bg-lc-primary-50 dark:bg-lc-primary-900/20 text-lc-primary-700 dark:text-lc-primary-300 font-medium'
                              : 'border-gray-200 dark:border-gray-600 hover:border-lc-primary-300 dark:hover:border-lc-primary-700'
                          }`}
                        >
                          {opt.label}
                          {selected && <CheckCircle2 className="w-5 h-5" />}
                        </button>
                      );
                    })}
                    <p className="text-xs text-gray-400 mt-2">複数選択可</p>
                  </div>
                )}

                {currentQuestion.type === 'text' && (
                  <div>
                    <textarea
                      className="lc-input resize-none"
                      rows={4}
                      maxLength={currentQuestion.maxLength || 500}
                      value={(tempAnswers[currentQuestion.id] as string) || ''}
                      onChange={e => handleAnswer(currentQuestion.id, e.target.value)}
                      placeholder="ここに入力してください..."
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {String(tempAnswers[currentQuestion.id] || '').length}/{currentQuestion.maxLength || 500}文字
                    </p>
                  </div>
                )}

                {currentQuestion.type === 'scale' && (
                  <div>
                    <div className="flex justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{currentQuestion.min ?? 1}</span>
                      <span>{currentQuestion.max ?? 10}</span>
                    </div>
                    <input
                      type="range"
                      min={currentQuestion.min ?? 1}
                      max={currentQuestion.max ?? 10}
                      value={Number(tempAnswers[currentQuestion.id] ?? Math.floor(((currentQuestion.max ?? 10) + (currentQuestion.min ?? 1)) / 2))}
                      onChange={e => handleAnswer(currentQuestion.id, Number(e.target.value))}
                      className="w-full accent-lc-primary-500"
                    />
                    <div className="text-center mt-3">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-lc-primary-100 dark:bg-lc-primary-900/30 text-lc-primary-700 dark:text-lc-primary-300 font-bold text-lg">
                        {String(tempAnswers[currentQuestion.id] ?? Math.floor(((currentQuestion.max ?? 10) + (currentQuestion.min ?? 1)) / 2))}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={handlePrev}
                    disabled={currentStageIdx === 0 && currentQIdx === 0}
                    className="lc-btn-outline flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    戻る
                  </button>
                  <button onClick={handleNext} className="lc-btn-primary flex-1 gap-2">
                    {currentStageIdx === stages.length - 1 && currentQIdx === stageQuestions.length - 1 ? '確認画面へ' : '次へ'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === 'review' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lc-card p-6 sm:p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">回答が完了しました</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              次に、入力された内容を元にAI分析エンジンが統合分析を行います。
              分析には数秒かかります。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleComplete} className="lc-btn-primary gap-2">
                分析結果を見る
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">データはあなたのブラウザ内に自動保存されています。</p>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
