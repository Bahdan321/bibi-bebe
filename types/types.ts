export type MainComponentProps = {
    currentDate: Date;
}

export type NavigatePanelProps = {
    currentDate: Date;
    goToPreviousWeek: () => void;
    goToNextWeek: () => void;
}


export type DayBlockProps = {
    date: string;
    dayOfWeek: string;
}

export interface TaskListProps {
    tasks: Task[];
    onAddTask: (text: string, date: string) => void;
    onToggleTaskCompletion: (taskId: string) => void;
    date: string;
}

export interface DayInfoProps {
    date: string;
    dayOfWeek: string;
}

export interface TaskItemProps {
    task: Task;
    onToggleTaskCompletion: (taskId: string) => void;
}
export interface Task {
    id: string;
    text: string;
    done: boolean;
    counter?: number;
    created_at?: string;
    updated_at?: string;
    deleted?: boolean;
    date: string;
}
