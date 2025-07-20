import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();
    const { theme } = useTheme();

    console.log(isAuthenticated, isLoading)

    // Показываем загрузочный экран пока проверяется аутентификация
    if (isLoading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.text
            }}>
                {/* <ActivityIndicator size="large" color={theme.colors.text} /> */}
            </View>
        );
    }

    // Перенаправляем в зависимости от статуса аутентификации
    if (isAuthenticated) {
        return <Redirect href={"/(private)/home"} />;
    } else {
        return <Redirect href={"/(public)/signIn"} />;
    }
}