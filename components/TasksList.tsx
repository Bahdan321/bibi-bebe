import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import TaskItem, { Task } from './TaskItem';
import Separator from './Separator';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TasksList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Реализовать дичайший потенциал', isCompleted: false },
        { id: '2', title: 'Доделать BibiBebe', isCompleted: false },
        { id: '3', title: 'Купить чебупиццу во второй раз', isCompleted: true },
        { id: '4', title: 'Купить чебупиццу', isCompleted: true },
    ]);

    const handleToggleComplete = (id: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
            )
        );
    };

    const activeTasks = tasks.filter((task) => !task.isCompleted);
    const completedTasks = tasks.filter((task) => task.isCompleted);

    return (
        <View style={styles.container}>
            <FlatList
                data={activeTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskItem task={item} onToggleComplete={handleToggleComplete} />
                )}
                ListHeaderComponent={() => <Text style={styles.header}>Active Tasks</Text>}
            />
            <View style={{ paddingTop: hp('2'), justifyContent: 'center', alignItems: 'center' }}>
                <Separator />
            </View>
            <Text style={styles.completedHeader}>Completed ({completedTasks.length})</Text>
            <FlatList
                data={completedTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskItem task={item} onToggleComplete={handleToggleComplete} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexWrap: 'wrap',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    completedHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
    },
});

export default TasksList;