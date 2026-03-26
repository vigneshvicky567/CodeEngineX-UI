import { create } from 'zustand';

interface EditorState {
  currentCode: string;
  language: string;
  output: string;
  setCurrentCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  setOutput: (output: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentCode: '',
  language: 'python',
  output: '',
  setCurrentCode: (currentCode) => set({ currentCode }),
  setLanguage: (language) => set({ language }),
  setOutput: (output) => set({ output }),
}));
