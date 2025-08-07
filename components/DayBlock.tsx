import React from 'react';
import { View } from 'react-native';
import DayInfo from '@/components/DayInfo';
import TaskList from '@/components/TaskList';
import Gigabar from '@/components/Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import { tasks$, toggleTaskCompletion, addTask, getTaskStateForDate } from '@/Supabase/utils/SupaLegend';
import { observer } from '@legendapp/state/react';
import { DayBlockProps, Task } from '@/types/types';
import { useCurrentUserId } from '@/hooks/useCurrentUser';
import { useCurrentSpaceId } from '@/hooks/useCurrentSpace';
import { useTasksInitializer } from '@/hooks/useTasksInitializer';

const DayBlock: React.FC<DayBlockProps> = observer(({ date, dayOfWeek }) => {
    const currentUserId = useCurrentUserId();
    const currentSpaceId = useCurrentSpaceId();
    const { theme } = useTheme();
    const today = new Date();
    const isToday = new Date(date).toDateString() === today.toDateString();

    useTasksInitializer();

    const todos = tasks$.get();

    if (!currentUserId || !currentSpaceId) {
        console.log('DayBlock: нет пользователя или пространства', { currentUserId, currentSpaceId });
        return (
            <View style={{ marginBottom: 48 }}>
                <DayInfo date={date} dayOfWeek={dayOfWeek} />
                <Gigabar color={isToday ? theme.colors.currentDay : theme.colors.secondary} size={2} />
            </View>
        );
    }

    const tasksForDay = Object.values(todos || {}).flatMap((task: Task) => {
        let taskDisplayDate = task.display_date;
        if (!taskDisplayDate) {
            if (task.created_at && !isNaN(new Date(task.created_at).getTime())) {
                taskDisplayDate = new Date(task.created_at).toISOString().split('T')[0];
            } else {
                taskDisplayDate = task.due_date || new Date().toISOString().split('T')[0];
                console.warn('Invalid created_at for task:', { id: task.id, title: task.title, created_at: task.created_at });
            }
        }

        const taskDate = new Date(taskDisplayDate);
        const currentDate = new Date(date);

        if (task.is_repeating && task.repeat_interval) {
            try {
                const repeatDays = JSON.parse(task.repeat_interval); // ["mon", "wed", "fri"]
                const dayOfWeekLower = currentDate.toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
                if (taskDate <= currentDate && repeatDays.includes(dayOfWeekLower)) {
                    const state = getTaskStateForDate(task, date);
                    if (!state.deleted) {
                        return [{ ...task, display_date: date, status: state.completed }];
                    }
                }
            } catch (e) {
                console.error('Ошибка парсинга repeat_interval:', e);
            }
            // Показываем задачу в день создания, даже если он не в repeat_interval
            if (taskDisplayDate === date) {
                const state = getTaskStateForDate(task, date);
                if (!state.deleted) {
                    return [{ ...task, display_date: date, status: state.completed }];
                }
            }
            return [];
        } else {
            // Для неповторяющихся задач показываем только в день display_date
            if (taskDisplayDate === date) {
                return [task];
            }
            return [];
        }
    });

    console.log('DayBlock date:', date);
    console.log('Tasks for day:', tasksForDay.map(t => ({
        id: t.id,
        title: t.title,
        due_date: t.due_date,
        display_date: t.display_date,
        created_at: t.created_at,
        is_repeating: t.is_repeating,
        repeat_interval: t.repeat_interval,
    })));

    return (
        <View style={{ marginBottom: 48 }}>
            <DayInfo date={date} dayOfWeek={dayOfWeek} />
            <Gigabar color={isToday ? theme.colors.currentDay : theme.colors.secondary} size={2} />
            <TaskList
                tasks={tasksForDay}
                onAddTask={(text) => {
                    console.log('DayBlock: вызов addTask с параметрами:', { text, currentSpaceId, currentUserId, date });
                    if (!currentSpaceId || !currentUserId) {
                        console.error('DayBlock: невозможно добавить задачу - отсутствует space_id или user_id');
                        return;
                    }
                    addTask(text, currentSpaceId, currentUserId, date, date, '');
                }}
                onToggleTaskCompletion={toggleTaskCompletion}
                date={date}
            />
        </View>
    );
});

export default DayBlock;