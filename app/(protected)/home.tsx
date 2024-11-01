import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

export default function Home() {
    const [progress, setProgress] = React.useState(78);
    const GITHUB_AVATAR_URI = 'https://github.com/mrzachnugent.png';

    function updateProgressValue() {
        setProgress(Math.floor(Math.random() * 100));
    }
    return (
        <SafeAreaView className='bg-slate-50' style={{ marginTop: hp('3') }}>
            <View className='absolute top-0 left-0 p-8'>
                <View className='flex flex-col'>
                    <Text className='text-black font-semibold' style={{ fontSize: wp('5') }}>Приветули User</Text>
                    <View className='flex flex-row justify-items-center'>
                        <View className='flex flex-col'>
                            <Text className='text-black font-extrabold' style={{ fontSize: wp('12') }}>Ваши</Text>
                            <Text className='text-black font-extrabold' style={{ fontSize: wp('12') }}>Задачи</Text>
                        </View>
                        <View className='justify-center pl-14'>
                            <Avatar alt="Zach Nugent's Avatar" style={{ height: 100, width: 100 }}>
                                <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
                            </Avatar>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView >
    );
}
