import { View, ImageBackground, Animated } from 'react-native'
import React, { useRef, useEffect } from 'react'
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
    const { toggleTheme, theme, isDark } = useTheme();
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Animation effect when theme changes
    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: isDark ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isDark]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

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
                    content={isDark ? "Темная" : "Светлая"}
                    size="sm"
                    color={theme.colors.text}
                    weight="bold"
                    style={{ marginRight: 5 }}
                />
            ),
            leftIcon: (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Ionicons
                        name={isDark ? "moon" : "sunny"}
                        size={22}
                        color={theme.colors.button}
                    />
                </Animated.View>
            ),
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
