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

// Очищаем AsyncStorage при необходимости (раскомментируйте для отладки)
// useEffect(() => {
//   AsyncStorage.clear();
//   // const newTask = {
//   //   id: uuidv4(), // Уникальный идентификатор
//   //   title: 'Тестовая задача',
//   //   space_id: '54b479ff-ba77-49f0-93ce-8c6956041f2d',
//   //   user_id: '5245f47d-35a0-44d2-8a33-15b15b33daff',
//   //   status: false,
//   //   due_date: '2023-10-01',
//   // };
//   // async function insertTask() {
//   //   const { data, error } = await supabase.from('tasks').insert(newTask);
//   //   console.log('Результат:', data, error);
//   // }
//   // insertTask();
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
  fieldDeleted: 'deleted', // Убедитесь, что поле deleted есть в таблице, если используете soft deletes
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
export const addTask = (title: string, space_id: string, user_id: string, due_date: string) => {
  try {
    const newId = uuidv4(); // Генерируем временный UUID
    tasks$.set((prev) => ({
      ...prev,
      [newId]: {
        id: newId, // Временный идентификатор, будет заменен на реальный task_id после синхронизации
        space_id: space_id,
        user_id: user_id,
        title: title,
        status: false,
        due_date: due_date,
        description: null, // Можно добавить по необходимости
        parent_task_id: null,
        // created_at: new Date(),
        // updated_at: new Date().toISOString(),
        // completion_date: null,
        // is_repeating: false,
        // repeat_interval: null,
        // planning_period: null,
        // is_urgent: false,
        // is_important: false,
        // reward_id: null,
        // is_anime_task: false,
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