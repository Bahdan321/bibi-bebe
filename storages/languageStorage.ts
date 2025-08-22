import AsyncStorage from "@react-native-async-storage/async-storage";

export const LANGUAGE_KEY = "language";

export const saveLanguage = async (language: string) => {
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
        console.error("Error saving language:", error);
    }
};

export const getLanguage = async (): Promise<string | null> => {
    try {
        const language = await AsyncStorage.getItem(LANGUAGE_KEY);
        return language;
    } catch (error) {
        console.error("Error getting language:", error);
        return null;
    }
};