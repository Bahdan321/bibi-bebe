import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from '@legendapp/state/react';
import DraggableTaskItem from './DraggableTaskItem';
import NewTaskInput from './NewTaskInput';
import { Task, TaskListProps } from '@/types/types';
import { useDragDrop } from '@/providers/DragDropProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const DraggableTaskList = observer(({ tasks, onAddTask, onToggleTaskCompletion, date }: TaskListProps) => {
    const { handleTaskReorder } = useDragDrop();
    const mainTasks = tasks.filter(task => task.parent_task_id === null);

    return (
        <GestureHandlerRootView style={styles.container}>
            {mainTasks.map((task, index) => (
                <DraggableTaskItem
                    key={task.id}
                    task={task}
                    onToggleTaskCompletion={() => onToggleTaskCompletion(task.id)}
                    date={date}
                    index={index}
                    tasksCount={mainTasks.length}
                />
            ))}
            <NewTaskInput onAddTask={(text) => onAddTask(text, date)} />
        </GestureHandlerRootView>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

export default DraggableTaskList;
