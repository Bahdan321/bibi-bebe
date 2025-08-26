import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from '@legendapp/state/react';
import TaskItem from '@/components/TaskItem';
import NewTaskInput from '@/components/NewTaskInput';
import { Task, TaskListProps } from '@/types/types';

const TaskList = observer(({ tasks, onAddTask, onToggleTaskCompletion, date }: TaskListProps) => {
  const mainTasks = tasks.filter(task => task.parent_task_id === null)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); // Сортировка, чтобы новые задачи добавлялись в конец

  return (
    <View style={styles.container}>
      {mainTasks.map((task) => (
        <TaskItem
          key={`${task.id}-${date}`}
          task={task}
          onToggleTaskCompletion={onToggleTaskCompletion}
          date={date}
        />
      ))}
      <NewTaskInput onAddTask={(text) => {
        console.log('TaskList: вызов onAddTask с текстом:', text);
        onAddTask(text, date);
      }} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { width: '100%' },
});

export default TaskList;