/**
 * Пример использования обновленной системы задач с динамическим фильтром
 * 
 * Основные изменения:
 * 1. Создан currentSpaceId$ observable для отслеживания текущего пространства
 * 2. tasks$ теперь автоматически обновляется при изменении currentSpaceId$
 * 3. Убраны функции updateTasksFilter и initializeTasks
 * 4. Добавлены новые функции setCurrentSpaceId и updateCurrentSpaceId
 */

import { tasks$, currentSpaceId$, setCurrentSpaceId, updateCurrentSpaceId } from '@/Supabase/utils/SupaLegend';

// Пример 1: Установка конкретного ID пространства
function switchToSpace(spaceId: string) {
  // При вызове этой функции tasks$ автоматически обновится с новым фильтром
  setCurrentSpaceId(spaceId);
  console.log('Переключились на пространство:', spaceId);
}

// Пример 2: Обновление текущего ID пространства из хранилища
async function refreshCurrentSpace() {
  // Загружает текущий space_id из хранилища и обновляет currentSpaceId$
  await updateCurrentSpaceId();
  console.log('Текущее пространство обновлено');
}

// Пример 3: Отслеживание изменений текущего пространства
function watchCurrentSpace() {
  // Подписываемся на изменения currentSpaceId$
  currentSpaceId$.onChange((spaceId) => {
    console.log('Текущее пространство изменилось на:', spaceId);
    // tasks$ автоматически обновится благодаря реактивному фильтру
  });
}

// Пример 4: Получение задач для текущего пространства
function getCurrentTasks() {
  // tasks$ всегда содержит задачи для текущего пространства
  const tasks = tasks$.get();
  const currentSpace = currentSpaceId$.get();
  
  console.log(`Задачи для пространства ${currentSpace}:`, Object.keys(tasks).length);
  return tasks;
}

// Пример 5: Очистка фильтра (показать все задачи)
function showAllTasks() {
  setCurrentSpaceId(null);
  console.log('Показываем все задачи (без фильтра)');
}

export {
  switchToSpace,
  refreshCurrentSpace,
  watchCurrentSpace,
  getCurrentTasks,
  showAllTasks
};