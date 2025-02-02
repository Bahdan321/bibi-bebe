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
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [showEmptyTask, setShowEmptyTask] = useState(true);

    const handleTaskPress = (taskId: number) => {
        setEditingTaskId(taskId);
    };

    const handleTaskSubmit = (newTaskText: string) => {
        if (newTaskText.trim() !== '') {
            onAddTask(newTaskText.trim());
            setEditingTaskId(null);
            setShowEmptyTask(true);
        }
    };

    const emptyTask = { id: -1, text: '', completed: false };
    const tasksToShow = showEmptyTask ? [...tasks, emptyTask] : tasks;

    return (
        <View style={styles.container}>
            {tasksToShow.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    isEditing={editingTaskId === task.id}
                    onSubmit={handleTaskSubmit}
                    onPress={() => handleTaskPress(task.id)}
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
