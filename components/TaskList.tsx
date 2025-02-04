import React, { useState } from 'react';
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
    onToggleTaskCompletion: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, onToggleTaskCompletion }) => {
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

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
                    onToggleTaskCompletion={onToggleTaskCompletion}
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
