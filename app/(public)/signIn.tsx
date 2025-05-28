import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import ReverseButton from '@/components/ReverseButton';
import TextInputField from '@/components/TextInputField';
import ClickableText from '@/components/СlickableText';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/providers/AuthProvider';

export default function SignIn() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();
    const { signIn } = useAuth();

    const handleSignIn = async () => {
        // if (!name || !password) {
        //     Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
        //     return;
        // }

        // setIsLoading(true);
        // try {
        //     const result = await signIn(name, password);
        //     if (result.success) {
        //         router.push('/(private)/home');
        //     } else {
        //         Alert.alert('Ошибка входа', result.error || 'Неверное почта или пароль');
        //     }
        // } catch (error) {
        //     console.error('Error signing in:', error);
        //     Alert.alert('Ошибка', 'Произошла ошибка при входе');
        // } finally {
        //     setIsLoading(false);
        // }
        router.replace('/(private)/home');

    };

    const routeToSignUp = () => {
        router.push('/(public)/signUp');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Авторизация</Text>
            <TextInputField
                label="Никнейм"
                labelColor={theme.colors.text}
                borderColor={theme.colors.text}
                textColor={theme.colors.text}
                value={name}
                onChangeText={setName}
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
            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.secondary} style={styles.loader} />
            ) : (
                <Button
                    title="Войти"
                    titleColor={theme.colors.secondary}
                    buttonColor={theme.colors.primary}
                    onPress={handleSignIn}
                    style={styles.button}
                />
            )}
            <View style={styles.clickableText}>
                <ClickableText
                    title="Нет аккаунта?"
                    titleColor={theme.colors.secondary}
                    onPress={routeToSignUp}
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
        marginBottom: 15,
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
    },
    loader: {
        marginVertical: 10
    }
});