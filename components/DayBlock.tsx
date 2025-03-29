import React, { useState } from 'react';
import { View } from 'react-native';
import DayInfo from '@/components/DayInfo';
import TaskList from '@/components/TaskList';
import Gigabar from '@/components/Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import { todos$, toggleTaskCompletion, addTask } from '@/Supabase/utils/SupaLegend';
import { observer } from '@legendapp/state/react';

type DayBlockProps = {
    date: string;
    dayOfWeek: string;
}

const DayBlock: React.FC<DayBlockProps> = observer(({ date, dayOfWeek }) => {
    const todos = todos$.get();
    console.log(todos);
    const { theme } = useTheme();

    // todos = Object.values(todos);

    return (
        <View style={{ marginBottom: 48 }}>
            <DayInfo date={date} dayOfWeek={dayOfWeek} />
            <Gigabar color={theme.colors.secondary} size={2} />
            <TaskList tasks={todos.Object.value(todos)} onAddTask={addTask} onToggleTaskCompletion={toggleTaskCompletion} />
        </View>
    );
});

export default DayBlock;