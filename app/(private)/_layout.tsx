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
                </Stack>
            </View>
        </ScreenLayout>
    );
}
