import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '@/theme/themes';
import { Theme } from '@/theme/types';

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_KEY);
                if (savedTheme !== null) {
                    setIsDark(savedTheme === 'dark');
                }
            } catch (error) {
                console.error('Ошибка при загрузке темы:', error);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = useCallback(async () => {
        setIsDark(prev => {
            const newIsDark = !prev;
            AsyncStorage.setItem(THEME_KEY, newIsDark ? 'dark' : 'light');
            return newIsDark;
        });
    }, []);

    const value = {
        theme: isDark ? darkTheme : lightTheme,
        isDark,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme должен использоваться внутри ThemeProvider');
    }
    return context;
};