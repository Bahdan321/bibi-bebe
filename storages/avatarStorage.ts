import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_INDEX_KEY = 'user_avatar_index';

/**
 * Сохраняет индекс аватарки пользователя в AsyncStorage
 * @param index - индекс мема для аватарки
 */
export async function saveAvatarIndex(index: number): Promise<void> {
    try {
        console.log('💾 avatarStorage: Сохраняем индекс в AsyncStorage:', index);
        await AsyncStorage.setItem(AVATAR_INDEX_KEY, index.toString());
        console.log('💾 avatarStorage: Индекс успешно сохранен');
    } catch (error) {
        console.error('Ошибка при сохранении индекса аватарки:', error);
    }
}

/**
 * Получает сохраненный индекс аватарки из AsyncStorage
 * @returns индекс аватарки или null, если не найден
 */
export async function getAvatarIndex(): Promise<number | null> {
    try {
        console.log('📖 avatarStorage: Читаем индекс из AsyncStorage');
        const indexString = await AsyncStorage.getItem(AVATAR_INDEX_KEY);
        console.log('📖 avatarStorage: Получили строку из AsyncStorage:', indexString);
        
        if (indexString !== null) {
            const index = parseInt(indexString, 10);
            const result = isNaN(index) ? null : index;
            console.log('📖 avatarStorage: Парсим индекс:', index, 'результат:', result);
            return result;
        }
        console.log('📖 avatarStorage: Индекс не найден, возвращаем null');
        return null;
    } catch (error) {
        console.error('Ошибка при получении индекса аватарки:', error);
        return null;
    }
}

/**
 * Удаляет сохраненный индекс аватарки из AsyncStorage
 */
export async function removeAvatarIndex(): Promise<void> {
    try {
        await AsyncStorage.removeItem(AVATAR_INDEX_KEY);
    } catch (error) {
        console.error('Ошибка при удалении индекса аватарки:', error);
    }
}