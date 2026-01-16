import type { Language } from "../store/useStore";

const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const swedishRegex = /[åäöÅÄÖ]/;

export const detectLanguage = (text: string): { language: Language; isRTL: boolean } => {
  if (arabicRegex.test(text)) {
    return { language: "ar", isRTL: true };
  }

  if (swedishRegex.test(text)) {
    return { language: "sv", isRTL: false };
  }

  return { language: "en", isRTL: false };
};

export const normalizeText = (text: string) => text.replace(/\s+/g, " ").trim();
