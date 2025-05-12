import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { Task } from '@/types/types';
import { toggleTaskChangeDisplayDate } from '@/Supabase/utils/SupaLegend';
import { Dimensions, LayoutRectangle } from 'react-native';

interface TaskPosition {
    taskId: string;
    layout: LayoutRectangle;
    date: string;
}

interface DragDropContextType {
    draggingTask: Task | null;
    setDraggingTask: (task: Task | null) => void;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
    sourceDate: string | null;
    setSourceDate: (date: string | null) => void;
    handleTaskMove: (task: Task, targetDate: string) => void;
    handleTaskReorder: (tasks: Task[], sourceIndex: number, destinationIndex: number) => void;
    registerTaskPosition: (taskId: string, layout: LayoutRectangle, date: string) => void;
    unregisterTaskPosition: (taskId: string) => void;
    getTaskPositions: () => TaskPosition[];
    hoveredTaskId: string | null;
    setHoveredTaskId: (taskId: string | null) => void;
    hoveredDate: string | null;
    setHoveredDate: (date: string | null) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export const useDragDrop = () => {
    const context = useContext(DragDropContext);
    if (!context) {
        throw new Error('useDragDrop must be used within a DragDropProvider');
    }
    return context;
};

interface DragDropProviderProps {
    children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
    const [draggingTask, setDraggingTask] = useState<Task | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [sourceDate, setSourceDate] = useState<string | null>(null);
    const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);

    // Store positions of all tasks for hit testing
    const taskPositionsRef = useRef<TaskPosition[]>([]);

    // Register a task's position for hit testing
    const registerTaskPosition = (taskId: string, layout: LayoutRectangle, date: string) => {
        // Remove any existing entry for this task
        const filtered = taskPositionsRef.current.filter(pos => pos.taskId !== taskId);
        taskPositionsRef.current = [...filtered, { taskId, layout, date }];
    };

    // Unregister a task's position
    const unregisterTaskPosition = (taskId: string) => {
        taskPositionsRef.current = taskPositionsRef.current.filter(pos => pos.taskId !== taskId);
    };

    // Get all task positions
    const getTaskPositions = () => {
        return taskPositionsRef.current;
    };

    // Handle moving a task from one day to another
    const handleTaskMove = (task: Task, targetDate: string) => {
        if (task && targetDate && sourceDate !== targetDate) {
            // Update the task's display_date in the database
            toggleTaskChangeDisplayDate(task.id, targetDate);
            console.log(`Moved task ${task.id} from ${sourceDate} to ${targetDate}`);
        }
    };

    // Handle reordering tasks within the same day
    const handleTaskReorder = (tasks: Task[], sourceIndex: number, destinationIndex: number) => {
        if (sourceIndex === destinationIndex) return;

        console.log(`Reordered task from index ${sourceIndex} to ${destinationIndex}`);
        // Note: In a real implementation, you would update the order in the database
        // This is a placeholder for now as the current data model doesn't have an explicit order field
    };

    return (
        <DragDropContext.Provider
            value={{
                draggingTask,
                setDraggingTask,
                isDragging,
                setIsDragging,
                sourceDate,
                setSourceDate,
                handleTaskMove,
                handleTaskReorder,
                registerTaskPosition,
                unregisterTaskPosition,
                getTaskPositions,
                hoveredTaskId,
                setHoveredTaskId,
                hoveredDate,
                setHoveredDate,
            }}
        >
            {children}
        </DragDropContext.Provider>
    );
};

export default DragDropProvider;
