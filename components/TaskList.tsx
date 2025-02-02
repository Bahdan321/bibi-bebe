import React, { useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import TaskItem from '@/components/TaskItem';
import NewTaskInput from '@/components/NewTaskInput';

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

    const handleTaskPress = (taskId: number) => {
        setEditingTaskId(taskId);
    };

    const handleTaskSubmit = (newTaskText: string) => {
        if (newTaskText.trim() !== '') {
            onAddTask(newTaskText.trim());
            setEditingTaskId(null);
        }
    };

    return (
        <View style={styles.container}>
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    isEditing={editingTaskId === task.id}
                    onSubmit={() => { }}
                    onPress={() => { }}
                />
            ))}
            <NewTaskInput onAddTask={handleTaskSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%'
    }
});


export default TaskList;
