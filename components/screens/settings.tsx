import { View, ImageBackground, Animated, Switch, Linking } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import SettingsRow from '@/components/SettingsRow'
import { Ionicons } from '@expo/vector-icons';
import {
} from 'react-native-responsive-screen';
import Gigabar from '@/components/Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import { useLocalization } from '@/providers/LocalizationProvider';
import { useTranslation } from 'react-i18next';
import CustomText from '@/components/base/CustomText';
import { useScreenFrame } from '@/components/base/ScreenFrame';
import { getFrameEnabled, saveFrameEnabled } from '@/storages/frameStorage';
import SocialLinks from '@/components/SocialLinks';

export default function Settings() {
    const { toggleTheme, theme, isDark } = useTheme();
    const { currentLanguage, changeLanguage } = useLocalization();
    const { t } = useTranslation();
    const frame = useScreenFrame();
    const [isFrameEnabled, setIsFrameEnabled] = useState(true);
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const languageRotateAnim = useRef(new Animated.Value(0)).current;

    // Animation effect when theme changes
    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: isDark ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isDark, rotateAnim]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const languageSpin = languageRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    // Language switching handler with animation
    const handleLanguageChange = async () => {
        // Start rotation animation
        Animated.timing(languageRotateAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            // Reset animation after completion
            languageRotateAnim.setValue(0);
        });

        // Switch between languages
        const newLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
        await changeLanguage(newLanguage);
    };

    const handleFrameToggle = () => {
        const next = !isFrameEnabled;
        setIsFrameEnabled(next);
        frame.enable(next, true, { duration: 250 });
        saveFrameEnabled(next);
    };

    const handleContactPress = async () => {
        const email = 'bibibebeofficial@gmail.com';
        const subject = encodeURIComponent('Bibibebe feedback');
        const mailto = `mailto:${email}?subject=${subject}`;
        try {
            const supported = await Linking.canOpenURL(mailto);
            if (supported) await Linking.openURL(mailto);
        } catch { }
    };

    // Get language display name
    const getLanguageDisplayName = () => {
        return currentLanguage === 'ru' ? t('settings.languageRussian') : t('settings.languageEnglish');
    };

    const settingsItems = [
        {
            label: t('settings.language'),
            value: (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CustomText
                        content={getLanguageDisplayName()}
                        size="sm"
                        color={theme.colors.text}
                        weight="bold"
                        style={{ marginRight: 5 }}
                    />
                </View>
            ),
            leftIcon: (
                <Animated.View style={{ transform: [{ rotate: languageSpin }] }}>
                    <Ionicons name="earth" size={22} color={theme.colors.button} />
                </Animated.View>
            ),
            onPress: handleLanguageChange,
        },
        {
            label: t('settings.theme'),
            value: (
                <CustomText
                    content={isDark ? t('settings.themeDark') : t('settings.themeLight')}
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
        {
            label: t('settings.frame'),
            value: (
                <Switch
                    value={isFrameEnabled}
                    onValueChange={(v) => {
                        setIsFrameEnabled(v);
                        frame.enable(v, true, { duration: 250 });
                        saveFrameEnabled(v);
                    }}
                    trackColor={{ false: theme.colors.background, true: theme.colors.button }}
                    thumbColor={isFrameEnabled ? theme.colors.primary : theme.colors.secondary}
                />
            ),
            leftIcon: (
                <Ionicons name="crop" size={22} color={theme.colors.button} />
            ),
            onPress: handleFrameToggle,
        },
        {
            label: t('settings.contact'),
            value: (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CustomText
                        content={''}
                        size="sm"
                        color={theme.colors.text}
                        weight="bold"
                        style={{ marginRight: 5 }}
                    />
                </View>
            ),
            leftIcon: (
                <Ionicons name="mail-outline" size={22} color={theme.colors.button} />
            ),
            onPress: handleContactPress,
        },
        {
            label: t('settings.social'),
            value: (
                <SocialLinks />
            ),
            leftIcon: (
                <Ionicons name="share-social-outline" size={22} color={theme.colors.button} />
            ),
            onPress: () => { },
        },
        {},
    ];

    useEffect(() => {
        (async () => {
            const stored = await getFrameEnabled();
            if (stored !== null) {
                setIsFrameEnabled(stored);
                frame.enable(stored, false);
            }
        })();
    }, [frame]);

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
