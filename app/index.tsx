import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Redirect } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();
    const { theme } = useTheme();

    console.log(isAuthenticated, isLoading)

    const anim = <LottieView
        source={require('@/assets/lottie/gerl.json')}
        autoPlay
        loop={false}
        style={{
            width: 250,
            height: 250,
        }}
    />

    // Показываем загрузочный экран пока проверяется аутентификация
    if (isLoading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.text
            }}>
                {anim}
            </View>
        );
    }

    // Перенаправляем в зависимости от статуса аутентификации
    if (isAuthenticated) {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.text
        }}>
            {anim}
            <Redirect href={"/(private)/home"} />
        </View>;
    } else {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.text
        }}>
            {anim}
            <Redirect href={"/(public)/signIn"} />;
        </View>
    }
}