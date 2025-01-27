import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import DayInfo from '@/components/DayInfo';
import TaskList from '@/components/TaskList';
import Gigabar from '@/components/Gigabar';


interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const MainComponent: React.FC = () => {
    const tasks: Task[] = [
        { id: 1, text: 'Сделать сальто', completed: false },
        { id: 2, text: 'Вырастить мандрагору', completed: true },
    ];
    const tasks2: Task[] = [
        { id: 1, text: 'Кувырок', completed: true },
        { id: 2, text: 'Поворот', completed: false },
    ]

    return (
        <View style={styles.container}>
            <DayInfo date="2025-01-27" dayOfWeek="Понедельник" />
            <Gigabar />
            <TaskList tasks={tasks} />
            <Gigabar />
            <DayInfo date="2025-01-27" dayOfWeek="Понедельник" />
            <TaskList tasks={tasks2} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: 'black',
    },
});

export default MainComponent;