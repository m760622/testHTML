import { create } from "zustand";

export type Language = "en" | "ar" | "sv";

export type ReaderSettings = {
  fontSize: number;
  chunkSize: number;
  wpm: number;
};

export type ReaderState = {
  text: string;
  language: Language;
  isRTL: boolean;
  settings: ReaderSettings;
  setText: (text: string) => void;
  setLanguage: (language: Language, isRTL: boolean) => void;
  updateSettings: (partial: Partial<ReaderSettings>) => void;
  reset: () => void;
};

const defaultSettings: ReaderSettings = {
  fontSize: 36,
  chunkSize: 1,
  wpm: 300,
};

export const useStore = create<ReaderState>((set) => ({
  text: "",
  language: "en",
  isRTL: false,
  settings: defaultSettings,
  setText: (text) => set({ text }),
  setLanguage: (language, isRTL) => set({ language, isRTL }),
  updateSettings: (partial) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...partial,
      },
    })),
  reset: () =>
    set({
      text: "",
      language: "en",
      isRTL: false,
      settings: defaultSettings,
    }),
}));
