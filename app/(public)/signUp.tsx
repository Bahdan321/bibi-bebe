import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import ReverseButton from '@/components/ReverseButton';
import TextInputField from '@/components/TextInputField';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

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

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => router.push('/(public)/signIn')}>
                    <Text style={[styles.tabText, { color: '#8A8A8A' }]}>Login</Text>
                </TouchableOpacity>
                <Text style={styles.tabSeparator}>◆</Text>
                <Text style={[styles.tabText, { color: '#FFFFFF' }]}>Sign up</Text>
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
                    style={[styles.input, { paddingRight: 40 }]} // Отступ для кнопки
                />
                <ReverseButton
                    isVisible={isPasswordVisible}
                    onPress={() => setIsPasswordVisible(prev => !prev)}
                    style={styles.reverseButton}
                />
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
            ) : (
                <Button
                    title="Зарегистрироваться"
                    titleColor="#1C2526"
                    buttonColor="#FFFFFF"
                    onPress={handleSignUp}
                    style={styles.button}
                />
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
    tabText: {
        fontSize: 18,
        fontWeight: '500',
    },
    tabSeparator: {
        color: '#FFFFFF',
        fontSize: 18,
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
        position: 'relative', // Относительное позиционирование
        marginBottom: 15,
    },
    reverseButton: {
        position: 'absolute', // Абсолютное позиционирование
        right: 10, // Отступ справа
        top: '50%', // Центрирование по вертикали
        transform: [{ translateY: -20 }], // Корректировка положения
    },
    button: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    loader: {
        marginVertical: 10,
    },
});