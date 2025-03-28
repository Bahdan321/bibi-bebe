import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from '@legendapp/state/react';
import TaskItem from '@/components/TaskItem';
import NewTaskInput from '@/components/NewTaskInput';


interface Task {
    id: string; // Изменено на string
    text: string;
    done: boolean; // Заменено completed на done
    counter?: number; // Опционально, если нужно
    created_at?: string; // Опционально
    updated_at?: string; // Опционально
    deleted?: boolean; // Опционально
  }

const TaskList = observer<Task>(() => {
  
  const todosArray = Object.values(todos);
  const handleAddTask = (newTaskText: string) => {
    if (newTaskText.trim() !== '') {
      addTask(newTaskText.trim()); // Функция для добавления задачи в БД
    }
  };

  return (
    <View style={styles.container}>
      {todosArray.map((task) => (
  <TaskItem
    key={task.id}
    task={{ id: task.id, text: task.text, completed: task.done }} // Маппим данные
    onToggleTaskCompletion={() => toggleTaskCompletion(task.id)}
  />
))}
      <NewTaskInput onAddTask={handleAddTask} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default TaskList;