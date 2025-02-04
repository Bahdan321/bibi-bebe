import React, { useState } from 'react';
import { View } from 'react-native';
import DayInfo from '@/components/DayInfo';
import TaskList from '@/components/TaskList';
import Gigabar from '@/components/Gigabar';

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
    const [tasks, setTasks] = useState<Task[]>([]);

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
            <Gigabar color="white" size={2} />
            <TaskList tasks={tasks} onAddTask={handleAddTask} onToggleTaskCompletion={handleToggleTaskCompletion} />
        </View>
    )
}

export default DayBlock;