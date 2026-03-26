import { create } from 'zustand';

interface EditorState {
  code: string;
  language: string;
  output: string;
  setCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  setOutput: (output: string) => void;
  clearOutput: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: '',
  language: 'python',
  output: '',
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setOutput: (output) => set({ output }),
  clearOutput: () => set({ output: '' }),
}));
