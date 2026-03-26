import { create } from 'zustand';

interface LessonState {
  currentLesson: any | null;
  quizState: any | null;
  attemptId: string | null;
  setCurrentLesson: (lesson: any) => void;
  setQuizState: (quizState: any) => void;
  setAttemptId: (attemptId: string) => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  currentLesson: null,
  quizState: null,
  attemptId: null,
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  setQuizState: (quizState) => set({ quizState }),
  setAttemptId: (attemptId) => set({ attemptId }),
}));
