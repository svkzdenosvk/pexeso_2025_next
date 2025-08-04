import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import sk from './locales/sk.json';
import de from './locales/de.json';

/**
 * i18n.ts
 *
 * Internationalization (i18n) configuration file for the Pexeso app.
 * Uses i18next and react-i18next to manage language support.
 *
 * Features:
 * - Loads translation JSON files for supported languages
 * - Sets up default language and fallback
 * - Connects i18next to React via initReactI18next
 *
 * @dependencies i18next, react-i18next
 */

// Initialize i18n instance
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    sk: { translation: sk },
    de: { translation: de },
  },
  lng: 'sk', // Default language
  fallbackLng: 'en', // Fallback if translation not found
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
