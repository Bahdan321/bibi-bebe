import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const isTokenExpired = async (token: string) => {
    if (!token) return true;
    try {
        console.log("Decoding token...")
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.log(decoded.exp);
            console.log(currentTime);
            console.log("Token expired")
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
            return true
        } else {
            console.log("Token is valid")
            return false;
        }
    } catch (error) {
        console.error('Error decoding token', error);
        return true;
    }
}

export const saveAccessToken = async (token: string) => {
    try {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
        console.log("Token saved successfully");
    } catch (e) {
        console.log("Error saving token: ", e);
    }
}

export const saveRefreshToken = async (token: string) => {
    try {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
        console.log("Refresh token saved successfully");
    } catch (e) {
        console.log("Error saving token: ", e);
    }
}


export const getAccessToken = async () => {
    try {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        console.log("Token received successfully");
        if (token && await isTokenExpired(token) == false) {
            return token;
        } else {
            return null;
        }
    } catch (e) {
        console.log("Error access getting token: ", e);
        return null;
    }
}

export const getRefreshToken = async () => {
    try {
        const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        console.log("Refresh token received successfully");
        if (token && await isTokenExpired(token) == false) {
            return token;
        }
        // else {
        //     const { signOut } = useSupabase();
        //     await signOut;
        // }
    } catch (e) {
        console.log("Error getting refresh token: ", e);
        return null;
    }
}


export const refreshAccessToken = async () => {
    try {
        // const apiUrl = await getApiUrl();
        const apiUrl = "https://localhost:8000";
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
            console.log("No refresh token found");
            return null;
        }
        // console.log(`refresh token: ${refreshToken}`);

        const response = await fetch(`${apiUrl}/jwt/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data.access_token) {
                await saveAccessToken(data.access_token);
                // console.log(`access token: ${data.access_token}`);
                return data.access_token;
            }
        } else {
            const data = await response.json();
            console.log("Failed to refresh token");
            console.log(data)
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
            return null;
        }
    } catch (error) {
        console.error('Error refreshing access token', error);
        return null;
    }
};