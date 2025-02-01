import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Gigabar from './Gigabar';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

interface TaskItemProps {
    task: Task;
    isEditing?: boolean;
    onSubmit?: (text: string) => void;
    onPress: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isEditing, onSubmit, onPress, }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleSubmit = () => {
        if (onSubmit && inputValue.trim() !== '') {
            onSubmit(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <View style={{ flexDirection: 'column' }}>
            <View style={styles.container}>
                {isEditing ? (
                    <TextInput
                        style={styles.taskText}
                        value={inputValue}
                        onChangeText={setInputValue}
                        autoFocus={true}
                        onSubmitEditing={handleSubmit}
                        onBlur={handleSubmit}
                    />
                ) : (
                    <TouchableOpacity onPress={onPress}>
                        <Text style={styles.taskText}>{task.text}</Text>
                    </TouchableOpacity>
                )}
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
    },
});

export default TaskItem;