import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveAccessToken, saveRefreshToken, getAccessToken, refreshAccessToken, getRefreshToken } from '@/storages/tokenStorage';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { getCurrentUrl } from '@/hooks/useGetCurrentUrl';
import { getApiUrl } from '@/storages/apiUrlStorage';
import { fetchWithAuth } from '@/hooks/useFetchWithAuth';
import { AuthContextType, User } from '@/types/types';
import { saveSpace } from '@/storages/spaceStorage';
import { supabase } from '@/Supabase/utils/SupaLegend';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { User as SupabaseUser } from '@supabase/supabase-js';


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
    const [user, setUser] = useState<User | null>(null);
    // const apiUrl = getApiUrl();
    // const apiUrl = "http://192.168.41.151:8000";
    // console.log(apiUrl)

    // Проверка аутентификации при загрузке приложения
    useEffect(() => {
        const setupAuth = async () => {
            try {
                console.log('Настройка аутентификации...');
                
                // Настройка обработчика событий аутентификации
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                    async (event, session) => {
                        console.log('Изменение состояния аутентификации:', event);
                        
                        if (event === 'SIGNED_IN' && session) {
                            console.log('Пользователь вошел в систему, сохраняем токены...');
                            
                            // Проверка формата токенов перед сохранением
                            const accessTokenParts = session.access_token.split('.');
                            
                            let validTokens = true;
                            
                            // Проверяем только access token на соответствие формату JWT
                            if (accessTokenParts.length !== 3) {
                                console.error('Неверный формат access token при входе в систему:', session.access_token.substring(0, 20) + '...');
                                validTokens = false;
                            } else {
                                await saveAccessToken(session.access_token);
                            }
                            
                            // Refresh token от Supabase может иметь формат, отличный от JWT
                            // Поэтому мы не проверяем его формат, а просто сохраняем
                            console.log('Сохраняем refresh token:', session.refresh_token.substring(0, 20) + '...');
                            await saveRefreshToken(session.refresh_token);
                            
                            if (validTokens) {
                                setUser(session.user as unknown as User);
                                setIsAuthenticated(true);
                            } else {
                                console.error('Не удалось сохранить токены из-за неверного формата');
                                // Не устанавливаем пользователя и не аутентифицируем, если токены неверного формата
                            }
                        } else if (event === 'SIGNED_OUT') {
                            console.log('Пользователь вышел из системы, удаляем токены...');
                            await SecureStore.deleteItemAsync('access_token');
                            await SecureStore.deleteItemAsync('refresh_token');
                            setUser(null);
                            setIsAuthenticated(false);
                        } else if (event === 'TOKEN_REFRESHED' && session) {
                            console.log('Токен обновлен, сохраняем новые токены...');
                            
                            // Проверка формата токенов перед сохранением
                            const accessTokenParts = session.access_token.split('.');
                            
                            let validTokens = true;
                            
                            // Проверяем только access token на соответствие формату JWT
                            if (accessTokenParts.length !== 3) {
                                console.error('Неверный формат access token при обновлении токенов:', session.access_token.substring(0, 20) + '...');
                                validTokens = false;
                            } else {
                                await saveAccessToken(session.access_token);
                            }
                            
                            // Refresh token от Supabase может иметь формат, отличный от JWT
                            // Поэтому мы не проверяем его формат, а просто сохраняем
                            console.log('Сохраняем обновленный refresh token:', session.refresh_token.substring(0, 20) + '...');
                            await saveRefreshToken(session.refresh_token);
                            
                            if (!validTokens) {
                                console.error('Не удалось сохранить обновленные токены из-за неверного формата');
                                // Не устанавливаем пользователя и не аутентифицируем, если токены неверного формата
                                await SecureStore.deleteItemAsync('access_token');
                                await SecureStore.deleteItemAsync('refresh_token');
                                setUser(null);
                                setIsAuthenticated(false);
                            }
                        } else if (event === 'INITIAL_SESSION' && session) {
                            console.log('Начальная сессия обнаружена, проверяем токены...');
                            
                            // Проверка формата токенов перед использованием
                            const accessTokenParts = session.access_token.split('.');
                            
                            let validTokens = true;
                            
                            // Проверяем только access token на соответствие формату JWT
                            if (accessTokenParts.length !== 3) {
                                console.error('Неверный формат access token при начальной сессии:', session.access_token.substring(0, 20) + '...');
                                validTokens = false;
                            }
                            
                            // Refresh token от Supabase может иметь формат, отличный от JWT
                            // Поэтому мы не проверяем его формат
                            console.log('Refresh token начальной сессии:', session.refresh_token.substring(0, 20) + '...');
                            
                            if (!validTokens) {
                                console.error('Access token начальной сессии имеет неверный формат, очищаем...');
                                await SecureStore.deleteItemAsync('access_token');
                                await SecureStore.deleteItemAsync('refresh_token');
                                setUser(null);
                                setIsAuthenticated(false);
                            } else {
                                 // Не сохраняем токены здесь, так как они уже должны быть сохранены
                                 // Просто проверяем состояние аутентификации
                                 await checkAuth();
                             }
                        } else if (event === 'INITIAL_SESSION') {
                            console.log('Начальная сессия обнаружена без токенов, проверяем сохраненные токены...');
                            // Просто проверяем состояние аутентификации
                        }
                    }
                );

                // Проверка текущего состояния аутентификации
                await checkAuth();

                return () => {
                    subscription.unsubscribe();
                };
            } catch (error) {
                console.error('Ошибка при настройке аутентификации:', error);
            }
        };

        const checkAuth = async () => {
            try {
                console.log('Проверка аутентификации...');
                
                // Получаем токены
                const accessToken = await getAccessToken();
                const refreshToken = await getRefreshToken();
                
                // Дополнительная проверка формата токенов
                if (accessToken) {
                    const accessTokenParts = accessToken.split('.');
                    if (accessTokenParts.length !== 3) {
                        console.error('Неверный формат access token при проверке аутентификации:', accessToken.substring(0, 20) + '...');
                        await SecureStore.deleteItemAsync('access_token');
                        // Продолжаем выполнение, так как getAccessToken уже должен был обработать неверный формат
                    }
                }
                
                // Refresh token от Supabase может иметь формат, отличный от JWT
                // Поэтому мы не проверяем его формат
                if (refreshToken) {
                    console.log('Refresh token найден:', refreshToken.substring(0, 20) + '...');
                }

                // Сначала пробуем использовать существующий accessToken
                if (accessToken && refreshToken) {
                    console.log('Токены найдены, проверяем пользователя через Supabase...');
                    
                    // Получаем информацию о пользователе через Supabase
                    const { data, error } = await supabase.auth.getUser(accessToken);
                    
                    if (error) {
                        console.error('Ошибка при получении пользователя:', error.message);
                        // Пробуем обновить токен
                        const newToken = await refreshAccessToken();
                        if (newToken) {
                            // Если токен обновлен успешно, повторно проверяем пользователя
                            const { data: refreshData, error: refreshError } = await supabase.auth.getUser(newToken);
                            if (!refreshError && refreshData.user) {
                                setUser(refreshData.user as unknown as User);
                                setIsAuthenticated(true);
                                console.log('Аутентификация успешна после обновления токена');
                                return;
                            }
                        }
                        // Если обновление не помогло, очищаем токены
                        console.log('Не удалось восстановить аутентификацию, очищаем токены');
                        await SecureStore.deleteItemAsync('access_token');
                        await SecureStore.deleteItemAsync('refresh_token');
                        setIsAuthenticated(false);
                    } else if (data.user) {
                        // Пользователь найден, устанавливаем состояние
                        setUser(data.user as unknown as User);
                        setIsAuthenticated(true);
                        console.log('Аутентификация успешна');
                        return;
                    }
                }

                // Если нет accessToken, но есть refreshToken, пробуем обновить
                if (!accessToken && refreshToken) {
                    console.log("Access token отсутствует, пробуем обновить");
                    try {
                        const newAccessToken = await refreshAccessToken();
                        if (newAccessToken) {
                            const { data } = await supabase.auth.getUser(newAccessToken);
                            if (data.user) {
                                setUser(data.user as unknown as User);
                                setIsAuthenticated(true);
                                console.log('Аутентификация успешна после обновления токена');
                                return;
                            }
                        }
                    } catch (refreshError) {
                        console.error('Ошибка при обновлении токена:', refreshError);
                        // Если обновление не удалось, удаляем refresh токен, так как он недействителен
                        await SecureStore.deleteItemAsync('refresh_token');
                    }
                }

                // Если ни один из сценариев выше не сработал, устанавливаем флаг неаутентифицированного пользователя
                console.log("Токены отсутствуют или недействительны");
                setIsAuthenticated(false);

            } catch (error) {
                console.error('Ошибка при проверке аутентификации:', error);
                // В случае критической ошибки также очищаем токены
                try {
                    await SecureStore.deleteItemAsync('access_token');
                    await SecureStore.deleteItemAsync('refresh_token');
                } catch (deleteError) {
                    console.error('Ошибка при удалении токенов:', deleteError);
                }
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        // Запускаем настройку аутентификации при монтировании компонента
        setupAuth();
    }, []);

    // Отдельный эффект для навигации, который будет выполняться после монтирования и изменения состояния аутентификации
    useEffect(() => {
        // Пропускаем первый рендер, когда isLoading = true
        if (!isLoading) {
            if (isAuthenticated) {
                router.replace('/(private)/home');
            } else {
                router.replace('/(public)/signIn');
            }
        }
    }, [isAuthenticated, isLoading]);

    // Функция для входа в аккаунт
    const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            setIsLoading(true);
            console.log('Выполняется вход...');
            
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error('Ошибка при входе:', error.message);
                throw error;
            }
            
            if (data.session) {
                console.log('Сессия создана успешно, сохраняем токены...');
                
                // Проверка формата токенов перед сохранением
                const accessTokenParts = data.session.access_token.split('.');
                
                let validTokens = true;
                
                // Проверяем только access token на соответствие формату JWT
                if (accessTokenParts.length !== 3) {
                    console.error('Неверный формат access token при входе:', data.session.access_token.substring(0, 20) + '...');
                    validTokens = false;
                } else {
                    await saveAccessToken(data.session.access_token);
                }
                
                // Refresh token от Supabase может иметь формат, отличный от JWT
                // Поэтому мы не проверяем его формат, а просто сохраняем
                console.log('Сохраняем refresh token:', data.session.refresh_token.substring(0, 20) + '...');
                await saveRefreshToken(data.session.refresh_token);
                
                if (validTokens) {
                    // Устанавливаем пользователя и состояние аутентификации
                    setUser(data.user as unknown as User);
                    setIsAuthenticated(true);
                    console.log('Вход выполнен успешно');
                    return { success: true };
                } else {
                    console.error('Не удалось сохранить токены из-за неверного формата при входе');
                    // Не устанавливаем пользователя и не аутентифицируем, если токены неверного формата
                    return { success: false, error: 'Неверный формат токенов' };
                }
            }
            
            console.error('Не удалось создать сессию');
            return { success: false, error: 'Не удалось создать сессию' };
        } catch (error) {
            console.error('Error during sign in:', error);
            return { success: false, error: (error as Error).message || 'Ошибка авторизации' };
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для регистрации
    const signUp = async (username: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { 
                    data: { username },
                    emailRedirectTo: 'exp://localhost:8081/--/home'
                }
            });
            if (error) throw error;
            
            // Проверяем, требуется ли подтверждение по email
            // Если data.session равен null, это означает, что требуется подтверждение
            const requiresConfirmation = !data.session;
            
            if (data.session) {
                // Если сессия создана сразу (без подтверждения email)
                
                // Проверка формата токенов перед сохранением
                const accessTokenParts = data.session.access_token.split('.');
                
                let validTokens = true;
                
                // Проверяем только access token на соответствие формату JWT
                if (accessTokenParts.length !== 3) {
                    console.error('Неверный формат access token при регистрации:', data.session.access_token.substring(0, 20) + '...');
                    validTokens = false;
                } else {
                    await saveAccessToken(data.session.access_token);
                }
                
                // Refresh token от Supabase может иметь формат, отличный от JWT
                // Поэтому мы не проверяем его формат, а просто сохраняем
                console.log('Сохраняем refresh token:', data.session.refresh_token.substring(0, 20) + '...');
                await saveRefreshToken(data.session.refresh_token);
                
                if (validTokens) {
                    setUser(data.user as unknown as User);
                    setIsAuthenticated(true);
                    return { success: true, requiresConfirmation: false };
                } else {
                    console.error('Не удалось сохранить токены из-за неверного формата при регистрации');
                    // Не устанавливаем пользователя и не аутентифицируем, если токены неверного формата
                    return { success: false, error: 'Неверный формат токенов' };
                }
            } else {
                // Если требуется подтверждение email
                console.log('Требуется подтверждение email через OTP');
                return { success: true, requiresConfirmation: true };
            }
        } catch (error) {
            console.error('Error during sign up:', error);
            return { success: false, error: (error as Error).message || 'Ошибка регистрации' };
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для выхода из аккаунта
    const signOut = async (): Promise<void> => {
        try {
            setIsLoading(true);
            console.log('Выполняется выход из аккаунта...');
            
            // Выход из Supabase
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Ошибка при выходе из Supabase:', error.message);
                // Не выбрасываем ошибку, чтобы продолжить выполнение функции
                // и очистить локальное состояние в любом случае
            }
            
            // Удаляем токены из хранилища
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            
            // Сбрасываем состояние аутентификации
            setUser(null);
            setIsAuthenticated(false);
            
            console.log('Выход выполнен успешно');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            // В случае ошибки все равно сбрасываем локальное состояние
            setUser(null);
            setIsAuthenticated(false);
            // Пытаемся удалить токены даже при ошибке
            try {
                await SecureStore.deleteItemAsync('access_token');
                await SecureStore.deleteItemAsync('refresh_token');
            } catch (deleteError) {
                console.error('Ошибка при удалении токенов:', deleteError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // const getUserInfo = async () => {
    //     try {
    //         setIsLoading(true);
    //         const response = await fetchWithAuth(`${apiUrl}/user/me/`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             console.log("Данные пользователя:", data);
    //             setUser(data);
    //             return { success: true };
    //         } else {
    //             return { success: false, error: data.detail || 'Ошибка при получении данных пользователей' };
    //         }

    //     } catch (error) {
    //         console.error('Error during getting user info:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    const createUserSpace = async (spaceName: string): Promise<{ success: boolean; error?: string }> => {
        try {
            setIsLoading(true);

            const response = await fetchWithAuth(`/space/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: spaceName }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Данные:", data);
                await saveSpace(data);

                return { success: true };
            } else {
                return { success: false, error: data.detail || 'Ошибка при получении данных пространства' };
            }

        } catch (error) {
            console.error('Error during create new space:', error);
            return { success: false, error: 'Произошла ошибка при создании пространства' };
        } finally {
            setIsLoading(false);
        }
    }

    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            console.log('Выполняется вход через Google...');
            const redirect = makeRedirectUri();
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirect,
                    queryParams: { access_type: 'offline', prompt: 'consent' },
                },
            });

            if (error) {
                console.error('Ошибка при входе через Google:', error.message);
                throw error;
            }

            console.log('Получен URL для авторизации через Google:', data.url);
            const browserResult = await WebBrowser.openAuthSessionAsync(data.url, redirect);

            if (browserResult.type === 'success') {
                console.log('Успешная авторизация через Google');
                const url = browserResult.url;
                const params = new URLSearchParams(url.split('#')[1]);
                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');
                
                // Проверяем формат токенов перед использованием
                if (accessToken) {
                    // Проверка формата access token
                    const accessTokenParts = accessToken.split('.');
                    if (accessTokenParts.length !== 3) {
                        console.error('Неверный формат access token при входе через Google:', accessToken.substring(0, 20) + '...');
                        return { success: false, error: 'Неверный формат токена доступа' };
                    }
                    
                    // Проверка формата refresh token, если он есть
                    if (refreshToken) {
                        const refreshTokenParts = refreshToken.split('.');
                        if (refreshTokenParts.length !== 3) {
                            console.error('Неверный формат refresh token при входе через Google:', refreshToken.substring(0, 20) + '...');
                            return { success: false, error: 'Неверный формат токена обновления' };
                        }
                    }
                    console.log('Access token получен, устанавливаем сессию в Supabase...');
                    
                    // Устанавливаем сессию в Supabase с полученными токенами
                    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || ''
                    });
                    
                    if (sessionError) {
                        console.error('Ошибка при установке сессии:', sessionError.message);
                        throw sessionError;
                    }
                    
                    if (sessionData.session) {
                        console.log('Сессия установлена успешно, сохраняем токены...');
                        
                        // Проверка формата токенов перед сохранением
                        const accessTokenParts = sessionData.session.access_token.split('.');
                        const refreshTokenParts = sessionData.session.refresh_token.split('.');
                        
                        let validTokens = true;
                        
                        if (accessTokenParts.length !== 3) {
                            console.error('Неверный формат access token при входе через Google (сессия):', sessionData.session.access_token.substring(0, 20) + '...');
                            validTokens = false;
                        } else {
                            await saveAccessToken(sessionData.session.access_token);
                        }
                        
                        if (refreshTokenParts.length !== 3) {
                            console.error('Неверный формат refresh token при входе через Google (сессия):', sessionData.session.refresh_token.substring(0, 20) + '...');
                            validTokens = false;
                        } else {
                            await saveRefreshToken(sessionData.session.refresh_token);
                        }
                        
                        if (validTokens) {
                            setUser(sessionData.user as unknown as User);
                            setIsAuthenticated(true);
                            console.log('Вход через Google выполнен успешно');
                            return { success: true };
                        } else {
                            console.error('Не удалось сохранить токены из-за неверного формата при входе через Google');
                            return { success: false, error: 'Неверный формат токенов' };
                        }
                    }
                }
            }
            return { success: false, error: 'Не удалось завершить авторизацию через Google' };
        } catch (error) {
            console.error('Error during Google sign in:', error);
            return { success: false, error: (error as Error).message || 'Произошла ошибка при входе через Google' };
        } finally {
            setIsLoading(false);
        }
    };

    const verifySignupOtp = async (email: string, token: string) => {
        try {
            setIsLoading(true);
            console.log('Верификация OTP-кода для регистрации...');
            
            const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
            if (error) {
                console.error('Ошибка при верификации OTP:', error.message);
                throw error;
            }
            
            if (data.session) {
                console.log('OTP верифицирован успешно, сохраняем токены...');
                // Проверка формата токенов перед сохранением
                const accessTokenParts = data.session.access_token.split('.');
                const refreshTokenParts = data.session.refresh_token.split('.');
                
                let validTokens = true;
                
                if (accessTokenParts.length !== 3) {
                    console.error('Неверный формат access token при верификации OTP:', data.session.access_token.substring(0, 20) + '...');
                    validTokens = false;
                } else {
                    await saveAccessToken(data.session.access_token);
                }
                
                if (refreshTokenParts.length !== 3) {
                    console.error('Неверный формат refresh token при верификации OTP:', data.session.refresh_token.substring(0, 20) + '...');
                    validTokens = false;
                } else {
                    await saveRefreshToken(data.session.refresh_token);
                }
                
                if (validTokens) {
                    // Устанавливаем пользователя и состояние аутентификации
                    setUser(data.user as unknown as User);
                    setIsAuthenticated(true);
                    
                    console.log('Регистрация завершена успешно');
                    return { success: true };
                } else {
                    console.error('Не удалось сохранить токены из-за неверного формата при верификации OTP');
                    return { success: false, error: 'Неверный формат токенов' };
                }
            } else {
                console.error('Не удалось создать сессию после верификации OTP');
                return { success: false, error: 'Не удалось создать сессию' };
            }
        } catch (error) {
            console.error('Ошибка при верификации OTP:', error);
            return { success: false, error: (error as Error).message || 'Ошибка верификации OTP' };
        } finally {
            setIsLoading(false);
        }
    };

    const resendSignupOtp = async (email: string) => {
        try {
            const { error } = await supabase.auth.resend({ type: 'signup', email });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, signIn, signUp, signOut, createUserSpace, signInWithGoogle, verifySignupOtp, resendSignupOtp }}>
            {children}
        </AuthContext.Provider>
    );
};