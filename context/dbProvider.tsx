import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Task = {
    id: string;
    title: string;
    isCompleted: boolean;
};

type TaskList = {
    id: string;
    name: string;
    gradient: string[];
    tasks: Task[];
};

type DatabaseContextProps = {
    createTaskList: (name: string, gradient: string[]) => Promise<void>;
    addTaskToList: (listId: string, task: Task) => Promise<void>;
    toggleTaskCompletion: (listId: string, taskId: string) => Promise<void>;
    getTaskLists: () => Promise<TaskList[]>;
};

type DatabaseProviderProps = {
    children: React.ReactNode;
}

const DatabaseContext = createContext<DatabaseContextProps>(null!);

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return context;
};

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);

    useEffect(() => {
        const loadTaskLists = async () => {
            try {
                const storedTaskLists = await AsyncStorage.getItem('taskLists');
                if (storedTaskLists) {
                    setTaskLists(JSON.parse(storedTaskLists));
                }
            } catch (error) {
                console.error('Failed to load task lists:', error);
            }
        };

        loadTaskLists();
    }, []);

    const saveTaskLists = async (lists: TaskList[]) => {
        try {
            await AsyncStorage.setItem('taskLists', JSON.stringify(lists));
        } catch (error) {
            console.error('Failed to save task lists:', error);
        }
    };

    const createTaskList = async (name: string, gradient: string[]) => {
        const id = Date.now().toString();
        const newTaskList: TaskList = { id, name, gradient, tasks: [] };
        const updatedTaskLists = [...taskLists, newTaskList];
        setTaskLists(updatedTaskLists);
        await saveTaskLists(updatedTaskLists);
    };

    const addTaskToList = async (listId: string, task: Task) => {
        const updatedTaskLists = taskLists.map(list =>
            list.id === listId ? { ...list, tasks: [...list.tasks, task] } : list
        );
        setTaskLists(updatedTaskLists);
        await saveTaskLists(updatedTaskLists);
    };

    const toggleTaskCompletion = async (listId: string, taskId: string) => {
        const updatedTaskLists = taskLists.map(list =>
            list.id === listId
                ? {
                    ...list,
                    tasks: list.tasks.map(task =>
                        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
                    ),
                }
                : list
        );
        setTaskLists(updatedTaskLists);
        await saveTaskLists(updatedTaskLists);
    };

    const getTaskLists = async (): Promise<TaskList[]> => {
        return taskLists;
    };

    return (
        <DatabaseContext.Provider
            value={{
                createTaskList,
                addTaskToList,
                toggleTaskCompletion,
                getTaskLists,
            }}
        >
            {children}
        </DatabaseContext.Provider>
    );
};
