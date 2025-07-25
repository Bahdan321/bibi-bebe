import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from '@legendapp/state/react';
import TaskItem from '@/components/TaskItem';
import NewTaskInput from '@/components/NewTaskInput';
import { Task, TaskListProps } from '@/types/types';

const TaskList = observer(({ tasks, onAddTask, onToggleTaskCompletion, date }: TaskListProps) => {
  const mainTasks = tasks.filter(task => task.parent_task_id === null);

  return (
    <View style={styles.container}>
      {mainTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTaskCompletion={() => onToggleTaskCompletion(task.id)}
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
  container: {
    width: '100%',
  },
});

export default TaskList;