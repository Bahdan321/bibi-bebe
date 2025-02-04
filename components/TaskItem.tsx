import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Gigabar from './Gigabar';
import RoundButton from './RoundButton';

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

const TaskItem: React.FC<TaskItemProps> = React.memo(({ task, isEditing, onSubmit, onPress }) => {
    const [inputValue, setInputValue] = useState<string>('');

    // useEffect(() => {
    //     if (isEditing) {
    //         setInputValue(task.text);
    //     }
    // }, [isEditing, task.text]);

    const handleSubmit = () => {
        if (onSubmit && inputValue.trim() !== '') {
            onSubmit(inputValue.trim());
            setInputValue('');
        }
    };

    const truncateTask = (text:string) => {
        const maxLength = 27;
        if (text.length > maxLength){
            return text.slice(0, maxLength) + "..."
        }
        return text;
    }

    return (
        <View style={{ flexDirection: 'column' }}>
            <View style={styles.container}>
                {/* {isEditing ? (
                    <TextInput
                        style={styles.taskText}
                        value={inputValue}
                        onChangeText={setInputValue}
                        onSubmitEditing={handleSubmit}
                        placeholder="Че делать будем?"
                        placeholderTextColor="gray"
                    />
                ) : ( */}
                <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
                    <Text style={styles.taskText}>
                        {truncateTask(task.text)}
                    </Text>
                </TouchableOpacity>
                {/* )} */}
                <RoundButton
                    iconName={task.completed ? "checkmark-outline" : "checkmark-outline"}
                    iconColor="#fff"
                    buttonColor={task.completed ? "gray" : "transparent"}
                    borderColor={task.completed ? "gray" : "white"}
                    borderWidth={1.5}
                    onPress={onPress}
                    size={25}
                    
                />
            </View>
            <Gigabar color="gray" size={1} />
        </View>
    );
});

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