import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Answer, UserProfile, LifeStage } from '@/types';

interface DiagnosisState {
  profile: UserProfile | null;
  currentStage: LifeStage | null;
  answers: Answer[];
  completedStages: LifeStage[];
  isComplete: boolean;
}

type DiagnosisAction =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_STAGE'; payload: LifeStage }
  | { type: 'ADD_ANSWERS'; payload: Answer[] }
  | { type: 'COMPLETE_STAGE'; payload: LifeStage }
  | { type: 'COMPLETE_DIAGNOSIS' }
  | { type: 'RESET' };

function diagnosisReducer(state: DiagnosisState, action: DiagnosisAction): DiagnosisState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_STAGE':
      return { ...state, currentStage: action.payload };
    case 'ADD_ANSWERS':
      return { ...state, answers: [...state.answers, ...action.payload] };
    case 'COMPLETE_STAGE':
      return {
        ...state,
        completedStages: [...state.completedStages, action.payload],
      };
    case 'COMPLETE_DIAGNOSIS':
      return { ...state, isComplete: true };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const initialState: DiagnosisState = {
  profile: null,
  currentStage: null,
  answers: [],
  completedStages: [],
  isComplete: false,
};

const DiagnosisContext = createContext<{
  state: DiagnosisState;
  dispatch: React.Dispatch<DiagnosisAction>;
} | null>(null);

export function DiagnosisProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(diagnosisReducer, initialState, () => {
    try {
      const saved = localStorage.getItem('lc_diagnosis');
      if (saved) return { ...initialState, ...JSON.parse(saved) };
    } catch { /* ignore */ }
    return initialState;
  });

  React.useEffect(() => {
    localStorage.setItem('lc_diagnosis', JSON.stringify(state));
  }, [state]);

  return (
    <DiagnosisContext.Provider value={{ state, dispatch }}>
      {children}
    </DiagnosisContext.Provider>
  );
}

export function useDiagnosis() {
  const ctx = useContext(DiagnosisContext);
  if (!ctx) throw new Error('useDiagnosis must be used within DiagnosisProvider');
  return ctx;
}
