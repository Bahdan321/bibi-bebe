import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ru, en, } from './translations';

// Переводы для разных языков
const resources = {
    ru: {
        translation: ru,
    },
    en: {
        translation: en,
    },
    // es: {
    //     translation: es
    // },
    // de: {
    //     translation: ge,
    // },
    // fr: {
    //     translation: fr,
    // }

};

// Конфигурация i18n
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // язык по умолчанию (будет переопределен в LocalizationProvider)
        fallbackLng: 'en', // резервный язык

        interpolation: {
            escapeValue: false,
        },

        // Настройки для React Native
        compatibilityJSON: 'v4',

        // Отладка, в продакшене надо бы отрубить
        debug: __DEV__,
    });

export default i18n;

// Типы для языков
export type SupportedLanguage = 'en' | 'ru' //| 'es' | 'de' | 'fr';

// Информация о поддерживаемых языках
export const SUPPORTED_LANGUAGES: Array<{
    code: SupportedLanguage;
    name: string;
    nativeName: string;
}> = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский' },
        // { code: 'es', name: 'Spanish', nativeName: 'Español' },
        // { code: 'de', name: 'German', nativeName: 'Deutsch' },
        // { code: 'fr', name: 'French', nativeName: 'Français' },
    ];