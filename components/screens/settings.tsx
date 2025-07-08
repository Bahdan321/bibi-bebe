import { View, ImageBackground } from 'react-native'
import React from 'react'
import SettingsRow from '@/components/SettingsRow'
import { Ionicons } from '@expo/vector-icons';
import {
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Gigabar from '@/components/Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import { BlurView } from 'expo-blur';
import CustomText from '@/components/base/CustomText';

export default function Settings() {

    const { toggleTheme, theme } = useTheme();

    const settingsItems = [
        {
            label: "Язык",
            value: (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CustomText
                        content="Русский"
                        size="sm"
                        color={theme.colors.text}
                        weight="bold"
                        style={{ marginRight: 5 }}
                    />
                </View>
            ),
            leftIcon: <Ionicons name="earth" size={22} color={theme.colors.button} />,
            onPress: () => console.log('Language'),
        },
        {
            label: "Тема",
            value: (
                <CustomText
                    content="Темная"
                    size="sm"
                    color={theme.colors.text}
                    weight="bold"
                    style={{ marginRight: 5 }}
                />
            ),
            leftIcon: <Ionicons name="sunny-outline" size={22} color={theme.colors.button} />,
            onPress: toggleTheme,
        },
        {
            label: "Тема",
            value: (
                <CustomText
                    content="Темная"
                    size="sm"
                    color={theme.colors.text}
                    weight="bold"
                    style={{ marginRight: 5 }}
                />
            ),
            leftIcon: <Ionicons name="sunny-outline" size={22} color={theme.colors.button} />,
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

            style={{ flex: 1, minHeight: '100%', backgroundColor: theme.colors.settingsBackground }}
            resizeMode="cover"
        >
            <View style={{ margin: 24 }}>
                {settingsItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.label && (
                            <SettingsRow
                                label={item.label}
                                value={item.value}
                                leftIcon={item.leftIcon}
                                onPress={item.onPress || (() => { })}
                            />
                        )}
                        {index < settingsItems.length - 1 && item.label && (
                            <View style={{ marginVertical: 18 }}>
                                <Gigabar color="gray" size={4} />
                            </View>
                        )}
                    </React.Fragment>
                ))}
            </View>
        </ImageBackground >
    );
};
