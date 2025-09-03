import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

import TextInputField from '@/components/TextInputField';

import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton, CustomTouchable } from '@/components/base';
import CustomText from '@/components/base/CustomText';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay, withSequence } from 'react-native-reanimated';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const router = useRouter();
    const { signIn, signInWithGoogle } = useAuth();
    const { t } = useTranslation();

    const translateY = useSharedValue(50);
    const emailPasswordTranslateY = useSharedValue(15);
    const buttonsTranslateY = useSharedValue(15);

    useEffect(() => {
        translateY.value = withSpring(0, {
            damping: 10,
            stiffness: 100,
        });

        // Обратная анимация: возврат полей email и password на исходные позиции
        emailPasswordTranslateY.value = withDelay(100, withSpring(0, {
            damping: 12,
            stiffness: 100,
        }));

        // Обратная анимация: возврат кнопок на исходные позиции
        buttonsTranslateY.value = withDelay(150, withSpring(0, {
            damping: 12,
            stiffness: 100,
        }));
    }, [])

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    // Buttons
    const scale = useSharedValue(1);

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const emailPasswordAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: emailPasswordTranslateY.value }],
        };
    });

    const buttonsAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: buttonsTranslateY.value }],
        };
    });

    // Валидация email
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError(t('auth.validation.emailRequired'));
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError(t('auth.validation.emailInvalid'));
            return false;
        }
        setEmailError('');
        return true;
    };

    // Валидация пароля
    const validatePassword = (password: string) => {
        if (!password) {
            setPasswordError(t('auth.validation.passwordRequired'));
            return false;
        } else if (password.length < 6) {
            setPasswordError(t('auth.validation.passwordMinLength'));
            return false;
        }
        setPasswordError('');
        return true;
    };

    // Очистка ошибок при изменении полей
    useEffect(() => {
        if (email) setEmailError('');
        if (password) setPasswordError('');
        if (emailError || passwordError) setGeneralError('');
    }, [email, password]);

    const handleSignIn = async () => {
        scale.value = withSequence(
            withSpring(1.09, { damping: 50, stiffness: 1000 }), // Увеличение
            withSpring(1, { damping: 30, stiffness: 100 }) // Возврат к исходному размеру
        );
        // Сбросить общую ошибку
        setGeneralError('');

        // Валидация полей
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn(email, password);
            if (result.success) {
                router.replace('/(private)/home');
            } else {
                setGeneralError(result.error || t('auth.errors.invalidCredentials'));
            }
        } catch (error) {
            console.error('Error signing in:', error);
            setGeneralError(t('auth.errors.signInError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        // Сбросить все ошибки перед попыткой входа через Google
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        setIsLoading(true);
        try {
            const result = await signInWithGoogle();
            if (result.success) {
                if (result.newUser) {
                    router.replace('/(private)/onboardingScreen');
                } else {
                    router.replace('/(private)/home');
                }
            } else {
                setGeneralError(result.error || t('auth.errors.googleAuthError'));
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);
            setGeneralError(t('auth.errors.googleSignInError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAppleSignIn = () => {
        // Сбросить все ошибки
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        setGeneralError(t('auth.errors.appleNotImplemented'));
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <Animated.View style={animatedStyle}>
                    <CustomText translationKey="auth.signInTab" size="md" color="#FFFFFF" weight="medium" />
                </Animated.View>
                <CustomText content="◆" size="md" color="#FFFFFF" style={styles.tabSeparatorContainer} />
                <CustomTouchable onPress={() => router.push('/(public)/signUp')}>
                    <CustomText translationKey="auth.signUpTab" size="md" color="#8A8A8A" weight="medium" />
                </CustomTouchable>
            </View>
            {generalError ? (
                <View style={styles.generalErrorContainer}>
                    <CustomText content={generalError} size="sm" color="#FF3B30" />
                </View>
            ) : null}

            <Animated.View style={emailPasswordAnimatedStyle}>
                <TextInputField
                    label={t('auth.email')}
                    labelColor="#B0B0B0"
                    borderColor="#4A4A4A"
                    textColor="#FFFFFF"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    error={emailError}
                    onBlur={() => validateEmail(email)}
                />
                <View style={styles.passwordContainer}>
                    <TextInputField
                        label={t('auth.password')}
                        labelColor="#B0B0B0"
                        borderColor="#4A4A4A"
                        textColor="#FFFFFF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordVisible}
                        style={[styles.input, { paddingRight: 40 }]}
                        error={passwordError}
                        onBlur={() => validatePassword(password)}
                    />
                    <CustomButton
                        variant="reverse"
                        size="small"
                        isVisible={isPasswordVisible}
                        onPress={() => setIsPasswordVisible(prev => !prev)}
                        style={styles.reverseButton}
                    />
                </View>
            </Animated.View>
            <Animated.View style={buttonsAnimatedStyle}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
                ) : (
                    <>
                        <Animated.View style={[buttonAnimatedStyle]}>
                            <CustomButton
                                variant="primary"
                                size="medium"
                                title={t('auth.signIn')}
                                titleColor="#1C2526"
                                onPress={handleSignIn}
                                style={{ ...styles.button, backgroundColor: '#FFFFFF' }}
                            />
                        </Animated.View>
                        <CustomText translationKey="common.or" color="#FFFFFF" style={styles.orTextContainer} textCenter={true} />
                        <CustomButton
                            variant="service"
                            size="medium"
                            title={t('auth.google')}
                            onPress={handleGoogleSignIn}
                            style={{ ...styles.socialButton, backgroundColor: '#4285F4' }}
                            icon="logo-google"
                            iconColor="#FFFFFF"
                            titleColor="#FFFFFF"
                        />
                        {Platform.OS === 'ios' && (
                            <CustomButton
                                variant="service"
                                size="medium"
                                title={t('auth.apple')}
                                onPress={handleAppleSignIn}
                                style={{ ...styles.socialButton, backgroundColor: '#000000' }}
                                icon="logo-apple"
                                iconColor="#FFFFFF"
                                titleColor="#FFFFFF"
                            />
                        )}
                    </>
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#1C2526',
    },
    generalErrorContainer: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    tabSeparatorContainer: {
        marginHorizontal: 10,
    },
    input: {
        backgroundColor: '#2A2A2A',
        borderColor: '#4A4A4A',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        color: '#FFFFFF',
        marginBottom: 15,
    },
    passwordContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    reverseButton: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -20 }],
    },
    button: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    socialButton: {
        marginBottom: 14,
        alignSelf: 'center',
        width: '70%',
    },
    orTextContainer: {
        textAlign: 'center',
        marginVertical: 14,
    },
    loader: {
        marginVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
});