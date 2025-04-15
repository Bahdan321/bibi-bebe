import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL_KEY = 'api_url';

export const saveApiUrl = async (url: string) => {
    try {
        await AsyncStorage.setItem(API_URL_KEY, url);
    } catch (error) {
        console.error('Error saving API URL:', error);
    }
};

export const getApiUrl = async (): Promise<string | null> => {
    try {
        // const url = await AsyncStorage.getItem(API_URL_KEY);
        let url = "http://192.168.3.3:8000";
        return url;
    } catch (error) {
        console.error('Error getting API URL:', error);
        return null;
    }
};
