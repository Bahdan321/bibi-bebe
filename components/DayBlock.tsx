import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import DayInfo from '@/components/DayInfo';
import TaskList from '@/components/TaskList';
import Gigabar from '@/components/Gigabar';

type DayBlockProps = {
    date: string;
    dayOfWeek: string;
}

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const tasks: Task[] = [
    { id: 1, text: 'Кувырок', completed: true },
    // { id: 2, text: 'Поворот', completed: false },
    // { id: 2, text: 'Пенис', completed: false },

]

const DayBlock: React.FC<DayBlockProps> = ({ date, dayOfWeek }) => {
    return (
        <View>
            <DayInfo date={date} dayOfWeek={dayOfWeek} />
            <Gigabar color="white" size={2} />
            <TaskList tasks={tasks} />
        </View>
    )
}

export default DayBlock;