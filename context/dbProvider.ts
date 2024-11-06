import React, { createContext, useContext, useEffect, useState } from 'react';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

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

export const DBContext = () => {
    const db = useSQLiteContext();
    // const [task, setTask] = useState<Task>();
    const [taskList, setTaskList] = useState<TaskList>();

    useEffect(() => {
        async function setup() {
            try {
                await db.execAsync(
                    'CREATE TABLE IF NOT EXISTS taskLists (id TEXT PRIMARY KEY NOT NULL, name TEXT, gradient TEXT);'
                );
                await db.execAsync(
                    'CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY NOT NULL, title TEXT, isCompleted INT, listId TEXT, FOREIGN KEY(listId) REFERENCES taskLists(id));'
                );

                const result = await db.getAllAsync<Task>('SELECT * FROM taskLists');
                setTaskList(result);

            } catch (e) {
                console.log("db error", e);
            }
        }
        setup();
    }, []);

    const createTaskList = (name: string, gradient: string[]) => {
        const id = Date.now().toString(); // Поменять на uuid4
        db.execSync(
            `INSERT INTO taskLists (id, name, gradient) values (${id},${name},${JSON.stringify(gradient)});`
        )
    };

    const addTaskToList = (listId: string, task: Task) => {
        db.execSync(
            `INSERT INTO tasks (id, title, isCompleted, listId) values (${task.id},${task.title},${task.isCompleted ? 1 : 0}, ${listId}});`
        )
    };

    const toggleTaskCompletion = (taskId: string) => {
        db.execSync(
            `UPDATE tasks SET isCompleted = NOT isCompleted WHERE id = ${taskId};`
        )
    };

}

// type DatabaseContextType = {
//     createTaskList: (name: string, gradient: string[]) => void;
//     addTaskToList: (listId: string, task: Task) => void;
//     toggleTaskCompletion: (taskId: string) => void;
//     getTaskLists: () => Promise<TaskList[]>;
// };

// const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// export const useDatabase = () => {
//     const context = useContext(DatabaseContext);
//     if (!context) {
//         throw new Error('useDatabase must be used within a DatabaseProvider');
//     }
//     return context;
// };

// export const DatabaseProvider: React.FC = ({ children }) => {
//     useEffect(() => {
//         db.execSync(
//             'CREATE TABLE IF NOT EXISTS taskLists (id TEXT PRIMARY KEY NOT NULL, name TEXT, gradient TEXT);'
//         );
//         db.execSync(
//             'CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY NOT NULL, title TEXT, isCompleted INT, listId TEXT, FOREIGN KEY(listId) REFERENCES taskLists(id));'
//         )
//     }, []);

// const createTaskList = (name: string, gradient: string[]) => {
//     const id = Date.now().toString(); // Поменять на uuid4
//     db.execSync(
//         `INSERT INTO taskLists (id, name, gradient) values (${id},${name},${JSON.stringify(gradient)});`
//     )
// };

// const addTaskToList = (listId: string, task: Task) => {
//     db.execSync(
//         `INSERT INTO tasks (id, title, isCompleted, listId) values (${task.id},${task.title},${task.isCompleted ? 1 : 0}, ${listId}});`
//     )
// };

// const toggleTaskCompletion = (taskId: string) => {
//     db.execSync(
//         `UPDATE tasks SET isCompleted = NOT isCompleted WHERE id = ${taskId};`
//     )
// };

//     const getTaskLists = (): Promise<TaskList[]> => {
//         return new Promise((resolve, reject) => {
//             db.execSync(
//                 `SELECT * FROM taskLists;`,
//             )
//         });
//     };

//     return (
//         <DatabaseContext.Provider
//             value={{
//                 createTaskList,
//                 addTaskToList,
//                 toggleTaskCompletion,
//                 getTaskLists,
//             }}
//         >
//             {children}
//         </DatabaseContext.Provider>
//     );
// };
