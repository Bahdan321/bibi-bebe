import { useTranslation } from 'react-i18next';

/**
 * Helper hook for using translations with CustomText components
 * Provides convenient methods for translating text
 */
export const useTranslatedText = () => {
    const { t } = useTranslation();

    /**
     * Get translated text by key
     * @param key Translation key (e.g., 'settings.language')
     * @param options Translation options/variables
     * @returns Translated text
     */
    const getText = (key: string, options?: Record<string, any>): string => {
        return t(key, options);
    };

    /**
     * Check if a translation key exists
     * @param key Translation key
     * @returns Boolean indicating if key exists
     */
    const hasKey = (key: string): boolean => {
        return t(key, { defaultValue: null }) !== null;
    };

    return {
        t,
        getText,
        hasKey,
    };
};

export default useTranslatedText;