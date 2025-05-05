import { ScreenLayout } from '@/providers/ScreenLayout';
import { Slot, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function PrivateLayout() {
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
                            title: 'Profile',
                            presentation: 'formSheet',
                            gestureDirection: 'vertical',
                            animation: 'slide_from_bottom',
                            sheetGrabberVisible: true,
                            sheetInitialDetentIndex: 0,
                            sheetAllowedDetents: [0.5, 0.75, 1],
                            sheetCornerRadius: 20,
                            sheetExpandsWhenScrolledToEdge: true,
                            sheetElevation: 24,
                            contentStyle: {
                                backgroundColor: 'transparent',
                            },
                        }}
                    />
                </Stack>
            </View>
        </ScreenLayout>
    );
}
