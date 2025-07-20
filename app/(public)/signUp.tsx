import { View, StyleSheet, ActivityIndicator, Alert, Platform, TextInput } from 'react-native';
import React, { useState } from 'react';

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
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otp, setOtp] = useState('');
    const router = useRouter();
    const { signUp, signInWithGoogle, verifySignupOtp, resendSignupOtp } = useAuth();

    const handleSignUp = async () => {
        if (!email || !password || !name) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }
        setIsLoading(true);
        try {
            const result = await signUp(name, email, password);
            if (result.success) {
                if (result.requiresConfirmation) {
                    setShowOtpForm(true);
                } else {
                    router.replace('/(private)/onboardingScreen');
                }
            } else {
                Alert.alert('Ошибка регистрации', result.error || 'Неверное имя пользователя или пароль');
            }
        } catch (error) {
            console.error('Error signing up:', error);
            Alert.alert('Ошибка', 'Произошла ошибка при регистрации');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithGoogle();
            if (result.success) {
                router.replace('/(private)/onboardingScreen');
            } else {
                Alert.alert('Ошибка', result.error || 'Ошибка регистрации через Google');
            }
        } catch (error) {
            console.error('Error signing up with Google:', error);
            Alert.alert('Ошибка', 'Произошла ошибка при регистрации через Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAppleSignUp = () => {
        Alert

            .alert('Внимание', 'Регистрация через Apple пока не реализована');
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        try {
            const result = await verifySignupOtp(email, otp);
            if (result.success) {
                console.log('OTP верифицирован успешно, перенаправление на домашнюю страницу');
                router.replace('/(private)/home');
            } else {
                Alert.alert('Ошибка', result.error || 'Неверный OTP код');
            }
        } catch (error) {
            console.error('Ошибка при верификации OTP:', error);
            Alert.alert('Ошибка', 'Произошла ошибка при верификации OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            const result = await resendSignupOtp(email);
            if (result.success) {
                Alert.alert('Успех', 'OTP код отправлен повторно');
            } else {
                Alert.alert('Ошибка', result.error || 'Ошибка при повторной отправке OTP');
            }
        } catch (error) {
            Alert.alert('Ошибка', 'Произошла ошибка при повторной отправке OTP');
        } finally {
            setIsLoading(false);
        }
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
            {!showOtpForm ? (
                <>
                    <TextInputField
                        label="Name"
                        labelColor="#B0B0B0"
                        borderColor="#4A4A4A"
                        textColor="#FFFFFF"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                    <TextInputField
                        label="Email"
                        labelColor="#B0B0B0"
                        borderColor="#4A4A4A"
                        textColor="#FFFFFF"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
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
                </>
            ) : (
                <>
                    <TextInputField
                        label="OTP Code"
                        labelColor="#B0B0B0"
                        borderColor="#4A4A4A"
                        textColor="#FFFFFF"
                        value={otp}
                        onChangeText={setOtp}
                        style={styles.input}
                    />
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
                    ) : (
                        <>
                            <CustomButton
                                variant="primary"
                                size="medium"
                                title="Подтвердить OTP"
                                titleColor="#1C2526"
                                onPress={handleVerifyOtp}
                                style={{ ...styles.button, backgroundColor: '#FFFFFF' }}
                            />
                            <CustomButton
                                variant="secondary"
                                size="medium"
                                title="Повторить отправку OTP"
                                onPress={handleResendOtp}
                                style={styles.button}
                            />
                        </>
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