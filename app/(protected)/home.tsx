import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { TaskCard } from '~/components/TaskCard';

export default function Home() {
    const [progress, setProgress] = React.useState(78);
    const GITHUB_AVATAR_URI = 'https://github.com/mrzachnugent.png';

    function updateProgressValue() {
        setProgress(Math.floor(Math.random() * 100));
    }
    return (
        <SafeAreaView className='bg-slate-50' style={{ marginTop: hp('3') }}>
            <View className='flex flex-col'>
                {/* 
                Приветствие пользователя и его аватар
                */}
                <View className='absolute top-0 left-0 p-8 rounded-3xl'>
                    <View className='flex flex-col'>
                        <Text className='text-black font-semibold' style={{ fontSize: wp('5') }}>Приветули User</Text>
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
                        <TaskCard themeText='Важно' onNavigate={() => { }} onAddTask={() => { }} />
                        <TaskCard themeText='Не важно' onNavigate={() => { }} onAddTask={() => { }} />
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView >
    );
}
