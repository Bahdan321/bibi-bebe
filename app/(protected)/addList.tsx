import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CustomButton } from '~/components/CustomButton';
import { CircleButton } from '~/components/CircleButton';
import { router } from 'expo-router';

export default function addList() {
    return (
        <SafeAreaView className='' style={{ marginTop: hp('3') }}>
            <View className='' style={{ padding: wp('1'), }}>
                <View className='flex flex-col'>
                    <View className='absolute top-0 left-0 p-8 rounded-3xl'>
                        <View className='flex flex-col'>
                            <View className='flex flex-row justify-items-center'>
                                <View className='flex flex-col'>
                                    <CircleButton onPress={() => { router.back() }} />
                                    <Text className='text-black font-extrabold' style={{ fontSize: wp('12') }}>Новый</Text>
                                    <Text className='text-black font-extrabold' style={{ fontSize: wp('12') }}>Список</Text>
                                </View>
                                <View className='justify-center' style={{ paddingLeft: wp('16') }}>
                                </View>
                            </View>
                        </View>
                        <View className='flex flex-col justify-items-center' style={{ paddingTop: hp('4') }}>
                            <Text className='text-gray-400 font-light' style={{ fontSize: wp('6') }}>Название</Text>
                            <View className='pt-4'>
                                <TextInput
                                    placeholder="Введите название списка"
                                    className='text-black mt-2 border border-black rounded-full px-4 py-8 font-extrabold text-center'
                                    style={{ fontSize: wp('6') }}
                                />
                            </View>
                            {/* <View className='pt-2'>
                                <Text className='text-gray-400 font-light' style={{ fontSize: wp('6') }}>Описание</Text>
                                <TextInput
                                    placeholder="Введите описание задачи (Необязательно)"
                                    className='text-black mt-2 border border-black rounded-full px-4 py-6 font-extrabold text-center'
                                    multiline={true}
                                    numberOfLines={3}
                                    style={{ fontSize: wp('6') }}
                                />
                            </View> */}
                            <View className='flex flex-col-reverse'>
                                <View className='pt-2'>
                                    <CustomButton title='Создать' onPress={() => { }} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView >
    )
}