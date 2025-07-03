import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import ReverseButton from '@/components/ReverseButton';
import TextInputField from '@/components/TextInputField';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import ServiceButton from '@/components/ServiceButton';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { signIn } = useAuth();

    const handleSignIn = async () => {
        router.replace('/(private)/home');
    };

    const handleGoogleSignIn = () => {
        Alert.alert('Внимание', 'Авторизация через Google пока не реализована');
    };

    const handleAppleSignIn = () => {
        Alert.alert('Внимание', 'Авторизация через Apple пока не реализована');
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <Text style={[styles.tabText, { color: '#FFFFFF' }]}>Login</Text>
                <Text style={styles.tabSeparator}>◆</Text>
                <TouchableOpacity onPress={() => router.push('/(public)/signUp')}>
                    <Text style={[styles.tabText, { color: '#8A8A8A' }]}>Sign up</Text>
                </TouchableOpacity>
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
                <ReverseButton
                    isVisible={isPasswordVisible}
                    onPress={() => setIsPasswordVisible(prev => !prev)}
                    style={styles.reverseButton}
                />
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
            ) : (
                <>
                    <Button
                        title="Войти"
                        titleColor="#1C2526"
                        buttonColor="#FFFFFF"
                        onPress={handleSignIn}
                        style={styles.button}
                    />
                    <Text style={styles.orText}>или</Text>
                    <ServiceButton
                        title="Google"
                        titleColor="#FFFFFF"
                        buttonColor="#4285F4"
                        onPress={handleGoogleSignIn}
                        style={styles.socialButton}
                        icon='logo-google'
                    />
                    {Platform.OS === 'ios' && (
                        <ServiceButton
                            title="Apple"
                            titleColor="#FFFFFF"
                            buttonColor="#000000"
                            onPress={handleAppleSignIn}
                            style={styles.socialButton}
                            icon='logo-apple'
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
    },
    orText: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginVertical: 10,
    },
    loader: {
        marginVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
});