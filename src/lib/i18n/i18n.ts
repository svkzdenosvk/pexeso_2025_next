import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import sk from './locales/sk.json';
import de from './locales/de.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    sk: { translation: sk },
    de: { translation: de },
  },
  lng: 'sk', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react doing this automatically
  },
});

export default i18n;
