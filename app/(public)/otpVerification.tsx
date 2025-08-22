import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const email = params.email as string;

    useEffect(() => {
        // Если email не передан, перенаправляем на страницу регистрации
        if (!email) {
            Alert.alert(t('common.error'), t('auth.errors.emailMissing'));
            router.replace('/(public)/signUp');
        }
    }, [email, router, t]);

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
            Alert.alert(t('common.error'), t('auth.validation.otpRequired'));
            return;
        }

        setIsLoading(true);
        try {
            const result = await verifySignupOtp(email, otp);
            if (result.success) {
                Alert.alert(t('common.success'), t('auth.success.accountVerified'), [
                    { text: t('common.ok'), onPress: () => router.replace('/(private)/onboardingScreen') }
                ]);
            } else {
                Alert.alert(t('common.error'), result.error || t('auth.errors.otpInvalid'));
            }
        } catch (error) {
            console.error('Ошибка при верификации OTP:', error);
            Alert.alert(t('common.error'), t('auth.errors.otpVerificationError'));
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
                Alert.alert(t('common.success'), t('auth.success.otpResent'));
                setCountdown(60);
                setCanResend(false);
            } else {
                Alert.alert(t('common.error'), result.error || t('auth.errors.otpResendError'));
            }
        } catch (error) {
            Alert.alert(t('common.error'), t('auth.errors.otpResendGeneralError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CustomView variant="column" padding="large" backgroundColor="transparent">
                <CustomText
                    translationKey="auth.accountConfirmation"
                    size="lg"
                    color="#FFFFFF"
                    weight="bold"
                    style={styles.title}
                    textCenter
                />

                <CustomText
                    translationKey="auth.otpDescription"
                    translationOptions={{ email }}
                    size="md"
                    color="#B0B0B0"
                    style={styles.description}
                    textCenter
                />

                <TextInputField
                    label={t('auth.otpCode')}
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
                            title={t('auth.verify')}
                            titleColor="#1C2526"
                            onPress={handleVerifyOtp}
                            style={{ ...styles.button, backgroundColor: '#FFFFFF' }}
                        />

                        <CustomButton
                            variant="text"
                            size="medium"
                            title={canResend ? t('auth.resendCode') : t('auth.resendCountdown', { count: countdown })}
                            titleColor={canResend ? '#FFFFFF' : '#8A8A8A'}
                            onPress={handleResendOtp}
                            disabled={!canResend}
                            style={styles.resendButton}
                        />

                        <CustomTouchable onPress={() => router.back()}>
                            <CustomText
                                translationKey="common.back"
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