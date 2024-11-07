import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CustomButton } from '~/components/CustomButton';
import { CircleButton } from '~/components/CircleButton';
import { router, useLocalSearchParams } from 'expo-router';
import { MiniTaskCard } from '~/components/miniTaskCard';
import { useDatabase } from '~/context/dbProvider';

export default function addTasks() {
    const { listId } = useLocalSearchParams();
    const { taskLists, addTaskToList } = useDatabase();
    const [taskName, setTaskName] = useState<string>('');

    const currentList = taskLists.find(list => list.id === listId);

    const handleAddTask = async () => {
        if (!taskName.trim()) {
            alert('Введите название задачи');
            return;
        }

        if (currentList) {
            const newTask = {
                id: Date.now().toString(), // Используйте уникальный идентификатор для задачи
                title: taskName,
                isCompleted: false,
            };

            await addTaskToList(currentList.id, newTask);
            router.back(); // Возвращаемся на предыдущую страницу после добавления задачи
        }
    };

    if (!currentList) {
        return (
            <SafeAreaView style={{ marginTop: hp('3') }}>
                <Text>Список не найден</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className='' style={{ marginTop: hp('3') }}>
            <View className='' style={{ padding: wp('1'), }}>
                <View className='flex flex-col'>
                    <View className='absolute top-0 left-0 p-8 rounded-3xl'>
                        <View className='flex flex-col'>
                            <View className='flex flex-row justify-items-center'>
                                <View className='flex flex-col'>
                                    <CircleButton onPress={() => { router.back() }} />
                                    <Text className='text-black font-extrabold' style={{ fontSize: wp('12') }}>Новая</Text>
                                    <Text className='text-black font-extrabold' style={{ fontSize: wp('12') }}>Задача</Text>
                                </View>
                                <View className='justify-center' style={{ paddingLeft: wp('16') }}>
                                </View>
                            </View>
                        </View>
                        <View className='flex flex-col justify-items-center' style={{ paddingTop: hp('4') }}>
                            <Text className='text-black font-medium' style={{ fontSize: wp('6') }}>Список</Text>
                            <ScrollView
                                horizontal={true}
                            >
                                <TouchableOpacity
                                    onPress={() => {

                                    }}
                                >
                                    <MiniTaskCard
                                        themeText={currentList.name}
                                        height={hp('8')}
                                        width={wp('50')}
                                        gradient={currentList?.gradient}
                                    />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                        <View className='flex flex-col justify-items-center' style={{ paddingTop: hp('4') }}>
                            <Text className='text-black font-medium' style={{ fontSize: wp('6') }}>Название</Text>
                            <View className='pt-4'>
                                <TextInput
                                    placeholder="Введите название задачи"
                                    className='text-black mt-2 border border-black rounded-full px-4 py-8 font-extrabold text-center'
                                    style={{ fontSize: wp('6') }}
                                    onChangeText={(text) => {
                                        if (text.length > 0) {
                                            setTaskName(text);
                                        }
                                    }
                                    }
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
                                    <CustomButton title='Создать' onPress={() => { handleAddTask() }} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView >
    )
}