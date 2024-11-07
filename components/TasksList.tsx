import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import TaskItem, { Task } from './TaskItem';
import Separator from './Separator';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface TaskListProps {
    tasks: Task[];
    onToggleComplete: (taskId: string) => void;
}

const TasksList: React.FC<TaskListProps> = ({ tasks, onToggleComplete }) => {
    const activeTasks = tasks.filter((task) => !task.isCompleted);
    const completedTasks = tasks.filter((task) => task.isCompleted);

    // Объединение активных и завершенных задач в один список с заголовками
    const combinedTasks = [
        { id: 'header-active', title: 'Активные задачи', type: 'header' },
        ...activeTasks.map((task) => ({ ...task, type: 'task' })),
        { id: 'separator', type: 'separator' }, // Разделитель
        { id: 'header-completed', title: `Завершенные задачи (${completedTasks.length})`, type: 'header' },
        ...completedTasks.map((task) => ({ ...task, type: 'task' })),
    ];

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <FlatList
                data={combinedTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    if (item.type === 'header') {
                        return <Text style={styles.header}>{item.title}</Text>;
                    }
                    if (item.type === 'separator') {
                        return (
                            <View style={styles.separatorContainer}>
                                <Separator />
                            </View>
                        );
                    }
                    return <TaskItem task={item} onToggleComplete={onToggleComplete} />;
                }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: hp('2%'),
    },
    header: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        marginVertical: hp('1%'),
    },
    separatorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp('1%'),
    },
});

export default TasksList;
