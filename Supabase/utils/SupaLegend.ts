import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import { configureSynced } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentSpaceId } from '@/storages/spaceStorage';
import { Task } from '@/types/types';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// useEffect(() => {
//   AsyncStorage.clear();
//   SecureStore.deleteItemAsync('access_token');
//   SecureStore.deleteItemAsync('refresh_token');
// }, []);

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Создаем кастомное хранилище для токенов
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      // Для веб используем localStorage
      return Promise.resolve(localStorage.getItem(key));
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      // Для веб используем localStorage
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      // Для веб используем localStorage
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// Создаем клиент Supabase (используем публичный anon key)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const generateId = () => uuidv4();

export const currentSpaceId$ = observable<string | null>(null);

const customSynced = configureSynced(syncedSupabase, {
  persist: { plugin: observablePersistAsyncStorage({ AsyncStorage }) },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  onError: (error) => console.error('Ошибка синхронизации с Supabase:', error),
});

export const tasks$ = observable<any>(
  (customSynced({
    supabase,
    collection: 'tasks',
    select: (from) =>
      from.select(
        'id, space_id, user_id, parent_task_id, title, description, status, created_at, updated_at, due_date, display_date, completion_date, is_repeating, repeat_interval, planning_period, is_urgent, is_important, is_anime_task, reward, overrides, deleting'
      ),
    filter: (select) => {
      const spaceId = currentSpaceId$.get();
      return spaceId ? select.eq('space_id', spaceId) : select.is('space_id', null);
    },
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: { name: 'tasks', retrySync: true },
    retry: { infinite: true },
    onError: (error) => console.error('Ошибка в tasks$:', error),
  }) as any)
);

export const updateCurrentSpaceId = async () => {
  try {
    const spaceId = await getCurrentSpaceId();
    currentSpaceId$.set(spaceId);
    console.log('Текущее ID пространства обновлено:', spaceId);
  } catch (error) {
    console.error('Ошибка обновления текущего ID пространства:', error);
  }
};

export const setCurrentSpaceId = (spaceId: string | null) => {
  currentSpaceId$.set(spaceId);
  console.log('ID пространства установлено:', spaceId);
};

updateCurrentSpaceId().catch(error => console.error('Ошибка инициализации текущего ID пространства:', error));

export const getTaskStateForDate = (task: Task, date: string): { completed: boolean; deleted: boolean; deleting: boolean } => {
  if (!task.is_repeating) {
    return { completed: task.status, deleted: task.deleted || false, deleting: task.deleting || false };
  }
  const override = task.overrides?.find((o) => o.date === date);
  return override ? { completed: override.completed, deleted: override.deleted, deleting: override.deleting || false } : { completed: false, deleted: false, deleting: false };
};

export const updateTaskState = async (taskId: string, date: string, updates: Partial<{ completed: boolean; deleted: boolean; deleting: boolean }>) => {
  const task = (tasks$ as any)[taskId]?.get();
  if (!task) return;

  let newOverrides = task.overrides ? [...task.overrides] : [];
  const overrideIndex = newOverrides.findIndex((o: any) => o.date === date);

  if (overrideIndex >= 0) {
    newOverrides[overrideIndex] = { ...newOverrides[overrideIndex], ...updates };
  } else {
    newOverrides.push({ date, completed: false, deleted: false, deleting: false, ...updates });
  }

  (tasks$ as any)[taskId].overrides.set(newOverrides);

  const { error } = await supabase
    .from('tasks')
    .update({ overrides: newOverrides } as any)
    .eq('id', taskId as any);

  if (error) console.error('Ошибка обновления overrides:', error);
};

export const addTask = (
  title: string,
  space_id: string,
  user_id: string,
  due_date: string,
  display_date: string,
  reward: string,
  status = false,
  description?: string,
  parent_task_id?: string,
  created_at?: string,
  updated_at?: string,
  completion_date?: string,
  is_repeating = false,
  repeat_interval?: string,
  planning_period?: string,
  is_urgent = false,
  is_important = false,
  is_anime_task = false
) => {
  try {
    const newId = uuidv4();
    const now = new Date();
    const isoNow = now.toISOString();
    const taskData = {
      id: newId,
      space_id,
      user_id,
      title,
      reward,
      status,
      due_date: due_date || isoNow,
      display_date,
      description: description || '',
      parent_task_id: parent_task_id || null,
      created_at: created_at || isoNow,
      updated_at: isoNow,
      completion_date: completion_date || null,
      is_repeating,
      repeat_interval: repeat_interval || null,
      planning_period: planning_period || null,
      is_urgent,
      is_important,
      is_anime_task,
      overrides: [] as any,
      deleting: false,
    } as any;
    tasks$.set((prev: any) => ({ ...prev, [newId]: taskData }));
    console.log('Task added:', { id: newId, title, due_date, display_date, created_at: taskData.created_at });
    return supabase.from('tasks').insert([taskData] as any).then(({ error }) => {
      if (error) {
        console.error('Ошибка вставки в Supabase:', error);
        return Promise.reject(error);
      }
      console.log('Задача успешно сохранена в Supabase:', taskData);
      return Promise.resolve(newId);
    });
  } catch (error) {
    console.error('Ошибка добавления задачи:', error);
    return Promise.reject(error);
  }
};

export const toggleDublicateTask = async (
  title: string,
  space_id: string,
  user_id: string,
  due_date: string,
  display_date: string,
  reward: string,
  status = false,
  description?: string,
  parent_task_id?: string,
  created_at?: string,
  updated_at?: string,
  completion_date?: string,
  is_repeating = false,
  repeat_interval?: string,
  planning_period?: string,
  is_urgent = false,
  is_important = false,
  is_anime_task = false,
  originalTaskId?: string,
  subtasks?: Task[]
) => {
  try {
    const newId = uuidv4();
    const now = new Date();
    const dateString = now.toISOString();

    const mainTaskId = await addTask(
      title,
      space_id,
      user_id,
      due_date,
      display_date,
      reward,
      status,
      description || '',
      parent_task_id || null,
      created_at || dateString,
      dateString,
      completion_date ?? undefined,
      is_repeating,
      repeat_interval ?? undefined,
      planning_period ?? undefined,
      is_urgent,
      is_important,
      is_anime_task
    );

    if (!parent_task_id && subtasks?.length) {
      for (const subtask of subtasks) {
        await addTask(
          subtask.title,
          space_id,
          user_id,
          subtask.due_date || dateString,
          subtask.display_date || dateString,
          subtask.reward || '',
          subtask.status,
          subtask.description || '',
          mainTaskId,
          subtask.created_at || dateString,
          subtask.updated_at || dateString,
          subtask.completion_date ?? undefined,
          subtask.is_repeating,
          subtask.repeat_interval ?? undefined,
          subtask.planning_period ?? undefined,
          subtask.is_urgent,
          subtask.is_important,
          subtask.is_anime_task
        );
      }
    }
    console.log('Задача дублирована с ID:', newId);
  } catch (error) {
    console.error('Ошибка дублирования задачи:', error);
    throw error;
  }
};

export const toggleTaskCompletion = (taskId: string, date: string) => {
  const task = (tasks$ as any)[taskId];
  if (task) {
    if (task.is_repeating.get()) {
      const state = getTaskStateForDate(task.get(), date);
      updateTaskState(taskId, date, { completed: !state.completed });
    } else {
      task.status.set((prev: boolean) => !prev);
    }
  }
};

export const toggleTaskRemove = (taskId: string, date: string) => {
  const task = (tasks$ as any)[taskId];
  if (task) {
    if (task.is_repeating.get()) {
      updateTaskState(taskId, date, { deleting: true });
    } else {
      task.deleting.set(true);
    }
  }
};

export const finishDelete = async (taskId: string, date: string) => {
  const task = (tasks$ as any)[taskId]?.get();
  if (!task) return;

  if (task.is_repeating) {
    updateTaskState(taskId, date, { deleted: true, deleting: false });
  } else {
    // Для non-repeating: удаляем задачу полностью
    delete (tasks$ as any)[taskId];
    await supabase.from('tasks').delete().eq('id', taskId as any);
  }
};

export const updateTaskTitle = async (taskId: string, newTitle: string) => {
  const { error } = await supabase
    .from('tasks')
    .update({ title: newTitle } as any)
    .eq('id', taskId as any);
  if (error) console.error('Ошибка при обновлении названия задачи:', error);
};

export const changeEisenhowerMatrixStatus = (taskId: string, isUrgent: boolean, isImportant: boolean) => {
  const task = (tasks$ as any)[taskId];
  if (task) {
    task.is_urgent.set(isUrgent);
    task.is_important.set(isImportant);
  }
};

export const addReward = (taskId: string, reward: string) => {
  const task = (tasks$ as any)[taskId];
  if (task) task.reward.set(reward);
};