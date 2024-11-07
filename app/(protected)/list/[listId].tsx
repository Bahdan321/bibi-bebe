import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { CircleButton } from '~/components/CircleButton';
import { TaskCard } from '~/components/TaskCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Entypo from '@expo/vector-icons/Entypo';
import TasksList from '~/components/TasksList';
import { useDatabase } from '~/context/dbProvider';
import { DeleteModal } from '~/components/DeleteModal';

export default function TaskList() {
    const { listId } = useLocalSearchParams();
    const { taskLists, toggleTaskCompletion, deleteTaskList } = useDatabase();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const currentList = taskLists.find(list => list.id === listId);

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
                    {/* 
                    Блок с карточкой списка и кнопками
                    */}
                    <TaskCard themeText={currentList.name} onNavigate={() => { }} onAddTask={() => { }} gradient={currentList.gradient} index={false} />
                    {/* 
                    Кнопка назад    
                    */}
                    <View className='absolute left-0 p-8'>
                        <CircleButton onPress={() => { router.back() }} iconName='keyboard-arrow-left' />
                    </View>
                    {/* 
                    Кнопка удаления списка    
                    */}
                    <View className='absolute right-0 p-8'>
                        <CircleButton onPress={() => {
                            setIsModalVisible(true)
                        }} iconName='blur-on' />
                    </View>
                    <View className=' justify-center'>
                        <View className='absolute self-center'>
                            <TouchableOpacity
                                className='rounded-full bg-blue-200 justify-center'
                                style={{
                                    height: hp('15'), width: hp('15'), margin: wp('3')
                                }}
                                onPress={() => { router.navigate(`/(protected)/addTask/${listId}`) }}
                            >
                                <Entypo name="plus" size={wp('16')} color="black" className='text-center' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* 
                    Список задач
                    */}
                    <View style={{ paddingTop: hp('6') }}>
                        <TasksList tasks={currentList.tasks} onToggleComplete={(taskId) => toggleTaskCompletion(listId, taskId)}></TasksList>
                    </View>
                </View>
                <DeleteModal
                    Modaltext='Вы точно хотите удалить этот список?'
                    firstButtonText='Нет'
                    secondButtonText='Удалить'
                    firstButtonAction={() => { setIsModalVisible(false) }}
                    secondButtonAction={() => {
                        deleteTaskList(listId);
                        router.back();
                    }}
                    visible={isModalVisible}
                />
            </View>
        </SafeAreaView >
    );
}
