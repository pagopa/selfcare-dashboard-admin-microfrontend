import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import it from './locale/it';

void i18n.use(initReactI18next).init({
  lng: 'it',
  fallbackLng: 'it',
  ns: ['translation'],
  defaultNS: 'translation',
  resources: {
    it: { translation: it },
  },
  interpolation: { escapeValue: false },
  initImmediate: false,
});

export default i18n;
