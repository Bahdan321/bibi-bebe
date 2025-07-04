import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import SettingsRow from '@/components/SettingsRow'
import { Ionicons } from '@expo/vector-icons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Gigabar from '@/components/Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import { BlurView } from 'expo-blur';

export default function Settings() {

    const { toggleTheme, theme } = useTheme();

    const settingsItems = [
        {
            label: "Язык",
            value: (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: theme.colors.text, marginRight: 5, fontSize: hp('2.2'), fontWeight: 'bold' }}>
                        Русский
                    </Text>
                </View>
            ),
            leftIcon: <Ionicons name="earth" size={hp("2.8")} color={theme.colors.button} />,
            onPress: () => console.log('Language'),
        },
        {
            label: "Тема",
            value: (
                <Text style={{ color: theme.colors.text, marginRight: 5, fontSize: hp('2.2'), fontWeight: 'bold' }}>
                    Темная
                </Text>
            ),
            leftIcon: <Ionicons name="sunny-outline" size={hp("2.8")} color={theme.colors.button} />,
            onPress: toggleTheme,
        },
        {
            label: "Тема",
            value: (
                <Text style={{ color: theme.colors.text, marginRight: 5, fontSize: hp('2.2'), fontWeight: 'bold' }}>
                    Темная
                </Text>
            ),
            leftIcon: <Ionicons name="sunny-outline" size={hp("2.8")} color={theme.colors.button} />,
            onPress: toggleTheme,
        },
        {},

    ];

    return (
        <ImageBackground
            source={require('../../assets/images/gradients/VioletGradient.png')}
            // source={require('../../assets/images/gradients/BlueSkyGradient.png')}
            // source={require('../../assets/images/gradients/BlueSkyGradient2.png')}
            // source={require('../../assets/images/gradients/GreenYellowGradient.png')}
            // source={require('../../assets/images/gradients/OrangeBlueGradient.png')}
            // source={require('../../assets/images/gradients/OrangeBlueGradient2.png')}
            // source={require('../../assets/images/gradients/OrangeRedGradient.png')}
            // source={require('../../assets/images/gradients/PinkOrangeGradient.png')}
            // source={require('../../assets/images/gradients/PinkVioletGradient.png')}

            style={{ flex: 1, backgroundColor: theme.colors.settingsBackground }}
            resizeMode="cover"
        >
            <View style={{ margin: hp("3") }}>
                {settingsItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <SettingsRow
                            label={item.label}
                            value={item.value}
                            leftIcon={item.leftIcon}
                            onPress={item.onPress}
                        />
                        {index < settingsItems.length - 1 && (
                            <View style={{ marginVertical: hp("2.2") }}>
                                <Gigabar color="gray" size={4} />
                            </View>
                        )}
                    </React.Fragment>
                ))}
            </View>
        </ImageBackground >
    );
};
