import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Gigabar from './Gigabar';

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
        <View style={{ flexDirection: 'column' }}>
            <View style={styles.container}>
                <Text style={styles.taskText}>{task.text}</Text>
                <TouchableOpacity style={[styles.statusButton, task.completed ? styles.completedStatus : styles.pendingStatus]} />
            </View>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.taskText}>{task.text}</Text>
            </View>
            <Gigabar color='gray' size={1} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 4,
        backgroundColor: 'black',
        marginBottom: 15,
        borderRadius: 4,
    },
    taskText: {
        fontWeight: '400',
        fontSize: 18,
        color: "white"
    },
    statusButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    completedStatus: {
        backgroundColor: 'white'
    },
    pendingStatus: {
        backgroundColor: 'gray'
    }
});

export default TaskItem;