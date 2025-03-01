import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import ReverseButton from '@/components/ReverseButton';
import TextInputField from '@/components/TextInputField';
import ClickableText from '@/components/СlickableText';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';

export default function SignIn() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/(private)/home');
    };
    const routeToSignUp = () => {
        router.push('/(public)/signUp');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Авторизация</Text>
            <TextInputField
                label="Имя"
                value={name}
                onChangeText={setName}
                style={styles.inputField} 
            />
            <View style={styles.passwordContainer}>
                <TextInputField
                    label="Пароль"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                    style={styles.passwordInput}
                />
                <ReverseButton
                    isVisible={isPasswordVisible}
                    onPress={() => setIsPasswordVisible(prev => !prev)}
                    style={styles.reverseButton}
                />
            </View>
            <Button
                title="Войти"
                titleColor='black'
                buttonColor='white'
                onPress={handleSignUp}
                style={styles.button}
            />
            <View style={styles.clickableText}>
            <ClickableText
                title="Нет аккаунта?"
                titleColor="#1faee9"
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
    }
});