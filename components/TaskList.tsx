import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from '@legendapp/state/react';
import TaskItem from '@/components/TaskItem';
import NewTaskInput from '@/components/NewTaskInput';
import { TaskListProps } from '@/types/types';

const TaskList = observer(
  ({ tasks, onAddTask, onToggleTaskCompletion, onUpdateTask, date }: TaskListProps) => {
    return (
      <View style={styles.container}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleTaskCompletion={() => onToggleTaskCompletion(task.id)}
            onUpdateTask={onUpdateTask}
          />
        ))}
        <NewTaskInput onAddTask={(text) => onAddTask(text, date)} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default TaskList;