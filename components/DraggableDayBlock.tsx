import React, { useRef } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import DayInfo from '@/components/DayInfo';
import DroppableTaskList from '@/components/DroppableTaskList';
import Gigabar from '@/components/Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import { tasks$, toggleTaskCompletion, addTask } from '@/Supabase/utils/SupaLegend';
import { observer } from '@legendapp/state/react';
import { DayBlockProps } from '@/types/types';
import { useDragDrop } from '@/providers/DragDropProvider';

const DraggableDayBlock: React.FC<DayBlockProps> = observer(({ date, dayOfWeek }) => {
    const todos = tasks$.get();
    const { theme } = useTheme();
    const { setHoveredDate, isDragging, sourceDate } = useDragDrop();
    const dayBlockRef = useRef<View>(null);

    // Register this day's position for hit testing when dragging over it
    const onLayout = (event: LayoutChangeEvent) => {
        // We don't need to register the day's position with the DragDropProvider
        // because the DroppableTaskList component will handle that
    };

    // Фильтрация задач по display_date, с обработкой NULL и невалидных created_at
    const tasksForDay = Object.values(todos || {}).filter((task) => {
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
        return taskDisplayDate === date;
    });

    return (
        <View
            style={{ marginBottom: 48 }}
            ref={dayBlockRef}
            onLayout={onLayout}
        >
            <DayInfo date={date} dayOfWeek={dayOfWeek} />
            <Gigabar color={theme.colors.secondary} size={2} />
            <DroppableTaskList
                tasks={tasksForDay}
                onAddTask={(text) => addTask(
                    text,
                    "d11fb04b-5d47-40ba-8cd7-472b2a0c7285",
                    "3730b6d4-5b27-40ca-90de-74b3824e98bf",
                    date, // due_date
                    date  // display_date
                )}
                onToggleTaskCompletion={toggleTaskCompletion}
                date={date}
            />
        </View>
    );
});

export default DraggableDayBlock;
