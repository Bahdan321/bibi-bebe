import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type Task = {
    id: string;
    title: string;
    isCompleted: boolean;
};


type TaskItemProps = {
    task: Task;
    onToggleComplete: (id: string) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete }) => {
    return (
        <View className='flex flex-col'>
            <TouchableOpacity style={styles.taskContainer} onPress={() => onToggleComplete(task.id)}>
                <View style={styles.checkbox}>
                    {task.isCompleted && <View style={styles.checkedMark} />}
                </View>
                <Text className='font-extrabold' style={[styles.taskTitle, task.isCompleted && styles.completedText]}>
                    {task.title}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkedMark: {
        width: 10,
        height: 10,
        backgroundColor: '#000',
        borderRadius: 5,
    },
    taskTitle: {
        fontSize: wp('5'),
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
});

export default TaskItem;