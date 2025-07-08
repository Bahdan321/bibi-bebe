import { View, StyleSheet, Animated, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/providers/ThemeProvider';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/base/CustomButton';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '@/providers/AuthProvider';
import CustomText from '@/components/CustomText';

const OnboardingScreen = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const menuFadeAnim = useRef(new Animated.Value(0)).current;
    const [showMenu, setShowMenu] = useState(false);
    const [spaceName, setSpaceName] = useState('');
    const { createUserSpace } = useAuth();

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000, // 1 second fade in
            useNativeDriver: true,
        }).start();

        // Set timeout to fade out welcome message and show menu after 3 seconds
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000, // 1 second fade out
                useNativeDriver: true,
            }).start(() => {
                // Show menu after welcome message fades out
                setShowMenu(true);
                Animated.timing(menuFadeAnim, {
                    toValue: 1,
                    duration: 1000, // 1 second fade in for menu
                    useNativeDriver: true,
                }).start();
            });
        }, 3000); // 3 seconds display time

        // Clean up timer on unmount
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async () => {
        console.log('Food preference submitted:', spaceName);
        const result = await createUserSpace(spaceName);

        if (result && result.success) {
            router.replace('/(private)/home');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
                {/* Welcome message with fade animation */}
                <Animated.Text
                    style={[
                        styles.welcomeText,
                        {
                            opacity: fadeAnim,
                            color: theme.colors.text
                        }
                    ]}
                >
                    Приветствуем в Bibibebe
                </Animated.Text>

                {/* Food preference menu with fade animation */}
                {showMenu && (
                    <Animated.View
                        style={[
                            styles.menuContainer,
                            {
                                opacity: menuFadeAnim,
                                backgroundColor: theme.colors.third
                            }
                        ]}
                    >
                        <CustomText
                            content="Какая ваша любимая еда?"
                            size={22}
                            color={theme.colors.text}
                            weight="bold"
                            style={styles.questionTextContainer}
                            textCenter
                        />

                        <TextInput
                            style={[styles.input, {
                                color: theme.colors.text,
                                borderColor: theme.colors.background
                            }]}
                            value={spaceName}
                            onChangeText={setSpaceName}
                            placeholder="Введите вашу любимую еду"
                            placeholderTextColor={theme.colors.background}
                        />

                        <CustomButton
                            variant="primary"
                            size="medium"
                            title="Отправить"
                            titleColor={theme.colors.text}
                            onPress={handleSubmit}
                            style={{...styles.button, backgroundColor: theme.colors.primary}}
                        />
                    </Animated.View>
                )}
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    menuContainer: {
        width: '90%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questionTextContainer: {
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
    },
    button: {
        width: '80%',
        marginTop: 10,
    }
});

export default OnboardingScreen