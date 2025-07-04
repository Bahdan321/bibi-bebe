import { View, Text, ImageBackground } from 'react-native'

import React from 'react'
import { useTheme } from '@/providers/ThemeProvider';

export default function KakoetoMenu() {
    const { theme } = useTheme();

    return (
        <ImageBackground
            // source={require('../../assets/images/gradients/VioletGradient.png')}
            // source={require('../../assets/images/gradients/BlueSkyGradient.png')}
            // source={require('../../assets/images/gradients/BlueSkyGradient2.png')}
            // source={require('../../assets/images/gradients/GreenYellowGradient.png')}
            // source={require('../../assets/images/gradients/OrangeBlueGradient.png')}
            // source={require('../../assets/images/gradients/OrangeBlueGradient2.png')}
            // source={require('../../assets/images/gradients/OrangeRedGradient.png')}
            source={require('../../assets/images/gradients/PinkOrangeGradient.png')}
            // source={require('../../assets/images/gradients/PinkVioletGradient.png')}

            style={{ flex: 1, minHeight: '100%', backgroundColor: theme.colors.settingsBackground }}
            resizeMode="cover"
        >

        </ImageBackground >
    )
}
