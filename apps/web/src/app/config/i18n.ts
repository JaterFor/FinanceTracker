import { ruTranslation } from '@finance-tracker/shared';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'ru',
  fallbackLng: 'ru',
  resources: {
    ru: { translation: ruTranslation },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
