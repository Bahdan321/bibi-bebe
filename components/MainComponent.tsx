import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import DayInfo from '@/components/DayInfo';
import TaskList from '@/components/TaskList';
import Gigabar from '@/components/Gigabar';
import DayBlock from './DayBlock';


interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const MainComponent: React.FC = () => {
    const days = [
        { date: '21-01-25', dayOfWeek: 'Понедельник' },
        { date: '21-01-26', dayOfWeek: 'Вторник' },
        { date: '21-01-27', dayOfWeek: 'Среда' },
        { date: '21-01-28', dayOfWeek: 'Четверг' },
        { date: '21-01-29', dayOfWeek: 'Пятница' },
        { date: '21-01-30', dayOfWeek: 'Суббота' },
        { date: '21-01-31', dayOfWeek: 'Воскресенье' },
    ];

    return (
        <View style={styles.container}>
            {days.map((day, index) => (
                <DayBlock key={index} date={day.date} dayOfWeek={day.dayOfWeek} />
            ))}
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