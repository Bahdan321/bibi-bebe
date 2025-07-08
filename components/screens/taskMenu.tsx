import { View, StyleSheet } from 'react-native'
import CustomText from '@/components/base/CustomText'
import CustomTouchable from '@/components/base/CustomTouchable'
import React, { useCallback, useState } from 'react'
import TaskMenu from '@/components/TaskMenu'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Task } from '@/types/types';
import { toggleTaskRename, toggleTaskRenameDescription } from '@/Supabase/utils/SupaLegend';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import DropdownMenu from '@/components/DropdownMenu';


export default function taskMenu() {
    const { theme } = useTheme();

    const { task, date } = useLocalSearchParams();
    const parsedTask: Task | null = task && typeof task === 'string' ? JSON.parse(task) : null;
    const dateString = Array.isArray(date) ? date[0] : date;
    console.log('Parsed task:', parsedTask);

    // Состояние для редактируемых полей
    const [title, setTitle] = useState(parsedTask?.title || '');
    const [description, setDescription] = useState(parsedTask?.description || '');

    // Функция сохранения изменений
    const handleSaveChanges = useCallback(() => {
        if (parsedTask) {
            if (parsedTask.title !== title) {
                console.log('Renaming task:', title);
                toggleTaskRename(parsedTask.id, title);
            }
            if (parsedTask.description !== description) {
                console.log('Changing description:', description);
                toggleTaskRenameDescription(parsedTask.id, description);
            }
        }

    }, [parsedTask, title, description]);

    const handleClose = () => {
        handleSaveChanges()
        router.dismissTo('/(private)/home');
    }

    // Используем useFocusEffect для сохранения при закрытии страницы
    useFocusEffect(
        useCallback(() => {
            return () => {
                handleSaveChanges();
            };
        }, [handleSaveChanges])
    );

    if (!parsedTask) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CustomText content="Задача не найдена" size="md" color={theme.colors.text} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column', }}>
            <TaskMenu
                task={parsedTask}
                visible={true}
                onClose={handleClose}
                date={dateString}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
            />
        </View>
    );
};

