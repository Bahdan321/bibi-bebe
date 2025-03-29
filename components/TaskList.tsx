import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from '@legendapp/state/react';
import TaskItem from '@/components/TaskItem';
import NewTaskInput from '@/components/NewTaskInput';
import { Task } from '@/types/types';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string, date: string) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  date: string;
}

const TaskList = observer(({ tasks, onAddTask, onToggleTaskCompletion, date }: TaskListProps) => {
  // const handleAddTask = (newTaskText: string) => {
  //   if (newTaskText.trim() !== '') {
  //     onAddTask(newTaskText.trim());
  //   }
  // };

  // tasks = Object.values(tasks);

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTaskCompletion={() => onToggleTaskCompletion(task.id)}
        />
      ))}
      <NewTaskInput onAddTask={(text) => onAddTask(text,date)}/>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default TaskList;