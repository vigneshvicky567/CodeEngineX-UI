import { create } from 'zustand';

interface LessonState {
  currentLessonId: string | null;
  assessmentId: string | null;
  attemptId: string | null;
  setCurrentLesson: (lessonId: string, assessmentId?: string) => void;
  setAttemptId: (attemptId: string) => void;
  clearLesson: () => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  currentLessonId: null,
  assessmentId: null,
  attemptId: null,
  setCurrentLesson: (lessonId, assessmentId) => set({ currentLessonId: lessonId, assessmentId }),
  setAttemptId: (attemptId) => set({ attemptId }),
  clearLesson: () => set({ currentLessonId: null, assessmentId: null, attemptId: null }),
}));
