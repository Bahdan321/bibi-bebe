import { ScreenLayout } from '@/providers/ScreenLayout';
import { Slot, Stack } from 'expo-router';
import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { View } from 'react-native';

export default function PrivateLayout() {
    const { theme } = useTheme();

    return (
        <ScreenLayout>
            <View style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: 'fade'
                    }}
                >
                    <Stack.Screen
                        name="home"
                    />
                    <Stack.Screen
                        name="onboardingScreen"
                    />
                    <Stack.Screen
                        name="taskMenu"
                        options={{
                            title: 'taskMenu',
                            presentation: 'formSheet',
                            gestureDirection: 'vertical',
                            animation: 'slide_from_bottom',
                            sheetGrabberVisible: true,
                            sheetInitialDetentIndex: 0,
                            sheetAllowedDetents: [0.45, 1],
                            sheetCornerRadius: 20,
                            sheetExpandsWhenScrolledToEdge: true,
                            sheetElevation: 24,
                            contentStyle: {
                                backgroundColor: theme.colors.third,
                            },
                        }}
                    />
                </Stack>
            </View>
        </ScreenLayout>
    );
}
