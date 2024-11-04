import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Avatar, AvatarImage } from '~/components/ui/avatar';
import { TaskCard } from '~/components/TaskCard';
import { router } from 'expo-router';

export default function Home() {
    const GITHUB_AVATAR_URI = 'https://github.com/mrzachnugent.png';

    const taskLists = [
        { id: 1, name: 'Важное' },
        { id: 2, name: 'Учебная Практика' },
        { id: 3, name: 'Ппе' },
    ];

    return (
        <SafeAreaView className='' style={{ marginTop: hp('3') }}>
            <View className='flex flex-col'>
                {/* 
                Приветствие пользователя и его аватар
                */}
                <View className='absolute top-0 left-0 p-8 rounded-3xl'>
                    <View className='flex flex-col'>
                        <Text className='text-black font-semibold' style={{ fontSize: wp('5') }}>Приветули, User</Text>
                        <View className='flex flex-row justify-items-center'>
                            <View className='flex flex-col'>
                                <Text className='text-black font-extrabold' style={{ fontSize: wp('12') }}>Ваши</Text>
                                <Text className='text-black font-extrabold' style={{ fontSize: wp('12') }}>Задачи</Text>
                            </View>
                            <View className='justify-center' style={{ paddingLeft: wp('16') }}>
                                <Avatar alt="Zach Nugent's Avatar" style={{ height: 100, width: 100 }}>
                                    <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
                                </Avatar>
                            </View>
                        </View>
                    </View>
                </View>
                {/* 
                Блоки с задачами пользователя
                */}
                <View className='flex flex-col justify-items-center mt-60'>
                    <ScrollView>
                        <TaskCard themeText='Важно' onNavigate={() => { router.navigate(`/(protected)/list/1`) }} onAddTask={() => { router.navigate("/(protected)/addTasks") }} />
                        <TaskCard themeText='Не важно' onNavigate={() => { router.navigate(`/(protected)/list/2`) }} onAddTask={() => { router.navigate("/(protected)/addTasks") }} />
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView >
    );
}
