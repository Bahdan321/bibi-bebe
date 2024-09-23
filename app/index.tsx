import * as React from 'react';
import { View, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, LayoutAnimationConfig } from 'react-native-reanimated';
import { Info } from '~/lib/icons/Info';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { SafeAreaFrameContext } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

export default function Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.buttonContainer} className='flex flex-row p-2 space-x-4'>
          <TouchableOpacity 
          className='bg-red-500 p-16 rounded-3xl'
          onPress={() => {
            router.push("/listScreen")
          }}>
            <Ionicons name="list" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
          className='bg-blue-500 p-16 rounded-3xl'
          onPress={() => {
            router.push("/addItemScreen")
          }}>
            <Ionicons name="add-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
});
