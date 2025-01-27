import { ScreenLayout } from '@/providers/ScreenLayout';
import { Slot, Stack } from 'expo-router';
import { View } from 'react-native';

export default function ProtectedLayout() {
    return (
        <ScreenLayout>
            <View style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen
                        name="index"
                    />
                </Stack>
            </View>
        </ScreenLayout>
    );
}
