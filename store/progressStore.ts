import { create } from 'zustand';

interface ProgressState {
  nodes: Record<string, any>;
  streak: number;
  gems: number;
  setNodes: (nodes: Record<string, any>) => void;
  setStreak: (streak: number) => void;
  setGems: (gems: number) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  nodes: {},
  streak: 0,
  gems: 0,
  setNodes: (nodes) => set({ nodes }),
  setStreak: (streak) => set({ streak }),
  setGems: (gems) => set({ gems }),
}));
