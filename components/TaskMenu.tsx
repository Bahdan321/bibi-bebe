import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@/providers/ThemeProvider';
// import DateTimePicker from '@react-native-community/datetimepicker';

interface TaskMenuProps {
    task: {
        id: string;
        title: string;
        description: string;
        date: Date;
    };
    visible: boolean;
    onDuplicate: (newTask: any) => void;
    onDelete: (taskId: string) => void;
    onClose: () => void;
}

const TaskMenu: React.FC<TaskMenuProps> = ({
    task,
    visible,
    onDuplicate,
    onDelete,
    onClose,
}) => {
    const { theme } = useTheme();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [date, setDate] = useState(task.date);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Сохранение изменений
    const handleSave = () => {
        onUpdate({ id: task.id, title, description });
        onClose();
    };

    // Обработка изменения даты
    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    // Дублирование задачи
    const handleDuplicate = () => {
        const newTask = { ...task, id: Date.now().toString(), title, description, date };
        onDuplicate(newTask);
    };

    // Удаление задачи
    const handleDelete = () => {
        onDelete(task.id);
    };

    // Форматирование даты на русском
    const formattedDate = date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    if (!visible) return null;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            {/* Заголовок с датой и кнопкой закрытия */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Text style={[styles.dateText, { color: theme.colors.text }]}>{formattedDate}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose}>
                    <Icon name="x" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            {/* Поле для редактирования названия задачи */}
            <View style={styles.titleSection}>
                <TextInput
                    style={[styles.titleInput, { color: theme.colors.text }]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Название задачи"
                    placeholderTextColor={theme.colors.secondary}
                />
                <TouchableOpacity onPress={() => {/* Можно добавить сохранение */ }}>
                    <Icon name="check" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            {/* Поле для описания задачи */}
            <TextInput
                style={[styles.descriptionInput, { color: theme.colors.text }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Добавьте несколько дополнительных заметок здесь..."
                placeholderTextColor={theme.colors.secondary}
                multiline
            />

            {/* Выбор даты */}
            {/* {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )} */}

            {/* Кнопки действий */}
            <View style={styles.actions}>
                <TouchableOpacity onPress={handleDuplicate} style={styles.actionButton}>
                    <Icon name="refresh-ccw" size={24} color={theme.colors.text} />
                    <Text style={[styles.actionText, { color: theme.colors.text }]}>Дублировать</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                    <Icon name="trash-2" size={24} color={theme.colors.text} />
                    <Text style={[styles.actionText, { color: theme.colors.text }]}>Удалить</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Стили
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
        marginTop: 'auto',
        paddingVertical: 20,
    },
    actionButton: {
        alignItems: 'center',
        padding: 10,
    },
    actionText: {
        marginTop: 5,
    }
});

export default TaskMenu;