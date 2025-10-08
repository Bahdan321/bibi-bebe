import { useCallback, useEffect, useState } from 'react'
import { saveAvatarIndex, getAvatarIndex } from '@/storages/avatarStorage'

const memes = [
    require('@/assets/images/memes/meme1.jpg'),
    require('@/assets/images/memes/meme2.jpg'),
    require('@/assets/images/memes/meme3.jpg'),
    require('@/assets/images/memes/meme4.jpg'),
    require('@/assets/images/memes/meme5.jpg'),
    require('@/assets/images/memes/meme6.jpg'),
    require('@/assets/images/memes/meme7.jpg'),
    require('@/assets/images/memes/meme8.jpg'),
    require('@/assets/images/memes/meme9.jpg'),
    require('@/assets/images/memes/meme10.jpg'),
    require('@/assets/images/memes/meme11.jpg'),
    require('@/assets/images/memes/meme12.jpg'),
    require('@/assets/images/memes/meme13.jpg'),
    require('@/assets/images/memes/meme14.jpg'),
    require('@/assets/images/memes/meme15.jpg'),
    require('@/assets/images/memes/meme16.jpg'),
    require('@/assets/images/memes/meme17.jpg'),
    require('@/assets/images/memes/meme18.jpg'),
    require('@/assets/images/memes/meme19.jpg'),
    require('@/assets/images/memes/meme20.jpg'),
    require('@/assets/images/memes/meme21.jpg'),
    require('@/assets/images/memes/meme22.jpg'),
    require('@/assets/images/memes/meme23.jpg'),
    require('@/assets/images/memes/meme24.jpg'),
    require('@/assets/images/memes/meme25.jpg'),
    require('@/assets/images/memes/meme26.jpg'),
    require('@/assets/images/memes/meme27.jpg'),
    require('@/assets/images/memes/meme28.jpg'),
    require('@/assets/images/memes/meme29.jpg'),
    require('@/assets/images/memes/meme30.jpg'),
    require('@/assets/images/memes/meme31.jpg'),
    require('@/assets/images/memes/meme32.jpg'),
    require('@/assets/images/memes/meme33.jpg'),
    require('@/assets/images/memes/meme34.jpg'),
    require('@/assets/images/memes/meme35.jpg'),
    require('@/assets/images/memes/meme36.jpg'),
    require('@/assets/images/memes/meme37.jpg'),
    require('@/assets/images/memes/meme38.jpg'),
];

/**
 * Хук для получения случайного мема в качестве аватарки пользователя
 * Возвращает функцию, которая генерирует случайный индекс мема и сохраняет его в AsyncStorage
 */
const useRandomMemeAvatar = () => {
    const [savedAvatarIndex, setSavedAvatarIndex] = useState<number | null>(null);

    // Загружаем сохраненный индекс аватарки при инициализации
    useEffect(() => {
        const loadSavedAvatarIndex = async () => {
            console.log('🔧 useRandomMemeAvatar: Загружаем индекс из AsyncStorage');
            const index = await getAvatarIndex();
            console.log('🔧 useRandomMemeAvatar: Загруженный индекс:', index);
            setSavedAvatarIndex(index);
        };
        loadSavedAvatarIndex();
    }, []);

    // Функция для получения случайного мема
    const getRandomMeme = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * memes.length);
        return memes[randomIndex];
    }, []);

    // Функция для получения случайного индекса мема (для сохранения в БД)
    const getRandomMemeIndex = useCallback(() => {
        return Math.floor(Math.random() * memes.length);
    }, []);

    // Функция для получения случайного индекса мема с сохранением в AsyncStorage
    const getRandomMemeIndexWithSave = useCallback(async () => {
        console.log('🔧 getRandomMemeIndexWithSave: Начинаем проверку');
        
        // Проверяем, есть ли уже сохраненный индекс в AsyncStorage
        const existingSavedIndex = await getAvatarIndex();
        console.log('🔧 getRandomMemeIndexWithSave: Существующий индекс:', existingSavedIndex);
        
        if (existingSavedIndex !== null) {
            console.log('🔧 getRandomMemeIndexWithSave: Возвращаем существующий индекс:', existingSavedIndex);
            setSavedAvatarIndex(existingSavedIndex);
            return existingSavedIndex;
        }

        // Генерируем новый случайный индекс
        const randomIndex = Math.floor(Math.random() * memes.length);
        console.log('🔧 getRandomMemeIndexWithSave: Генерируем новый индекс:', randomIndex);
        
        // Сохраняем в AsyncStorage
        await saveAvatarIndex(randomIndex);
        console.log('🔧 getRandomMemeIndexWithSave: Сохранили в AsyncStorage:', randomIndex);
        setSavedAvatarIndex(randomIndex);
        
        return randomIndex;
    }, []);

    // Функция для получения мема по индексу
    const getMemeByIndex = useCallback((index: number) => {
        if (index >= 0 && index < memes.length) {
            return memes[index];
        }
        // Если индекс некорректный, возвращаем первый мем
        return memes[0];
    }, []);

    // Функция для получения текущего сохраненного индекса напрямую из AsyncStorage
    const getSavedAvatarIndex = useCallback(async () => {
        return await getAvatarIndex();
    }, []);

    return {
        getRandomMeme,
        getRandomMemeIndex,
        getRandomMemeIndexWithSave,
        getMemeByIndex,
        getSavedAvatarIndex,
        totalMemes: memes.length
    };
};

export default useRandomMemeAvatar;