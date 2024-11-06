import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { router } from 'expo-router';


export const AddNewListButton = () => {
    return (
        <TouchableOpacity
            className='m-4 bg-black rounded-3xl flex flex-row self-center'
            style={{ height: hp('6'), width: wp('55') }}
            onPress={() => {
                router.navigate("/(protected)/addList")
            }}
        >
            <View>

            </View>
            <View className='absolute right-0'>
                <Text className='text-white text-xl p-4 text-center font-semibold'>Создать новый список</Text>
            </View>
        </TouchableOpacity>
    )
}