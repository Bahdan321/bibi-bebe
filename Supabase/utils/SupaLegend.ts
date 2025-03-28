import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { configureSynced } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

// Provide a function to generate ids locally
const generateId = () => uuidv4();

// Create a configured sync function
const customSynced = configureSynced(syncedSupabase, {
  // Use React Native Async Storage
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
  // Optionally enable soft deletes
  fieldDeleted: 'deleted',
});

export const todos$ = observable(
  customSynced({
    supabase,
    collection: 'todos',
    select: (from) =>
      from.select('id,counter,text,done,created_at,updated_at,deleted'),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    // Persist data and pending changes locally
    persist: {
      name: 'todos',
      retrySync: true, // Persist pending changes and retry
    },
    retry: {
      infinite: true, // Retry changes with exponential backoff
    },
  })
);

export const addTask = async (text: string) => {
  const newTask = { text, completed: false };
  const { data, error } = await supabase.from('todos').insert(newTask).select().single();
  if (error) throw error;
  todos$.set((prev) => [...prev, data]); // Обновляем observable
};

export const toggleTaskCompletion = async (taskId: number) => {
  const { data: task } = await supabase.from('todos').select('completed').eq('id', taskId).single();
  const { error } = await supabase
    .from('todos')
    .update({ completed: !task.completed })
    .eq('id', taskId);
  if (error) throw error;
  todos$.set((prev) =>
    prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
  );
};
