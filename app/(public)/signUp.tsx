import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

import TextInputField from '@/components/TextInputField';

import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import CustomText from '@/components/base/CustomText';
import CustomButton from '@/components/base/CustomButton';
import CustomTouchable from '@/components/base/CustomTouchable';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay, withSequence } from 'react-native-reanimated';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const router = useRouter();
    const { signUp, signInWithGoogle } = useAuth();
    const { t } = useTranslation();

    // SignUp text and fields
    const translateY = useSharedValue(50);
    const nameFieldOpacity = useSharedValue(0);
    const nameFieldTranslateY = useSharedValue(-30);
    const emailPasswordTranslateY = useSharedValue(0);
    const buttonsTranslateY = useSharedValue(0);

    // Buttons
    const scale = useSharedValue(1);

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    useEffect(() => {
        // Анимация заголовка
        translateY.value = withSpring(0, {
            damping: 10,
            stiffness: 100,
        });

        // Анимация появления поля имени с задержкой
        nameFieldOpacity.value = withDelay(300, withSpring(15, {
            damping: 15,
            stiffness: 120,
        }));
        nameFieldTranslateY.value = withDelay(300, withSpring(15, {
            damping: 15,
            stiffness: 120,
        }));

        // Сдвиг полей email и password вниз
        emailPasswordTranslateY.value = withDelay(200, withSpring(15, {
            damping: 12,
            stiffness: 100,
        }));

        // Сдвиг кнопок и остальных элементов вниз
        buttonsTranslateY.value = withDelay(250, withSpring(15, {
            damping: 12,
            stiffness: 100,
        }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const nameFieldAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: nameFieldOpacity.value,
            transform: [{ translateY: nameFieldTranslateY.value }],
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

    // Валидация имени
    const validateName = (name: string) => {
        if (!name) {
            setNameError(t('auth.validation.nameRequired'));
            return false;
        } else if (name.length < 2) {
            setNameError(t('auth.validation.nameMinLength'));
            return false;
        }
        setNameError('');
        return true;
    };

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
        if (name) setNameError('');
        if (email) setEmailError('');
        if (password) setPasswordError('');
        if (nameError || emailError || passwordError) setGeneralError('');
    }, [name, email, password]);

    const handleSignUp = async () => {
        scale.value = withSequence(
            withSpring(1.09, { damping: 50, stiffness: 1000 }), // Увеличение
            withSpring(1, { damping: 30, stiffness: 100 }) // Возврат к исходному размеру
        );
        // Сбросить общую ошибку
        setGeneralError('');

        // Валидация полей
        const isNameValid = validateName(name);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isNameValid || !isEmailValid || !isPasswordValid) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await signUp(name, email, password);
            if (result.success) {
                if (result.requiresConfirmation) {
                    // Перенаправляем на страницу OTP вместо показа формы в этом компоненте
                    router.push({
                        pathname: '/(public)/otpVerification',
                        params: { email }
                    });
                } else {
                    router.replace('/(private)/onboardingScreen');
                }
            } else {
                setGeneralError(result.error || t('auth.errors.signUpError'));
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setGeneralError(t('auth.errors.signUpError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        // Сбросить все ошибки перед попыткой входа через Google
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        setIsLoading(true);
        try {
            const result = await signInWithGoogle();
            if (result.success) {
                router.replace('/(private)/onboardingScreen');
            } else {
                setGeneralError(result.error || t('auth.errors.googleAuthError'));
            }
        } catch (error) {
            console.error('Error signing up with Google:', error);
            setGeneralError(t('auth.errors.googleSignUpError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAppleSignUp = () => {
        // Сбросить все ошибки
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        setGeneralError(t('auth.errors.appleSignUpNotImplemented'));
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <CustomTouchable onPress={() => router.push('/(public)/signIn')}>
                    <CustomText
                        translationKey="auth.signInTab"
                        size="md"
                        color="#8A8A8A"
                        weight="medium"
                    />
                </CustomTouchable>
                <CustomText
                    content="◆"
                    size="md"
                    color="#FFFFFF"
                    style={styles.tabSeparatorContainer}
                />
                <Animated.View style={animatedStyle}>
                    <CustomText
                        translationKey="auth.signUpTab"
                        size="md"
                        color="#FFFFFF"
                        weight="medium"
                    />
                </Animated.View>
            </View>

            {generalError ? (
                <View style={styles.generalErrorContainer}>
                    <CustomText content={generalError} size="sm" color="#FF3B30" />
                </View>
            ) : null}

            <Animated.View style={nameFieldAnimatedStyle}>
                <TextInputField
                    label={t('auth.name')}
                    labelColor="#B0B0B0"
                    borderColor="#4A4A4A"
                    textColor="#FFFFFF"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    error={nameError}
                    onBlur={() => validateName(name)}
                />
            </Animated.View>

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
                                title={t('auth.signUp')}
                                titleColor="#1C2526"
                                onPress={handleSignUp}
                                style={{ ...styles.button, backgroundColor: '#FFFFFF' }}
                            />
                        </Animated.View>
                        <CustomText
                            translationKey="common.or"
                            size="md"
                            color="#FFFFFF"
                            style={styles.orTextContainer}
                            textCenter
                        />
                        <CustomButton
                            variant="service"
                            size="medium"
                            title={t('auth.google')}
                            onPress={handleGoogleSignUp}
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
                                onPress={handleAppleSignUp}
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
});