import { View, Text } from 'react-native'
import React, { useCallback, useState } from 'react'
import TaskMenu from '@/components/TaskMenu'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Task } from '@/types/types';
import { toggleTaskRename, toggleTaskRenameDescription, toggleTaskRemove, toggleDublicateTask } from '@/Supabase/utils/SupaLegend';


const taskMenu = () => {
    const { task, date } = useLocalSearchParams();
    const parsedTask: Task | null = task && typeof task === 'string' ? JSON.parse(task) : null;

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

    return (
        <View style={{ flex: 1, }}>
            <TaskMenu
                task={parsedTask}
                visible={true}
                onClose={handleClose} // Вызываем сохранение при закрытии через крестик
                date={date}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
            />
        </View>
    );
};

export default taskMenu;