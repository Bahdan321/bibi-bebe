import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import TaskItem from '@/components/TaskItem';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}
interface TaskListProps {
    tasks: Task[];
    onAddTask: (newTaskText: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask }) => {
    const [emptyTaskId, setEmptyTaskId] = useState<number>(Date.now());
    const [isEditingEmptyTask, setIsEditingEmptyTask] = useState<boolean>(false);

    const handleEmptyTaskPress = () => {
        setIsEditingEmptyTask(true);
    };

    const handleTaskSubmit = (newTaskText: string) => {
        if (newTaskText.trim() !== '') {
            onAddTask(newTaskText.trim());
            setIsEditingEmptyTask(false);
            setEmptyTaskId(Date.now());
        }
    };

    const tasksWithEmpty = isEditingEmptyTask
        ? tasks
        : [...tasks, { id: emptyTaskId, text: '', completed: false }];

    return (
        <View>
            {tasksWithEmpty.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    isEditing={isEditingEmptyTask && task.id === emptyTaskId}
                    onSubmit={handleTaskSubmit}
                    onPress={handleEmptyTaskPress}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%'
    }
});


export default TaskList;
