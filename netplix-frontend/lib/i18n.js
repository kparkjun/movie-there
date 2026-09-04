import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "@/locales/ko.json";

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
  },
  lng: "ko",
  fallbackLng: "ko",
  interpolation: { escapeValue: false },
});

export const SUPPORTED_LANGS = ["ko"];

export function detectAndApplyLanguage() {
  if (typeof window === "undefined") return;
  localStorage.setItem("user_lang", "ko");
  localStorage.setItem("i18nextLng", "ko");
  i18n.changeLanguage("ko");
}

export function setUserLanguage() {
  detectAndApplyLanguage();
}

export default i18n;
