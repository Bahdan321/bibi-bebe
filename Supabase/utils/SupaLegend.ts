import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { configureSynced } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { getCurrentSpaceId, getSpace } from '@/storages/spaceStorage';

// Очищаем AsyncStorage при необходимости (раскомментируйте для отладки)
// useEffect(() => {
//   AsyncStorage.clear();
// }, []);

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

// Функция для генерации временных идентификаторов
const generateId = () => uuidv4();

// Создаем конфигурированную функцию синхронизации
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
  // fieldDeleted: 'deleted', // Убедитесь, что поле deleted есть в таблице, если используете soft deletes
  onError: (error) => {
    console.error('Ошибка синхронизации:', error);
  },
});

// Observable для работы с таблицей tasks
export const tasks$ = observable(

  customSynced({
    supabase,
    collection: 'tasks',
    select: (from) =>
      from.select(
        'id, space_id, user_id, parent_task_id, title, description, status, created_at, updated_at, due_date, completion_date, is_repeating, repeat_interval, planning_period, is_urgent, is_important, reward_id, is_anime_task'
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
    // idField: 'task_id', // Указываем, что первичный ключ — task_id
  })
);

// Функция для добавления новой задачи
export const addTask = (
  title: string,
  space_id: string,
  user_id: string,
  due_date: string,
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
  const now = new Date();
  const dateString = now.toISOString().replace("T", " ").split("Z")[0] + "123";
  console.log('dateString', dateString);
  try {
    const newId = uuidv4(); // Генерируем временный UUID
    tasks$.set((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        space_id: space_id,
        user_id: user_id,
        title: title,
        status: status || false,
        due_date: due_date,
        description: description || null,
        parent_task_id: parent_task_id || null,
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
    console.error('Ошибка добавления задачи:', error);
  };
}

// Функция для переключения статуса задачи
export const toggleTaskCompletion = (taskId: string) => {
  tasks$[taskId].status.set((prev) => !prev);
};

// Функция для изменения названия задачи
export const toggleTaskRename = (taskId: string, newTitle: string) => {
  tasks$[taskId].title.set((prev) => newTitle);
};

// Функция для изменения описания задачи
export const toggleTaskRenameDescription = (taskId: string, newDescription: string) => {
  tasks$[taskId].description.set((prev) => newDescription);
};

// Функция для изменения даты
export const toggleTaskChangeDate = (taskId: string, newDate: string) => {
  tasks$[taskId].due_date.set((prev) => newDate);
};

// Функция для удаления задачи
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
    const newId = uuidv4(); // Генерируем временный UUID
    tasks$.set((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        space_id: space_id,
        user_id: user_id,
        title: title,
        status: status || false,
        due_date: due_date,
        description: description || null,
        parent_task_id: parent_task_id || null,
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
  };
}