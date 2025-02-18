import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import ReverseButton from '@/components/ReverseButton'
import TextInputField from '@/components/TextInputField'
import Button from '@/components/Button'
import { Redirect, router, useRouter } from 'expo-router'

export default function SignUp() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/(private)/home')
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.title}>Регистрация</Text>
            <TextInputField
                label="Имя"
                value={name}
                onChangeText={setName}
            />
            <View style={styles.passwordContainer}/>
                <TextInputField
                    label = "Пароль"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!isPasswordVisible}
                />
                <ReverseButton
                    isVisible={isPasswordVisible}
                    onPress={() => setIsPasswordVisible(prev => !prev)}
                />
                <View  style={styles.button}>
                { <Button
                    title="Зарегестрироваться"
                    titleColor='black'
                    buttonColor='white'
                    onPress={handleSignUp}
                />}
                </View>
        </View>
    )
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
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

