import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Providers } from '@/providers/Providers';
import React from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(public)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(private)" options={{ headerShown: false, animation: 'fade' }} />
        {/* <Stack.Screen name="+not-found" /> */}
      </Stack>
      <StatusBar />
    </Providers>
  );
}
