import React, { useState } from 'react';
import { View } from 'react-native';
import DayInfo from '@/components/DayInfo';
import TaskList from '@/components/TaskList';
import Gigabar from '@/components/Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import { todos$,toggleTaskCompletion } from '@/Supabase/utils/SupaLegend';

type DayBlockProps = {
    date: string;
    dayOfWeek: string;
}

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const DayBlock: React.FC<DayBlockProps> = ({ date, dayOfWeek }) => {
    const todos = todos$.get();
    const { theme } = useTheme();
    const [tasks, setTasks] = useState<Task[]>([]); // Инициализация tasks

    const handleAddTask = (newTaskText: string) => {
        const newTask: Task = {
            id: Date.now(),
            text: newTaskText,
            completed: false,
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const handleToggleTaskCompletion = (taskId: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return (
        <View style={{ marginBottom: 48 }}>
            <DayInfo date={date} dayOfWeek={dayOfWeek} />
            <Gigabar color={theme.colors.secondary} size={2} />
            <TaskList tasks={todos} onAddTask={handleAddTask} onToggleTaskCompletion={toggleTaskCompletion} />
        </View>
    );
}

export default DayBlock;