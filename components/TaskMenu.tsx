import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { TaskMenuProps } from '@/types/types';
import { toggleTaskRemove, toggleDublicateTask, toggleTaskCompletion } from '@/Supabase/utils/SupaLegend';
import { getFormatedDateOfYear } from '@/utils/DateUtils';
import TimePickerModal from './TimePickerModal';
import RoundButton from './RoundButton';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { tasks$ } from '@/Supabase/utils/SupaLegend';

const TaskMenu: React.FC<TaskMenuProps> = ({
    task,
    visible,
    date,
    onClose,
    title,
    setTitle,
    description,
    setDescription,
}) => {
    const { theme } = useTheme();
    const [taskStatusCopy, setTaskStatusCopy] = useState(task.status);
    const [taskStatusColor, setTaskStatusColor] = useState(task.status ? theme.colors.icon : theme.colors.text);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    const parsedDueDate = new Date(task.due_date);
    const formattedDueDate = isNaN(parsedDueDate.getTime())
        ? 'Некорректная дата'
        : parsedDueDate.toLocaleString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          });

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const due = new Date(task.due_date);
            if (isNaN(due.getTime())) {
                setTimeLeft('Некорректная дата');
                console.error('Invalid due_date:', task.due_date);
                return;
            }

            const diffMs = due.getTime() - now.getTime();
            if (diffMs < 0) {
                setTimeLeft('Срок истёк');
                return;
            }

            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`Осталось ${diffDays} дн. ${diffHours} ч. ${diffMinutes} мин.`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000);

        return () => clearInterval(interval);
    }, [task.due_date]);

    const handleDateChange = () => {
        // Логика изменения даты, если нужно
    };

    const handleDuplicate = () => {
        console.log('Duplicating task:', task);
        toggleDublicateTask(
            task.title,
            task.space_id,
            task.user_id,
            task.due_date,
            task.display_date,
            task.status,
            task.description,
            task.parent_task_id,
            task.created_at,
            task.updated_at,
            task.completion_date,
            task.is_repeating,
            task.repeat_interval,
            task.planning_period,
            task.is_urgent,
            task.is_important,
            task.reward_id,
            task.is_anime_task
        );
        onClose();
    };

    const handleDelete = () => {
        console.log('Deleting task:', task.id);
        toggleTaskRemove(task.id);
        onClose();
    };

    const handleTaskToggle = (taskId) => {
        toggleTaskCompletion(taskId);
        setTaskStatusCopy((prevStatus) => !prevStatus);
        setTaskStatusColor((prevColor) => (prevColor === theme.colors.text ? theme.colors.icon : theme.colors.text));
    };

    const calculateNewDueDate = (currentDueDate: string, time: { day: string; hours: number; minutes: number }) => {
        const dueDate = new Date(currentDueDate);
        if (isNaN(dueDate.getTime())) {
            console.error('Invalid currentDueDate:', currentDueDate);
            dueDate.setTime(new Date().getTime());
        }

        dueDate.setDate(dueDate.getDate() + parseInt(time.day));
        dueDate.setHours(dueDate.getHours() + time.hours);
        dueDate.setMinutes(dueDate.getMinutes() + time.minutes);
        return dueDate.toISOString().split('T')[0];
    };

    const handleTimeSelected = (time: { day: string; hours: number; minutes: number }) => {
        const newDueDate = calculateNewDueDate(task.due_date, time);
        if (tasks$[task.id]) {
            tasks$[task.id].due_date.set(newDueDate);
            console.log('Updated due_date:', newDueDate, 'display_date:', task.display_date, 'created_at:', task.created_at);
        } else {
            console.error('Task not found in tasks$:', task.id);
        }
        setIsTimePickerVisible(false);
    };

    const formattedDate = getFormatedDateOfYear(date);

    if (!visible) return null;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.third, borderRadius: 30 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleDateChange}>
                    <Text style={[styles.dateText, { color: theme.colors.text }]}>{formattedDate}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>
            <View style={styles.dueDateContainer}>
                <Text style={[styles.dueDateText, { color: theme.colors.text }]}>
                    Срок выполнения: {formattedDueDate}
                </Text>
                <Text style={[styles.timeLeftText, { color: theme.colors.secondary }]}>
                    {timeLeft}
                </Text>
            </View>
            <View style={styles.titleSection}>
                <TextInput
                    style={[
                        styles.titleInput,
                        {
                            color: taskStatusCopy ? theme.colors.secondary : theme.colors.text,
                            opacity: taskStatusCopy ? 0.6 : 1,
                            textDecorationLine: taskStatusCopy ? 'line-through' : 'none',
                        },
                    ]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Название задачи"
                    placeholderTextColor={theme.colors.secondary}
                />
                <TouchableOpacity onPress={() => handleTaskToggle(task.id)}>
                    <Ionicons name="checkmark-outline" size={32} color={taskStatusColor} />
                </TouchableOpacity>
            </View>
            <TextInput
                style={[styles.descriptionInput, { color: theme.colors.text }, { lineHeight: 20 }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Добавьте описание"
                placeholderTextColor={theme.colors.secondary}
                multiline
                maxLength={150}
            />
            <View style={styles.actions}>
                <TouchableOpacity onPress={handleDuplicate} style={styles.actionButton}>
                    <Ionicons name="duplicate" size={24} color={theme.colors.text} />
                    <Text style={[styles.actionText, { color: theme.colors.text }]}>Дублировать</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                    <Ionicons name="trash-bin" size={24} color={theme.colors.text} />
                    <Text style={[styles.actionText, { color: theme.colors.text }]}>Удалить</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setIsTimePickerVisible(true)}
                    style={styles.actionButton}
                >
                    <Ionicons name="time" size={24} color={theme.colors.text} />
                    <Text style={[styles.actionText, { color: theme.colors.text }]}>Выбрать время</Text>
                </TouchableOpacity>
            </View>
            <TimePickerModal
                visible={isTimePickerVisible}
                onClose={() => setIsTimePickerVisible(false)}
                onTimeSelected={handleTimeSelected}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 16,
    },
    dueDateContainer: {
        marginBottom: 20,
    },
    dueDateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timeLeftText: {
        fontSize: 14,
        marginTop: 5,
    },
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 10,
    },
    descriptionInput: {
        fontSize: 16,
        marginBottom: 20,
        textAlignVertical: 'top',
        minHeight: 100,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        alignItems: 'center',
        padding: 10,
    },
    actionText: {
        marginTop: 5,
    },
});

export default TaskMenu;