import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Gigabar from './Gigabar';
import RoundButton from './RoundButton';
import CustomText from './CustomText';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

interface TaskItemProps {
    task: Task;
    onToggleTaskCompletion: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleTaskCompletion }) => {
    const truncateTask = (text: string) => {
        const maxLength = 27;
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + "..."
        }
        return text;
    }

    const handleTextPress = () => {
        console.log("123")
    };

    const handleButtonPress = () => {
        onToggleTaskCompletion(task.id);
    };


    return (
        <View style={{ flexDirection: 'column' }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleTextPress} style={{ flex: 1 }}>
                    <CustomText
                        content={truncateTask(task.text)} size={18}
                        color={task.completed ? 'gray' : 'white'}
                        weight='700'
                        lineThrough={task.completed}
                    />
                </TouchableOpacity>
                <RoundButton
                    iconName={"checkmark-outline"}
                    iconColor={task.completed ? "gray" : "white"}
                    buttonColor={task.completed ? "transparent" : "transparent"}
                    borderColor={task.completed ? "gray" : "white"}
                    borderWidth={1.5}
                    onPress={handleButtonPress}
                    size={25}
                    hitSlop={10}
                />
            </View>
            <Gigabar color="gray" size={1} marginHorizontal={6} />
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