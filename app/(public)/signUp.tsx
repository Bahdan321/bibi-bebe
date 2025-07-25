import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

import TextInputField from '@/components/TextInputField';

import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import CustomText from '@/components/base/CustomText';
import CustomButton from '@/components/base/CustomButton';
import CustomTouchable from '@/components/base/CustomTouchable';

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

    // Валидация имени
    const validateName = (name: string) => {
        if (!name) {
            setNameError('Пожалуйста, введите имя');
            return false;
        } else if (name.length < 2) {
            setNameError('Имя должно содержать минимум 2 символа');
            return false;
        }
        setNameError('');
        return true;
    };

    // Валидация email
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Пожалуйста, введите email');
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError('Пожалуйста, введите корректный email');
            return false;
        }
        setEmailError('');
        return true;
    };

    // Валидация пароля
    const validatePassword = (password: string) => {
        if (!password) {
            setPasswordError('Пожалуйста, введите пароль');
            return false;
        } else if (password.length < 6) {
            setPasswordError('Пароль должен содержать минимум 6 символов');
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
                setGeneralError(result.error || 'Неверное имя пользователя или пароль');
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setGeneralError('Произошла ошибка при регистрации');
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
                setGeneralError(result.error || 'Ошибка регистрации через Google');
            }
        } catch (error) {
            console.error('Error signing up with Google:', error);
            setGeneralError('Произошла ошибка при регистрации через Google');
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
        
        setGeneralError('Регистрация через Apple пока не реализована');
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <CustomTouchable onPress={() => router.push('/(public)/signIn')}>
                    <CustomText
                        content="Sign in"
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
                <CustomText
                    content="Sign up"
                    size="md"
                    color="#FFFFFF"
                    weight="medium"
                />
            </View>
            
            {generalError ? (
                <View style={styles.generalErrorContainer}>
                    <CustomText content={generalError} size="sm" color="#FF3B30" />
                </View>
            ) : null}
            
            <TextInputField
                label="Name"
                labelColor="#B0B0B0"
                borderColor="#4A4A4A"
                textColor="#FFFFFF"
                value={name}
                onChangeText={setName}
                style={styles.input}
                error={nameError}
                onBlur={() => validateName(name)}
            />
            <TextInputField
                label="Email"
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
                    label="Password"
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
            {isLoading ? (
                <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
            ) : (
                <>
                    <CustomButton
                        variant="primary"
                        size="medium"
                        title="Зарегистрироваться"
                        titleColor="#1C2526"
                        onPress={handleSignUp}
                        style={{ ...styles.button, backgroundColor: '#FFFFFF' }}
                    />
                    <CustomText
                        content="или"
                        size="md"
                        color="#FFFFFF"
                        style={styles.orTextContainer}
                        textCenter
                    />
                    <CustomButton
                        variant="service"
                        size="medium"
                        title="Google"
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
                            title="Apple"
                            onPress={handleAppleSignUp}
                            style={{ ...styles.socialButton, backgroundColor: '#000000' }}
                            icon="logo-apple"
                            iconColor="#FFFFFF"
                            titleColor="#FFFFFF"
                        />
                    )}
                </>
            )}
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