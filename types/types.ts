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