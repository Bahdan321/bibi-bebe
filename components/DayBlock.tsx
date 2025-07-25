import React from 'react';
import { View } from 'react-native';
import DayInfo from '@/components/DayInfo';
import TaskList from '@/components/TaskList';
import Gigabar from '@/components/Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import { tasks$, toggleTaskCompletion, addTask } from '@/Supabase/utils/SupaLegend';
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

    // Инициализируем tasks$ для текущего пространства
    useTasksInitializer();

    const todos = tasks$.get();

    // Если нет пользователя или пространства, не показываем задачи
    if (!currentUserId || !currentSpaceId) {
        console.log('DayBlock: нет пользователя или пространства', { currentUserId, currentSpaceId });
        return (
            <View style={{ marginBottom: 48 }}>
                <DayInfo date={date} dayOfWeek={dayOfWeek} />
                <Gigabar color={isToday ? theme.colors.currentDay : theme.colors.secondary} size={2} />
            </View>
        );
    }


    // Фильтрация задач по display_date, с учетом повторяющихся задач
    const tasksForDay = Object.values(todos || {}).filter((task: Task) => {
        let taskDisplayDate = task.display_date;
        if (!taskDisplayDate) {
            // Проверяем валидность created_at
            if (task.created_at && typeof task.created_at === 'string' && !isNaN(new Date(task.created_at).getTime())) {
                taskDisplayDate = new Date(task.created_at).toISOString().split('T')[0];
            } else {
                // Запасной вариант: используем due_date или текущую дату
                taskDisplayDate = task.due_date || new Date().toISOString().split('T')[0];
                console.warn('Invalid created_at for task:', { id: task.id, title: task.title, created_at: task.created_at });
            }
        }

        const taskDate = new Date(taskDisplayDate);
        const currentDate = new Date(date);

        if (task.is_repeating) {
            if (task.repeat_interval) {
                try {
                    const repeatDays = JSON.parse(task.repeat_interval); // ["mon", "wed", "fri"]
                    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'short' }).toLowerCase(); // "mon"
                    return taskDate <= currentDate && repeatDays.includes(dayOfWeek);
                } catch (e) {
                    console.error('Ошибка парсинга repeat_interval:', e);
                    return false;
                }
            }
            return false;
        } else {
            return taskDisplayDate === date;
        }
    });

    // Отладка: логируем дату и задачи
    console.log('DayBlock date:', date);
    console.log('Tasks for day:', tasksForDay.map(t => ({
        id: t.id,
        title: t.title,
        due_date: t.due_date,
        display_date: t.display_date,
        created_at: t.created_at,
        is_repeating: t.is_repeating,
        repeat_interval: t.repeat_interval
    })));

    return (
        <View style={{ marginBottom: 48 }}>
            <DayInfo date={date} dayOfWeek={dayOfWeek} />
            <Gigabar color={isToday ? theme.colors.currentDay : theme.colors.secondary} size={2} />
            <TaskList
                tasks={tasksForDay}
                onAddTask={(text) => {
                    console.log('DayBlock: вызов addTask с параметрами:', {
                        text,
                        currentSpaceId,
                        currentUserId,
                        date
                    });
                    
                    // Дополнительная проверка на null
                    if (!currentSpaceId || !currentUserId) {
                        console.error('DayBlock: невозможно добавить задачу - отсутствует space_id или user_id');
                        return;
                    }
                    
                    addTask(
                        text,
                        currentSpaceId,
                        currentUserId,
                        date, // due_date
                        date, // display_date
                        '' // reward - пустая строка по умолчанию
                    );
                }}
                onToggleTaskCompletion={toggleTaskCompletion}
                date={date}
            />
        </View>
    );
});

export default DayBlock;