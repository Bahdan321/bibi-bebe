import { View, Text } from 'react-native'
import React, { useCallback } from 'react'

const useMemeAlert = () => {
    const memes = [
        require('@/assets/images/memes/cat1.jpg'),
        require('@/assets/images/memes/cat2.jpg'),
        require('@/assets/images/memes/cat3.jpg'),
    ];

    const getRandomMeme = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * memes.length);
        return memes[randomIndex];
    }, []);
    return getRandomMeme;

    return (
        <View>
            <Text>useMemeAlert</Text>
        </View>
    )
}

export default useMemeAlert