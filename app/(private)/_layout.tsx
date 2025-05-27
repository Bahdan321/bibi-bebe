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
                    <Stack.Screen
                        name="profile"
                        options={{
                            title: 'profile',
                            presentation: 'formSheet',
                            gestureDirection: 'vertical',
                            animation: 'slide_from_bottom',
                            sheetGrabberVisible: true,
                            sheetInitialDetentIndex: 0,
                            sheetAllowedDetents: [0.45, 1],
                            sheetCornerRadius: 20,
                            sheetExpandsWhenScrolledToEdge: true,
                            sheetElevation: 24,
                        }}
                    />
                    <Stack.Screen
                        name="goals"
                        options={{
                            title: 'Goals',
                            presentation: 'formSheet',
                            gestureDirection: 'vertical',
                            animation: 'slide_from_bottom',
                            sheetGrabberVisible: true,
                            sheetInitialDetentIndex: 0,
                            sheetAllowedDetents: [0.45],
                            sheetCornerRadius: 20,
                            sheetExpandsWhenScrolledToEdge: true,
                            sheetElevation: 24,
                        }}
                    />
                    <Stack.Screen
                        name="spaces"
                        options={{
                            title: 'Spaces',
                            presentation: 'formSheet',
                            gestureDirection: 'vertical',
                            animation: 'slide_from_bottom',
                            sheetGrabberVisible: true,
                            sheetInitialDetentIndex: 0,
                            sheetAllowedDetents: [0.45],
                            sheetCornerRadius: 20,
                            sheetExpandsWhenScrolledToEdge: true,
                            sheetElevation: 24,
                        }}
                    />
                    <Stack.Screen
                        name="kakoetoMenu"
                        options={{
                            title: 'KakoetoMenu',
                            presentation: 'formSheet',
                            gestureDirection: 'vertical',
                            animation: 'slide_from_bottom',
                            sheetGrabberVisible: true,
                            sheetInitialDetentIndex: 0,
                            sheetAllowedDetents: [0.45],
                            sheetCornerRadius: 20,
                            sheetExpandsWhenScrolledToEdge: true,
                            sheetElevation: 24,
                        }}
                    />
                    <Stack.Screen
                        name="settings"
                        options={{
                            title: 'Settings',
                            presentation: 'formSheet',
                            gestureDirection: 'vertical',
                            animation: 'slide_from_bottom',
                            sheetGrabberVisible: true,
                            sheetInitialDetentIndex: 0,
                            sheetAllowedDetents: [0.45],
                            sheetCornerRadius: 24,
                            sheetExpandsWhenScrolledToEdge: true,
                            sheetElevation: 24,
                        }}
                    />
                </Stack>
            </View>
        </ScreenLayout>
    );
}
