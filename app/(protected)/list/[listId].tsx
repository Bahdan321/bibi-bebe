import React from 'react';
import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams, router } from 'expo-router';
import { CircleButton } from '~/components/ui/CircleButton';

export default function TaskList() {
    const { listId } = useLocalSearchParams();

    return (
        <View className='p-4'>
            <CircleButton onPress={() => { router.back() }} />
            <Text className='text-2xl font-bold'>Список задач {listId}</Text>
            {/* Здесь можно отобразить задачи для данного списка */}
        </View>
    );
}
