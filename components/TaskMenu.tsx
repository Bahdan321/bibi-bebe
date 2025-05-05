import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Task,
} from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { TaskMenuProps } from '@/types/types';
import { toggleTaskRemove, toggleDublicateTask, toggleTaskCompletion } from '@/Supabase/utils/SupaLegend';
import { getFormatedDateOfYear } from '@/utils/DateUtils';
import RoundButton from './RoundButton';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { th } from 'date-fns/locale';
import DropdownMenu from './DropdownMenu'; // Импортируем новый компонент
import TimePicker from './TimePicker';


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
    const [tastStausCopy, setTastStausCopy] = useState(task.status);
    const [taskStatusColor, setTaskStatusColor] = useState(task.status ? theme.colors.icon : theme.colors.text);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const handleDateChange = () => {
    };

    // Дублирование задачи
    const handleDuplicate = () => {
        console.log('Duplicating task:', task);
        toggleDublicateTask(
            task.title,
            task.space_id,
            task.user_id,
            task.due_date,
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

    // Удаление задачи
    const handleDelete = () => {
        console.log('Deleting task:', task.id);
        toggleTaskRemove(task.id);
        onClose();
    };

    const handleTaskToggle = (taskId) => {
        toggleTaskCompletion(taskId);
        setTastStausCopy((prevStatus) => !prevStatus);
        setTaskStatusColor((prevColor) => (prevColor === theme.colors.text ? theme.colors.icon : theme.colors.text));
    }

    const handleEllipsisPress = () => {
        setIsDropdownVisible(!isDropdownVisible); // Toggle visibility directly
    };

    const closeDropdown = () => {
        setIsDropdownVisible(false);
    };

    // Определяем элементы меню
    const menuItems = [
        {
            icon: 'pencil' as keyof typeof Ionicons.glyphMap, // Пример иконки
            text: 'На завтра',
            onPress: () => console.log('Edit pressed'), // Пример действия
        },
        {
            icon: 'pencil' as keyof typeof Ionicons.glyphMap, // Пример иконки
            text: 'На неделю',
            onPress: () => console.log('Edit pressed'), // Пример действия
        }, {
            icon: 'duplicate-outline' as keyof typeof Ionicons.glyphMap, // Пример иконки
            text: 'Дублировать',
            onPress: handleDuplicate, // Пример действия
        },
        {
            icon: 'trash-bin-outline' as keyof typeof Ionicons.glyphMap, // Пример иконки
            text: 'Удалить',
            onPress: handleDelete, // Пример действия
        },
        // Добавьте другие элементы меню здесь
    ];

    const formattedDate = getFormatedDateOfYear(date);

    if (!visible) return null;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.third, borderRadius: 30 }]}>
            {/* Заголовок с датой и кнопкой закрытия */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleDateChange}>
                    <Text style={[styles.dateText, { color: theme.colors.text }]}>{formattedDate}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>
            {/* Поле для редактирования названия задачи */}
            <View style={styles.titleSection}>
                <TextInput
                    style={[
                        styles.titleInput,
                        {
                            color: tastStausCopy ? theme.colors.secondary : theme.colors.text,
                            opacity: tastStausCopy ? 0.6 : 1,
                            textDecorationLine: tastStausCopy ? 'line-through' : 'none',
                        },
                    ]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Название задачи"
                    placeholderTextColor={theme.colors.secondary}
                />
                <TouchableOpacity onPress={() => { handleTaskToggle(task.id) }}>
                    <Ionicons name="checkmark-outline" size={32} color={taskStatusColor} />
                </TouchableOpacity>
            </View>

            {/* Поле для описания задачи */}
            <TextInput
                style={[styles.descriptionInput, { color: theme.colors.text }, { lineHeight: 20 }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Добавьте описание"
                placeholderTextColor={theme.colors.secondary}
                multiline
                maxLength={150}
            />

            <TimePicker />


            {/* Кнопки действий */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => { }} style={styles.actionButton}>
                    <Ionicons name="calendar-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }} style={styles.actionButton}>
                    <Feather name="circle" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={handleDuplicate} style={styles.actionButton}>
                    <Ionicons name="duplicate-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                    <Ionicons name="trash-bin-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity> */}

                <View style={styles.ellipsisContainer}>
                    <TouchableOpacity onPress={handleEllipsisPress} style={styles.actionButton}>
                        <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text} />
                    </TouchableOpacity>

                    <DropdownMenu
                        items={menuItems}
                        visible={isDropdownVisible}
                        onClose={closeDropdown}
                        containerStyle={styles.dropdownMenu}
                    />
                </View>
            </View>
        </View >
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
        bottom: '100%', // Position above the button
        right: 0, // Align to the right of the button container
        marginBottom: 5, // Optional margin between button and menu
        zIndex: 1000, // Ensure menu is above other elements
    },
});

export default TaskMenu;