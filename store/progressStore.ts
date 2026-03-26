import { create } from 'zustand';

interface ProgressState {
  gems: number;
  streak: number;
  longestStreak: number;
  totalDays: number;
  completedNodes: string[];
  activeNodes: string[];
  setGems: (gems: number) => void;
  setStreakData: (streak: number, longestStreak: number, totalDays: number) => void;
  setNodes: (completed: string[], active: string[]) => void;
  addCompletedNode: (nodeId: string) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  gems: 0,
  streak: 0,
  longestStreak: 0,
  totalDays: 0,
  completedNodes: [],
  activeNodes: [],
  setGems: (gems) => set({ gems }),
  setStreakData: (streak, longestStreak, totalDays) => set({ streak, longestStreak, totalDays }),
  setNodes: (completed, active) => set({ completedNodes: completed, activeNodes: active }),
  addCompletedNode: (nodeId) => set((state) => ({ completedNodes: [...state.completedNodes, nodeId] })),
}));
