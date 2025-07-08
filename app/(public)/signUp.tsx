import { View, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
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
    const router = useRouter();
    const { signUp } = useAuth();

    const handleSignUp = async () => {
        if (!email || !password || !name) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }

        setIsLoading(true);
        try {
            const result = await signUp(name, email, password);
            if (result.success) {
                router.replace('/(private)/onboardingScreen');
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

    const handleGoogleSignUp = () => {
        Alert.alert('Внимание', 'Регистрация через Google пока не реализована');
    };

    const handleAppleSignUp = () => {
        Alert

            .alert('Внимание', 'Регистрация через Apple пока не реализована');
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <CustomTouchable onPress={() => router.push('/(public)/signIn')}>
                    <CustomText
                        content="Login"
                        size={18}
                        color="#8A8A8A"
                        weight="500"
                    />
                </CustomTouchable>
                <CustomText
                    content="◆"
                    size={18}
                    color="#FFFFFF"
                    style={styles.tabSeparatorContainer}
                />
                <CustomText
                    content="Sign up"
                    size={18}
                    color="#FFFFFF"
                    weight="500"
                />
            </View>
            {/* <TextInputField
                label="Name"
                labelColor="#B0B0B0"
                borderColor="#4A4A4A"
                textColor="#FFFFFF"
                value={name}
                onChangeText={setName}
                style={styles.input}
            /> */}
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
                        size={16}
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
        marginBottom: 10,
    },
    socialButton: {
        marginBottom: 10,
        alignSelf: 'center',
        width: '70%',
    },
    orTextContainer: {
        marginVertical: 10,
    },
    loader: {
        marginVertical: 10,
    },
});