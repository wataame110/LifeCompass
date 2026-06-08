// ===== データ型定義 =====

export interface UserProfile {
  birthYear: number;
  gender: 'male' | 'female' | 'other' | 'no_answer';
  currentAge: number;
}

export type LifeStage =
  | 'childhood'
  | 'elementary'
  | 'junior_high'
  | 'high_school'
  | 'university'
  | 'current';

export interface Answer {
  questionId: string;
  value: string | string[] | number;
  category: string;
  stage?: LifeStage;
}

export interface DiagnosisData {
  profile: UserProfile;
  answers: Answer[];
  completedAt?: string;
}

export interface QuestionOption {
  value: string;
  label: string;
  scores?: Record<string, number>;
}

export interface Question {
  id: string;
  stage: LifeStage;
  category: 'action' | 'relationship' | 'success' | 'failure' | 'value';
  type: 'single' | 'multiple' | 'text' | 'scale';
  text: string;
  description?: string;
  options?: QuestionOption[];
  condition?: (answers: Answer[]) => boolean;
  maxLength?: number;
  required?: boolean;
  min?: number;
  max?: number;
}

export interface PersonalityTrait {
  name: string;
  score: number;
  description: string;
}

export interface AbilityScore {
  name: string;
  score: number;
  description: string;
}

export interface ValueScore {
  name: string;
  score: number;
  importance: number;
}

export interface CareerFit {
  career: string;
  fit: number;
  reason: string;
}

export interface OrganizationFit {
  type: string;
  fit: number;
  reason: string;
}

export interface FutureScenario {
  title: string;
  probability: number;
  description: string;
  steps: string[];
}

export interface JobHuntingSupport {
  selfPR: { title: string; text: string }[];
  strengthAnswer: string;
  weaknessAnswer: string;
  gakuchika: string;
  motivationTemplate: string;
  careerVision: string;
  interviewQuestions: { question: string; answer: string }[];
  concerns: string[];
  esSupport: string;
}

export interface AnalysisResult {
  lifeSummary: string;
  personalityReport: {
    mbti?: string;
    bigFive: Record<string, number>;
    disc: Record<string, number>;
    cognitive: Record<string, number>;
    traits: PersonalityTrait[];
    thinkingTendency: string;
    behaviorTendency: string;
    decisionTendency: string;
  };
  strengthsTop10: PersonalityTrait[];
  weaknessesTop10: PersonalityTrait[];
  suitableEnvironments: string[];
  unsuitableEnvironments: string[];
  stressFactors: string[];
  suitableCareers: CareerFit[];
  unsuitableCareers: CareerFit[];
  organizationFit: OrganizationFit[];
  futureScenarios: FutureScenario[];
  jobHuntingSupport: JobHuntingSupport;
  // visualizations
  timeline: { age: number; label: string; event: string; emotion: 'positive' | 'neutral' | 'negative' }[];
  scores: Record<string, number>;
}
