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
import Feather from '@expo/vector-icons/Feather';
import { TaskMenuProps } from '@/types/types';
import { toggleTaskRemove, toggleDublicateTask, toggleTaskCompletion, changeEisenhowerMatrixStatus } from '@/Supabase/utils/SupaLegend';
import { getFormatedDateOfYear } from '@/utils/DateUtils';
import TimePickerModal from './TimePickerModal';
import RoundButton from './RoundButton';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { tasks$ } from '@/Supabase/utils/SupaLegend';
import DropdownMenu from './DropdownMenu';
import CalendarModal from './CalendarModal';

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
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const [isMainDropdownVisible, setIsMainDropdownVisible] = useState(false);
    const [isEisenhowerMatrixDropdownVisible, setIsEisenhowerMatrixDropdownVisible] = useState(false);
    

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
        setIsCalendarVisible(true);
    };

    const handleCalendarApply = (selectedDate: Date) => {
        if (isNaN(selectedDate.getTime())) {
            console.error('Invalid date selected:', selectedDate);
            return;
        }

        if (tasks$[task.id]) {
            // Создаем новую дату с локальной полночью (00:00:00)
            const localDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                0,
                0,
                0,
                0
            );

            // Форматируем due_date в ISO формате (локальная полночь в UTC)
            const isoDate = localDate.toISOString();
            // Форматируем display_date как YYYY-MM-DD
            const displayDate = `${localDate.getFullYear()}-${String(
                localDate.getMonth() + 1
            ).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

            // Обновляем задачу
            tasks$[task.id].due_date.set(isoDate);
            tasks$[task.id].display_date.set(displayDate);

            console.log('Updated task:', {
                id: task.id,
                due_date: isoDate,
                display_date: displayDate,
            });
        } else {
            console.error('Task not found in tasks$:', task.id);
        }
        setIsCalendarVisible(false);
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
        return dueDate.toISOString(); // Возвращаем полное время
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

    const handleChangeTaskColor = () => {
        setIsEisenhowerMatrixDropdownVisible(!isEisenhowerMatrixDropdownVisible);
        setIsMainDropdownVisible(false)
    }

    const handleOpenMainMenu = () => {
        setIsMainDropdownVisible(!isMainDropdownVisible); // Toggle visibility directly
        setIsEisenhowerMatrixDropdownVisible(false)
    };

    const closeMainDropdown = () => {
        setIsMainDropdownVisible(false);
    };

    const closeEisenhowerMatrixDropdown = () => {
        setIsEisenhowerMatrixDropdownVisible(false);
    };

    const menuItems = [
        {
            icon: 'pencil' as keyof typeof Ionicons.glyphMap,
            text: 'На завтра',
            onPress: () => console.log('Edit pressed'),
        },
        {
            icon: 'pencil' as keyof typeof Ionicons.glyphMap,
            text: 'На неделю',
            onPress: () => console.log('Edit pressed'),
        }, {
            icon: 'duplicate-outline' as keyof typeof Ionicons.glyphMap,
            text: 'Дублировать',
            onPress: handleDuplicate,
        },
        {
            icon: 'trash-bin-outline' as keyof typeof Ionicons.glyphMap,
            text: 'Удалить',
            onPress: handleDelete,
        },
    ];

    // Определяем элементы для матрицы Эйзенхауэра
    // TODO: Заменить console.log на реальные функции обновления is_urgent и is_important
    const eisenhowermatrixitems = [
        {
            text: 'Срочно и Важно',
            color: theme.eisenhowerMatrix.urgentImportant,
            icon: 'alert-circle' as keyof typeof Ionicons.glyphMap,
            onPress: () => changeEisenhowerMatrixStatus(task.id, true, true),
        },
        {
            text: 'Важно, не срочно',
            color: theme.eisenhowerMatrix.notUrgentImportant,
            icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
            onPress: () => changeEisenhowerMatrixStatus(task.id, false, true),
        },
        {
            text: 'Срочно, не важно',
            color: theme.eisenhowerMatrix.urgentNotImportant,
            icon: 'time' as keyof typeof Ionicons.glyphMap,
            onPress: () => changeEisenhowerMatrixStatus(task.id, true, false),
        },
        {
            text: 'Не срочно и не важно',
            color: theme.eisenhowerMatrix.notUrgentNotImportant,
            icon: 'heart-circle' as keyof typeof Ionicons.glyphMap,
            onPress: () => changeEisenhowerMatrixStatus(task.id, false, false),
        },
    ];

    const geteisenhowerMatrix = (isUrgent: boolean, isImportant: boolean) => {
        if (isUrgent && isImportant) {
            return ["Срочно и Важно", theme.eisenhowerMatrix.urgentImportant]
        }
        else if (!isUrgent && isImportant) {
            return "Важно, не срочно"
        }
        else if (isUrgent && !isImportant) {
            return "Срочно, не важно"
        }
    }


    if (!visible) return null;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.third, borderRadius: 30 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleDateChange} style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={24} color={theme.colors.text} style={styles.icon} />
                    <Text style={[styles.dateText, { color: theme.colors.text }]}>{formattedDate}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>
            <View style={styles.dueDateContainer}>
                <Text style={[styles.dueDateText, { color: theme.colors.text }]}>
                    Срок выполнения до: {formattedDueDate}
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

            {/* Кнопки действий */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => { }} style={styles.actionButton}>
                    <Ionicons name="calendar-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={styles.ellipsisContainer}>
                    <TouchableOpacity onPress={handleChangeTaskColor} style={styles.actionButton}>
                        <Feather name="circle" size={24} color={theme.colors.text} />
                    </TouchableOpacity>

                    <DropdownMenu
                        items={eisenhowermatrixitems}
                        visible={isEisenhowerMatrixDropdownVisible}
                        onClose={closeEisenhowerMatrixDropdown}
                        layout='vertical'
                        containerStyle={styles.eisenhowerDropdownMenu}
                    />
                </View>


                <View style={styles.ellipsisContainer}>
                    <TouchableOpacity onPress={handleOpenMainMenu} style={styles.actionButton}>
                        <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text} />
                    </TouchableOpacity>

                    <DropdownMenu
                        items={menuItems}
                        visible={isMainDropdownVisible}
                        onClose={closeMainDropdown}
                        containerStyle={styles.dropdownMenu}
                    />
                </View>
            </View>
            <TimePickerModal
                visible={isTimePickerVisible}
                onClose={() => setIsTimePickerVisible(false)}
                onTimeSelected={handleTimeSelected}
            />
            <CalendarModal
                visible={isCalendarVisible}
                onClose={() => setIsCalendarVisible(false)}
                onApply={handleCalendarApply}
                initialDate={new Date(task.display_date || task.due_date)}
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
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 10,
        marginHorizontal: 20,
    },
    actionButton: {
        alignItems: 'center',
        padding: 10,
    },
    actionText: {
        marginTop: 5,
    },
    ellipsisContainer: {
        position: 'relative',
    },
    dropdownMenu: {
        position: 'absolute',
        bottom: '100%',
        right: 0,
        marginBottom: 5,
        zIndex: 1000,
    },
    eisenhowerDropdownMenu: {
        position: 'absolute',
        bottom: '100%',
        right: -100,
        marginBottom: 5,
        zIndex: 1000,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 5,
    }
});

export default TaskMenu;