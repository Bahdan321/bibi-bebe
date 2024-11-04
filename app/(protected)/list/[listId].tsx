import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { CircleButton } from '~/components/CircleButton';
import { TaskCard } from '~/components/TaskCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Entypo from '@expo/vector-icons/Entypo';

export default function TaskList() {
    const { listId } = useLocalSearchParams();

    return (
        <SafeAreaView className='' style={{ marginTop: hp('3') }}>
            <View className='' style={{ padding: wp('1'), }}>
                <View className='flex flex-col'>
                    {/* 
                    Блок с карточкой списка и кнопками
                    */}
                    <TaskCard themeText='Важно' onNavigate={() => { }} onAddTask={() => { }} index={false} />
                    <View className='absolute left-0 p-8'>
                        <CircleButton onPress={() => { router.back() }} iconName='keyboard-arrow-left' />
                    </View>
                    <View className='absolute right-0 p-8'>
                        <CircleButton onPress={() => { }} iconName='blur-on' />
                    </View>
                    <View className=' justify-center'>
                        <View className='absolute self-center'>
                            <TouchableOpacity
                                className='rounded-full bg-blue-200 justify-center'
                                style={{
                                    height: hp('15'), width: hp('15'), margin: wp('3')
                                }}
                                onPress={() => { }}
                            >
                                <Entypo name="plus" size={wp('16')} color="black" className='text-center' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* 
                    Список задач
                    */}
                </View>
            </View>
        </SafeAreaView >
    );
}
