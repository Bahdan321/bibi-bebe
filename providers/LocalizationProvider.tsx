import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { SupportedLanguage, SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { saveLanguage, getLanguage } from '@/storages/languageStorage';
import * as Localization from 'expo-localization';


interface LocalizationContextType {
    currentLanguage: SupportedLanguage;
    changeLanguage: (language: SupportedLanguage) => Promise<void>;
    supportedLanguages: typeof SUPPORTED_LANGUAGES;
    isLoading: boolean;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
    children: React.ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('ru');
    const [isLoading, setIsLoading] = useState(true);

    // Функция для определения языка устройства
    const getDeviceLanguage = (): SupportedLanguage => {
        const deviceLocales = Localization.getLocales();

        // Проверяем каждый язык устройства
        for (const locale of deviceLocales) {
            const languageCode = locale.languageCode as SupportedLanguage;

            // Проверяем, поддерживается ли этот язык в приложении
            if (SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
                return languageCode;
            }
        }

        // Если язык устройства не поддерживается, возвращаем английский по умолчанию
        return 'en';
    };

    // Загрузка сохраненного языка при инициализации
    useEffect(() => {
        const loadSavedLanguage = async () => {
            try {
                const savedLanguage = await getLanguage() as SupportedLanguage;

                if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
                    // Если есть сохраненный язык, используем его
                    setCurrentLanguage(savedLanguage);
                    await i18n.changeLanguage(savedLanguage);
                } else {
                    // Если сохраненного языка нет, определяем язык устройства
                    const deviceLanguage = getDeviceLanguage();
                    setCurrentLanguage(deviceLanguage);
                    await i18n.changeLanguage(deviceLanguage);
                    await saveLanguage(deviceLanguage);
                }
            } catch (error) {
                console.error('Ошибка при загрузке языка:', error);
                // В случае ошибки используем английский по умолчанию
                const fallbackLanguage = 'en';
                await i18n.changeLanguage(fallbackLanguage);
                setCurrentLanguage(fallbackLanguage);
                await saveLanguage(fallbackLanguage);
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedLanguage();
    }, []);

    // Функция для смены языка
    const changeLanguage = async (language: SupportedLanguage) => {
        try {
            setIsLoading(true);
            await i18n.changeLanguage(language);
            setCurrentLanguage(language);
            await saveLanguage(language);
        } catch (error) {
            console.error('Ошибка при смене языка:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const contextValue: LocalizationContextType = {
        currentLanguage,
        changeLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isLoading,
    };

    return (
        <LocalizationContext.Provider value={contextValue}>
            <I18nextProvider i18n={i18n}>
                {children}
            </I18nextProvider>
        </LocalizationContext.Provider>
    );
};

// Хук для использования контекста локализации
export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};