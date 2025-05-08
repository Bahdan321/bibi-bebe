import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { configureSynced } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentSpaceId, getSpace } from '@/storages/spaceStorage';

const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

const generateId = () => uuidv4();

const customSynced = configureSynced(syncedSupabase, {
    persist: {
        plugin: observablePersistAsyncStorage({
            AsyncStorage,
        }),
    },
    generateId,
    supabase,
    changesSince: 'last-sync',
    fieldCreatedAt: 'created_at',
    fieldUpdatedAt: 'updated_at',
    onError: (error) => {
        console.error('Ошибка синхронизации с Supabase:', error);
    },
});

export const tasks$ = observable(
    customSynced({
        supabase,
        collection: 'tasks',
        select: (from) =>
            from.select(
                'id, space_id, user_id, parent_task_id, title, description, status, created_at, updated_at, due_date, display_date, completion_date, is_repeating, repeat_interval, planning_period, is_urgent, is_important, reward_id, is_anime_task'
            ),
        filter: (select) => select.eq('space_id', "37366bcc-a1d5-4025-aa34-66efcb1e632a"),
        actions: ['read', 'create', 'update', 'delete'],
        realtime: true,
        persist: {
            name: 'tasks',
            retrySync: true,
        },
        retry: {
            infinite: true,
        },
        onError: (error) => {
            console.error('Ошибка в tasks$:', error);
        },
    })
);

export const addTask = (
    title: string,
    space_id: string,
    user_id: string,
    due_date: string,
    display_date: string,
    status?: boolean,
    description?: string,
    parent_task_id?: string,
    created_at?: string,
    updated_at?: string,
    completion_date?: string,
    is_repeating?: boolean,
    repeat_interval?: string,
    planning_period?: string,
    is_urgent?: boolean,
    is_important?: boolean,
    reward_id?: string,
    is_anime_task?: boolean
) => {
    try {
        const newId = uuidv4();
        const now = new Date();
        const isoNow = now.toISOString();
        const taskData = {
            id: newId,
            space_id: space_id,
            user_id: user_id,
            title: title,
            status: status || false,
            due_date: due_date || isoNow,
            display_date: display_date, // YYYY-MM-DD
            description: description || null,
            parent_task_id: parent_task_id || null,
            created_at: created_at || isoNow, // Фиксируем дату создания
            updated_at: isoNow,
            completion_date: completion_date || null,
            is_repeating: is_repeating || false,
            repeat_interval: repeat_interval || null,
            planning_period: planning_period || null,
            is_urgent: is_urgent || false,
            is_important: is_important || false,
            reward_id: reward_id || null,
            is_anime_task: is_anime_task || false,
        };
        tasks$.set((prev) => ({
            ...prev,
            [newId]: taskData,
        }));
        console.log('Task added:', { id: newId, title, due_date, display_date, created_at: taskData.created_at });
        // Принудительная вставка для отладки
        supabase.from('tasks').insert([taskData]).then(({ error }) => {
            if (error) {
                console.error('Ошибка вставки в Supabase:', error);
            } else {
                console.log('Задача успешно сохранена в Supabase:', taskData);
            }
        });
    } catch (error) {
        console.error('Ошибка добавления задачи:', error);
    }
};

export const toggleTaskCompletion = (taskId: string) => {
    tasks$[taskId].status.set((prev) => !prev);
};

export const toggleTaskRename = (taskId: string, newTitle: string) => {
    tasks$[taskId].title.set((prev) => newTitle);
};

export const toggleTaskRenameDescription = (taskId: string, newDescription: string) => {
    tasks$[taskId].description.set((prev) => newDescription);
};

export const toggleTaskChangeDate = (taskId: string, newDate: string) => {
    tasks$[taskId].due_date.set((prev) => newDate);
};

export const toggleTaskChangeDisplayDate = (taskId: string, newDisplayDate: string) => {
    tasks$[taskId].display_date.set((prev) => newDisplayDate);
};

export const toggleTaskRemove = (taskId: string) => {
    const task = tasks$[taskId].get();
    if (task.description === null) {
        tasks$[taskId].description.set('');
    }
    tasks$[taskId].delete();
};

export const toggleDublicateTask = (
    title: string,
    space_id: string,
    user_id: string,
    due_date: string,
    display_date: string,
    status?: boolean,
    description?: string,
    parent_task_id?: string,
    created_at?: string,
    updated_at?: string,
    completion_date?: string,
    is_repeating?: boolean,
    repeat_interval?: string,
    planning_period?: string,
    is_urgent?: boolean,
    is_important?: boolean,
    reward_id?: string,
    is_anime_task?: boolean
) => {
    try {
        const newId = uuidv4();
        const now = new Date();
        const dateString = now.toISOString().split('T')[0];
        tasks$.set((prev) => ({
            ...prev,
            [newId]: {
                id: newId,
                space_id: space_id,
                user_id: user_id,
                title: title,
                status: status || false,
                due_date: due_date,
                display_date: display_date,
                description: description || null,
                parent_task_id: parent_task_id || null,
                created_at: created_at || dateString,
                updated_at: dateString,
                completion_date: completion_date || null,
                is_repeating: is_repeating || false,
                repeat_interval: repeat_interval || null,
                planning_period: planning_period || null,
                is_urgent: is_urgent || false,
                is_important: is_important || false,
                reward_id: reward_id || null,
                is_anime_task: is_anime_task || false,
            },
        }));
    } catch (error) {
        console.error('Ошибка дублирования задачи:', error);
    }
};