import React, { useState } from 'react';
import { View } from 'react-native';
import DayInfo from '@/components/DayInfo';
import TaskList from '@/components/TaskList';
import Gigabar from '@/components/Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import { tasks$, toggleTaskCompletion, addTask } from '@/Supabase/utils/SupaLegend';
import { observer } from '@legendapp/state/react';
import { DayBlockProps } from '@/types/types';

const DayBlock: React.FC<DayBlockProps> = observer(({ date, dayOfWeek }) => {
    const todos = tasks$.get();
    // console.log(todos);
    const { theme } = useTheme();
    // console.log("date: ", date)

    const tasksForDay = Object.values(todos || {}).filter((task) => task.due_date === date);
    return (
        <View style={{ marginBottom: 48 }}>
            <DayInfo date={date} dayOfWeek={dayOfWeek} />
            <Gigabar color={theme.colors.secondary} size={2} />
            <TaskList tasks={tasksForDay} onAddTask={(text) => addTask(text, "54b479ff-ba77-49f0-93ce-8c6956041f2d", "5245f47d-35a0-44d2-8a33-15b15b33daff", date,)} onToggleTaskCompletion={toggleTaskCompletion} date={date} />
        </View>
    );
});

export default DayBlock;