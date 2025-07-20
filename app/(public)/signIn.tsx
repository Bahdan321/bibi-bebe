import { View, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import React, { useState } from 'react';

import TextInputField from '@/components/TextInputField';

import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton, CustomTouchable } from '@/components/base';
import CustomText from '@/components/base/CustomText';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { signIn, signInWithGoogle } = useAuth();

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signIn(email, password);
            if (result.success) {
                router.replace('/(private)/home');
            } else {
                Alert.alert('Ошибка входа', result.error || 'Неверный email или пароль');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            Alert.alert('Ошибка', 'Произошла ошибка при входе в аккаунт');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithGoogle();
            if (result.success) {
                router.replace('/(private)/home');
            } else {
                Alert.alert('Ошибка', result.error || 'Ошибка авторизации через Google');
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);
            Alert.alert('Ошибка', 'Произошла ошибка при авторизации через Google');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAppleSignIn = () => {
        Alert.alert('Внимание', 'Авторизация через Apple пока не реализована');
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <CustomText content="Sign in" size="md" color="#FFFFFF" weight="medium" />
                <CustomText content="◆" size="md" color="#FFFFFF" style={styles.tabSeparatorContainer} />
                <CustomTouchable onPress={() => router.push('/(public)/signUp')}>
                    <CustomText content="Sign up" size="md" color="#8A8A8A" weight="medium" />
                </CustomTouchable>
            </View>
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
                        title="Войти"
                        titleColor="#1C2526"
                        onPress={handleSignIn}
                        style={{ ...styles.button, backgroundColor: '#FFFFFF' }}
                    />
                    <CustomText content="или" color="#FFFFFF" style={styles.orTextContainer} textCenter={true} />
                    <CustomButton
                        variant="service"
                        size="medium"
                        title="Google"
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
                            title="Apple"
                            onPress={handleAppleSignIn}
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