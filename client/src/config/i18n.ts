import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 言語jsonファイルのimport
import enJson from './locales/en.json';
import jaJson from './locales/ja.json';

i18n

  // Enable automatic language detection
  .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)

  .init({
    lng: 'ja',
    resources: {
      ja: {
        translation: jaJson,
      },
      en: {
        translation: enJson,
      },
    },
    fallbackLng: 'ja',
    debug: false,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
