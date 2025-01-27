import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';

interface Task {
    id: number;
    text: string;
    completed: boolean;
}
interface TaskListProps {
    tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    return (
        <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TaskItem task={item} />}
            style={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        width:'100%'
    }
});


export default TaskList;
