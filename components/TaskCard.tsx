import React from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Progress } from '~/components/ui/progress';

interface TaskCardProps {
    themeText: string;
    onNavigate: () => void;
    onAddTask: () => void;
    index?: boolean;
}

const getRandomGradient = () => {
    const colors = ["red", "blue", "white", "black", "orange", "green", "purple", "gray"];

    const getRandomInt = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomColors = (colorsArray: string[]) => {
        const numColors = getRandomInt(2, 2);
        const selectedColors = new Set();

        while (selectedColors.size < numColors) {
            const randomIndex = getRandomInt(0, colorsArray.length - 1);
            selectedColors.add(colorsArray[randomIndex]);
        }

        return Array.from(selectedColors);
    };

    return getRandomColors(colors);
};



export const TaskCard: React.FC<TaskCardProps> = ({ themeText, onNavigate, onAddTask, index = true }) => {
    return (
        <View className='' style={{ padding: wp('1'), }}>
            <LinearGradient
                colors={getRandomGradient()}
                className=''
                style={{
                    height: hp('50'), paddingLeft: wp('6'), paddingTop: wp('12'),
                    borderTopLeftRadius: 60,
                    borderTopRightRadius: 60,
                    borderBottomLeftRadius: 60,
                    borderBottomRightRadius: 60,

                }}
            >
                <View className='flex flex-col'>
                    <View className='flex flex-row'>
                        {index ? (
                            <Text className='text-white font-extrabold text-center' style={{ fontSize: wp('12') }}>{themeText}</Text>
                        ) : (
                            <Text className='text-white font-extrabold text-center' style={{ fontSize: wp('12'), paddingTop: wp('12') }}>{themeText}</Text>
                        )}
                    </View>
                </View>
                {index && (
                    <>
                        <View className='absolute bottom-0 left-0'>
                            <TouchableOpacity
                                className='rounded-full bg-blue-500 justify-center'
                                style={{ height: hp('15'), width: hp('15'), margin: wp('3') }}
                                onPress={onNavigate}
                            >
                                <AntDesign name="ellipsis1" size={wp('16')} color="white" className='text-center' />
                            </TouchableOpacity>
                        </View>
                        <View className='absolute bottom-0 right-0'>
                            <TouchableOpacity
                                className='rounded-full bg-blue-200 justify-center'
                                style={{
                                    height: hp('15'), width: hp('15'), margin: wp('3')
                                }}
                                onPress={onAddTask}
                            >
                                <Entypo name="plus" size={wp('16')} color="black" className='text-center' />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </LinearGradient>
        </View >
    );
};
