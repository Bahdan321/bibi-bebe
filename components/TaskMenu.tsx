import React, { useState } from 'react';
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
import { TaskMenuProps } from '@/types/types';
import { toggleTaskRemove, toggleDublicateTask, toggleTaskCompletion } from '@/Supabase/utils/SupaLegend';
import { getFormatedDateOfYear } from '@/utils/DateUtils';
import RoundButton from './RoundButton';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { th } from 'date-fns/locale';



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
                    style={
                        [styles.titleInput,
                        {
                            color: tastStausCopy ? theme.colors.secondary : theme.colors.text,
                            opacity: tastStausCopy ? 0.6 : 1,
                            textDecorationLine: tastStausCopy ? 'line-through' : 'none',
                        }]}
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

            {/* Кнопки действий */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={handleDuplicate} style={styles.actionButton}>
                    <Ionicons name="duplicate" size={24} color={theme.colors.text} />
                    <Text style={[styles.actionText, { color: theme.colors.text }]}>Дублировать</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                    <Ionicons name="trash-bin" size={24} color={theme.colors.text} />
                    <Text style={[styles.actionText, { color: theme.colors.text }]}>Удалить</Text>
                </TouchableOpacity>
            </View>
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