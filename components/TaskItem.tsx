import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

interface TaskItemProps {
    task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.taskText}>{task.text}</Text>
            <TouchableOpacity style={[styles.statusButton, task.completed ? styles.completedStatus : styles.pendingStatus]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 4,
        backgroundColor: 'white',
        marginBottom: 4,
        borderRadius: 4,
    },
    taskText: {
        fontSize: 16,
    },
    statusButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    completedStatus: {
        backgroundColor: 'green'
    },
    pendingStatus: {
        backgroundColor: 'gray'
    }
});

export default TaskItem;