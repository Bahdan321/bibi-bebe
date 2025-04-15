import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import ReverseButton from '@/components/ReverseButton';
import TextInputField from '@/components/TextInputField';
import ClickableText from '@/components/СlickableText';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import CustomText from '@/components/CustomText';
import { useAuth } from '@/providers/AuthProvider';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();
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
                router.push('/(private)/home');
            } else {
                Alert.alert('Ошибка регистрации', result.error || 'Неверное имя пользователя или пароль');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            Alert.alert('Ошибка', 'Произошла ошибка при регистрации');
        } finally {
            setIsLoading(false);
        }
    };
    const routeToSignIn = () => {
        router.push('/(public)/signIn');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Регистрация</Text>
            <TextInputField
                label="Имя"
                labelColor={theme.colors.text}
                borderColor={theme.colors.text}
                textColor={theme.colors.text}
                value={name}
                onChangeText={setName}
                style={[styles.inputField, { borderColor: theme.colors.primary }]}
            />
            <TextInputField
                label="Почта"
                labelColor={theme.colors.text}
                borderColor={theme.colors.text}
                textColor={theme.colors.text}
                value={email}
                onChangeText={setEmail}
                style={[styles.inputField, { borderColor: theme.colors.primary }]}
            />
            <View style={styles.passwordContainer}>
                <TextInputField
                    label="Пароль"
                    labelColor={theme.colors.text}
                    borderColor={theme.colors.text}
                    textColor={theme.colors.text}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    style={[styles.passwordInput, { borderColor: theme.colors.primary }]}
                />
                <ReverseButton
                    isVisible={isPasswordVisible}
                    onPress={() => setIsPasswordVisible(prev => !prev)}
                    style={styles.reverseButton}
                />
            </View>
            <Button
                title="Зарегистрироваться"
                titleColor={theme.colors.secondary}
                buttonColor={theme.colors.primary}
                onPress={handleSignUp}
                style={styles.button}
            />
            <View style={styles.clickableText}>
                <ClickableText
                    title="Уже есть аккаунт?"
                    titleColor={theme.colors.secondary}
                    onPress={routeToSignIn}
                    style={styles.clickableText}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputField: {
        marginBottom: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    passwordInput: {
        flex: 1,
    },
    reverseButton: {
        marginLeft: 8,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clickableText: {
        marginTop: 20,
        alignSelf: 'flex-start'
    }
});