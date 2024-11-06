import { Stack } from "expo-router";

export default function PublicLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            {/* <Stack.Screen name="addTasks" /> */}
            <Stack.Screen name="addList" />
            {/* <Stack.Screen name="list" /> */}
        </Stack>
    );
}
