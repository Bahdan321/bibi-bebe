import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { CustomButton, CustomTouchable, CustomView } from '@/components/base';
import CustomText from '@/components/base/CustomText';
import TextInputField from '@/components/TextInputField';

export default function OtpVerification() {
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(60); // 60 секунд для повторной отправки
    const [canResend, setCanResend] = useState(false);
    const router = useRouter();
    const { verifySignupOtp, resendSignupOtp } = useAuth();
    const params = useLocalSearchParams();
    const email = params.email as string;

    useEffect(() => {
        // Если email не передан, перенаправляем на страницу регистрации
        if (!email) {
            Alert.alert('Ошибка', 'Email не указан');
            router.replace('/(public)/signUp');
        }
    }, [email, router]);

    useEffect(() => {
        // Таймер для обратного отсчета
        let timer: number;
        if (countdown > 0 && !canResend) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0 && !canResend) {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [countdown, canResend]);

    const handleVerifyOtp = async () => {
        if (!otp) {
            Alert.alert('Ошибка', 'Пожалуйста, введите OTP код');
            return;
        }

        setIsLoading(true);
        try {
            const result = await verifySignupOtp(email, otp);
            if (result.success) {
                Alert.alert('Успех', 'Аккаунт успешно подтвержден', [
                    { text: 'OK', onPress: () => router.replace('/(private)/onboardingScreen') }
                ]);
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
        if (!canResend) return;

        setIsLoading(true);
        try {
            const result = await resendSignupOtp(email);
            if (result.success) {
                Alert.alert('Успех', 'OTP код отправлен повторно');
                setCountdown(60);
                setCanResend(false);
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
            <CustomView variant="column" padding="large" backgroundColor="transparent">
                <CustomText 
                    content="Подтверждение аккаунта" 
                    size="lg" 
                    color="#FFFFFF" 
                    weight="bold" 
                    style={styles.title}
                    textCenter
                />
                
                <CustomText 
                    content={`Мы отправили код подтверждения на ${email}. Пожалуйста, введите его ниже.`} 
                    size="md" 
                    color="#B0B0B0" 
                    style={styles.description}
                    textCenter
                />
                
                <TextInputField
                    label="OTP код"
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
                            title="Подтвердить"
                            titleColor="#1C2526"
                            onPress={handleVerifyOtp}
                            style={{ ...styles.button, backgroundColor: '#FFFFFF' }}
                        />
                        
                        <CustomButton
                            variant="text"
                            size="medium"
                            title={canResend ? 'Отправить код повторно' : `Повторная отправка через ${countdown} сек`}
                            titleColor={canResend ? '#FFFFFF' : '#8A8A8A'}
                            onPress={handleResendOtp}
                            disabled={!canResend}
                            style={styles.resendButton}
                        />
                        
                        <CustomTouchable onPress={() => router.back()}>
                            <CustomText 
                                content="Вернуться назад" 
                                size="md" 
                                color="#8A8A8A" 
                                style={styles.backLink}
                                textCenter
                            />
                        </CustomTouchable>
                    </>
                )}
            </CustomView>
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
    title: {
        marginBottom: 20,
    },
    description: {
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#2A2A2A',
        borderColor: '#4A4A4A',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        color: '#FFFFFF',
        marginBottom: 25,
    },
    button: {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginBottom: 15,
    },
    resendButton: {
        marginBottom: 20,
    },
    backLink: {
        marginTop: 10,
    },
    loader: {
        marginVertical: 20,
    },
});