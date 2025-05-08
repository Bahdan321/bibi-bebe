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
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { TaskMenuProps } from '@/types/types';
import { toggleTaskRemove, toggleDublicateTask, toggleTaskCompletion, changeEisenhowerMatrixStatus } from '@/Supabase/utils/SupaLegend';
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
    const [isMainDropdownVisible, setIsMainDropdownVisible] = useState(false);
    const [isEisenhowerMatrixDropdownVisible, setIsEisenhowerMatrixDropdownVisible] = useState(false);

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

    const handleChangeTaskColor = () => {
        setIsEisenhowerMatrixDropdownVisible(!isEisenhowerMatrixDropdownVisible);
        setIsMainDropdownVisible(false)
    }

    const handleTaskToggle = (taskId) => {
        toggleTaskCompletion(taskId);
        setTastStausCopy((prevStatus) => !prevStatus);
        setTaskStatusColor((prevColor) => (prevColor === theme.colors.text ? theme.colors.icon : theme.colors.text));
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

    const formattedDate = getFormatedDateOfYear(date);

    if (!visible) return null;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.third, borderRadius: 30 }]}>
            {/* Заголовок с датой и кнопкой закрытия */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleDateChange}>
                    <Text style={[styles.dateText, { color: theme.colors.text }]}>{formattedDate}</Text>
                </TouchableOpacity>
                {/* <Text style={{
                    color: geteisenhowerMatrix(task.is_urgent, task.is_important)[1],
                    fontWeight: 'bold',
                    fontSize: hp('2.2')
                }}
                >
                    {geteisenhowerMatrix(task.is_urgent, task.is_important)[0]}
                </Text> */}
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

            {/* <TimePicker /> */}


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
    }
});

export default TaskMenu;