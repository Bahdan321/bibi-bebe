import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Redirect } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getSpace } from "@/storages/spaceStorage";

export default function Index() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const { theme } = useTheme();
    const [hasSpace, setHasSpace] = useState<boolean | null>(null);
    
    // Проверяем, есть ли у пользователя созданное пространство
    useEffect(() => {
        const checkUserSpace = async () => {
            if (isAuthenticated && user) {
                const space = await getSpace();
                setHasSpace(!!space);
                console.log('Проверка пространства:', space ? 'Пространство найдено' : 'Пространство не найдено');
            }
        };
        
        checkUserSpace();
    }, [isAuthenticated, user]);
    
    console.log(isAuthenticated, isLoading, 'Есть пространство:', hasSpace)

    const anim = <LottieView
        source={require('@/assets/lottie/gerl.json')}
        autoPlay
        loop={false}
        style={{
            width: 250,
            height: 250,
        }}
    />

    // Показываем загрузочный экран пока проверяется аутентификация или наличие пространства
    if (isLoading || (isAuthenticated && hasSpace === null)) {
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

    // Перенаправляем в зависимости от статуса аутентификации и наличия пространства
    if (isAuthenticated) {
        // Если пользователь аутентифицирован, но у него нет пространства, перенаправляем на экран онбординга
        if (!hasSpace) {
            return <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.text
            }}>
                {anim}
                <Redirect href={"/(private)/onboardingScreen"} />
            </View>;
        }
        
        // Если пользователь аутентифицирован и у него есть пространство, перенаправляем на домашний экран
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
        // Если пользователь не аутентифицирован, перенаправляем на экран входа
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