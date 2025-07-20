import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { supabase } from '@/Supabase/utils/SupaLegend';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const isTokenExpired = async (token: string) => {
    console.log(token)
    if (!token) {
        console.log("Token is empty or null");
        return true;
    }

    // Проверяем, что токен имеет правильный формат JWT (3 части, разделенные точками)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        console.log("Invalid JWT format: token should have 3 parts separated by dots");
        return true;
    }

    try {
        const decodedToken = jwtDecode<{ exp: number }>(token);
        if (!decodedToken || !decodedToken.exp) {
            console.log("Invalid token format or missing expiration");
            return true;
        }

        const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const isExpired = currentTime >= expirationTime;

        if (isExpired) {
            console.log("Token is expired");
            // Не удаляем токен здесь, так как это может привести к проблемам при обновлении
            // Удаление будет происходить в refreshAccessToken при неудачном обновлении
            return true;
        }

        console.log("Token is valid");
        return false;
    } catch (error) {
        console.error('Error checking token expiration: ', error);
        return true; // Считаем токен истекшим в случае ошибки
    }
}

export const saveAccessToken = async (token: string) => {
    console.log(token)

    try {
        if (!token) {
            console.error("Попытка сохранить пустой access token");
            return;
        }

        // Проверяем формат токена перед сохранением
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.error("Неверный формат access token при сохранении:", token.substring(0, 20) + "...");
            // Не сохраняем токен с неверным форматом
            console.log("Токен с неверным форматом не будет сохранен");
            return;
        } else {
            console.log("Сохраняем access token с корректным JWT форматом");
        }

        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
        console.log("Access token сохранен успешно");
    } catch (e) {
        console.error("Ошибка при сохранении access token: ", e);
    }
}

export const saveRefreshToken = async (token: string) => {
    console.log(token)

    try {
        if (!token) {
            console.error("Попытка сохранить пустой refresh token");
            return;
        }

        // Supabase refresh token может иметь формат, отличный от JWT (три части, разделенные точками)
        // Поэтому мы не проверяем его формат, а просто сохраняем
        console.log("Сохраняем refresh token");

        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
        console.log("Refresh token сохранен успешно");
    } catch (e) {
        console.error("Ошибка при сохранении refresh token: ", e);
    }
}


export const getAccessToken = async () => {
    try {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        console.log(token)

        console.log("Access token received");

        if (!token) {
            console.log("No access token found");
            return null;
        }

        // Сначала проверяем формат токена
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.log("Invalid JWT format: token should have 3 parts separated by dots");
            console.log("Access token expired or invalid, trying to refresh");
            // Удаляем неправильный токен и пробуем обновить
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            const newToken = await refreshAccessToken();
            if (newToken) {
                return newToken;
            }
            console.log("No valid access token available");
            return null;
        }

        // Проверяем валидность токена только если формат правильный
        const isExpired = await isTokenExpired(token);
        if (!isExpired) {
            console.log("Access token is valid");
            return token;
        } else {
            console.log("Access token expired or invalid, trying to refresh");
            // Токен истек или невалиден, пробуем обновить
            const newToken = await refreshAccessToken();
            if (newToken) {
                return newToken;
            }
        }

        console.log("No valid access token available");
        return null;
    } catch (e) {
        console.error("Error getting access token: ", e);
        return null;
    }
}

export const getRefreshToken = async () => {
    try {
        const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        console.log(token)

        console.log("Refresh token received");

        if (!token) {
            console.log("No refresh token found");
            return null;
        }

        // Supabase refresh token может иметь формат, отличный от JWT
        // Поэтому мы не проверяем его формат, а просто возвращаем
        console.log("Refresh token found");
        return token;
        
    } catch (e) {
        console.error("Error getting refresh token: ", e);
        return null;
    }
}


export const refreshAccessToken = async () => {
    try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        console.log(refreshToken)

        if (!refreshToken) {
            console.log("No refresh token found");
            return null;
        }

        // Supabase refresh token может иметь формат, отличный от JWT
        // Поэтому мы не проверяем его формат, а просто используем

        console.log("Attempting to refresh access token...");

        // Используем Supabase для обновления токена
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error) {
            console.error("Error refreshing token with Supabase:", error.message);
            // Удаляем токены, так как они недействительны
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            return null;
        }

        if (data.session && data.session.access_token && data.session.refresh_token) {
            // Сохраняем новые токены
            await saveAccessToken(data.session.access_token);
            await saveRefreshToken(data.session.refresh_token);
            console.log("Access token refreshed successfully");
            return data.session.access_token;
        } else {
            console.error("Invalid session data received from Supabase");
            return null;
        }
    } catch (e) {
        console.error("Error refreshing access token: ", e);
        // В случае ошибки также удаляем токены
        try {
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        } catch (deleteError) {
            console.error("Error deleting tokens: ", deleteError);
        }
        return null;
    }
}