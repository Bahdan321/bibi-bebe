import * as React from 'react';
import { View, SafeAreaView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
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
import { Item } from '@rn-primitives/menubar';

const listScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
          <View style = {styles.flatListContainer}/>
              <FlatList data = {[
                {key: {
                    "itemName":"123",
                    "itemDesc":"abc"
                }}
              ]} renderItem={({item}) => <View className="flex flex-col">
                <Text style= {styles.item}>{item.key.itemName}</Text>
                <Text style= {styles.item}>{item.key.itemDesc}</Text>
              </View>}/>
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
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22,
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
    item: {
      
    },
    flatListContainer:{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
  },
})

export default listScreen