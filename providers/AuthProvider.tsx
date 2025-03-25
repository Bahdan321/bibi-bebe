import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveAccessToken, saveRefreshToken, getAccessToken, refreshAccessToken } from '@/storages/tokenStorage';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Проверка аутентификации при загрузке приложения
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await getAccessToken();
                setIsAuthenticated(!!token);
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Функция для входа в аккаунт
    const signIn = async (username: string, password: string) => {
        try {
            setIsLoading(true);
            // Замените URL на ваш API endpoint
            const apiUrl = "https://localhost:8000";

            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(`${apiUrl}/jwt/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                await saveAccessToken(data.access_token);
                await saveRefreshToken(data.refresh_token);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, error: data.detail || 'Ошибка авторизации' };
            }
        } catch (error) {
            console.error('Error during sign in:', error);
            return { success: false, error: 'Произошла ошибка при входе' };
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для регистрации
    const signUp = async (username: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            // Замените URL на ваш API endpoint
            const apiUrl = "https://localhost:8000";
            const response = await fetch(`${apiUrl}/jwt/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Если API возвращает токены при регистрации
                if (data.access_token && data.refresh_token) {
                    await saveAccessToken(data.access_token);
                    await saveRefreshToken(data.refresh_token);
                    setIsAuthenticated(true);
                }
                return { success: true };
            } else {
                return { success: false, error: data.detail || 'Ошибка регистрации' };
            }
        } catch (error) {
            console.error('Error during sign up:', error);
            return { success: false, error: 'Произошла ошибка при регистрации' };
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для выхода из аккаунта
    const signOut = async () => {
        try {
            setIsLoading(true);
            // Удаляем токены из хранилища
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error during sign out:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};