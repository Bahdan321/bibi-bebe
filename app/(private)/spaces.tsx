import { View, Text, ImageBackground } from 'react-native'

import React from 'react'
import { useTheme } from '@/providers/ThemeProvider';

const spaces = () => {
    const { theme } = useTheme();

    return (
        <ImageBackground
            source={require('../../assets/images/gradients/GreenYellowGradient.png')}
            style={{ flex: 1, backgroundColor: theme.colors.settingsBackground }}
            resizeMode="cover"
        >

        </ImageBackground >
    )
}

export default spaces