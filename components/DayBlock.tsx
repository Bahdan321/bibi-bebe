import React, { useState } from 'react';
import { View } from 'react-native';
import DayInfo from '@/components/DayInfo';
import TaskList from '@/components/TaskList';
import Gigabar from '@/components/Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import { todos$, toggleTaskCompletion, addTask } from '@/Supabase/utils/SupaLegend';
import { observer } from '@legendapp/state/react';
import { DayBlockProps } from '@/types/types';

const DayBlock: React.FC<DayBlockProps> = observer(({ date, dayOfWeek }) => {
    const todos = todos$.get();
    // console.log(todos);
    const { theme } = useTheme();
    // console.log("date: ", date)

    const tasksForDay = Object.values(todos || {}).filter((task) => task.date === date);
    return (
        <View style={{ marginBottom: 48 }}>
            <DayInfo date={date} dayOfWeek={dayOfWeek} />
            <Gigabar color={theme.colors.secondary} size={2} />
            <TaskList tasks={tasksForDay} onAddTask={(text) => addTask(text, date)} onToggleTaskCompletion={toggleTaskCompletion} date={date} />
        </View>
    );
});

export default DayBlock;