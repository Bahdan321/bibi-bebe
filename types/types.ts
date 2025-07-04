export type MainComponentProps = {
    currentDate: Date;
}

export type NavigatePanelProps = {
    currentDate: Date;
    goToPreviousWeek: () => void;
    goToNextWeek: () => void;
    goToPreviousYear?: () => void;
    goToNextYear?: () => void;
    isMonthView?: boolean;
    toggleView?: () => void;
    onOpenSettings?: () => void;
    onOpenProfile?: () => void;
    onOpenSpaces?: () => void;
    onOpenKakoetoMenu?: () => void;
    onOpenGoals?: () => void;
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
    date: string;
    onToggleTaskCompletion: (taskId: string) => void;
}

export interface Task {
    id: string; // Временный UUID или строковое представление task_id
    space_id: string; // UUID пространства
    user_id: string; // UUID пользователя
    parent_task_id?: number | null; // ID родительской задачи или null
    title: string; // Название задачи (заменяет старое поле text)
    description?: string | null; // Описание задачи (опционально)
    status: boolean; // Статус выполнения (заменяет старое поле done)
    created_at?: string; // Дата создания в формате строки
    updated_at?: string; // Дата обновления в формате строки
    due_date?: string | null; // Срок выполнения (заменяет старое поле date)
    display_date?: string | null
    completion_date?: string | null; // Дата завершения
    is_repeating: boolean; // Повторяющаяся задача
    repeat_interval?: string | null; // Интервал повторения
    planning_period?: string | null; // Период планирования
    is_urgent: boolean; // Срочная задача
    is_important: boolean; // Важная задача
    reward?: string | null;
    is_anime_task: boolean; // Аниме-задача
    deleted?: boolean; // Флаг удаления (опционально, если используется soft delete)
}

export interface User {
    user_id: string
    username: string
    email: string
    avatar_url: string
    displayed_title_id: string
}

export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User;
    signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    // getUserInfo: () => Promise<void>;
    createUserSpace(spaceName: string): () => Promise<void>;
}

export interface Space {
    space_id: string
    space_name: string
    created_by: string
    created_at: string
}

export interface TaskMenuProps {
    task: Task;
    visible: boolean;
    date: string;
    onClose: () => void;
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
}

export type CustomTextProps = {
    content: string;
    size?: number;
    color?: string;
    weight?: 'normal' | 'bold' | '600' | '700' | '400';
    lineThrough?: boolean;
    opacity?: number;
    borderRadius?: number;
    borderColor?: string;
    borderWidth?: number;
    backgroundColor?: string;
    paddingHorizontal?: number;
    textCenter?: boolean;
    style?: ViewStyle;
}

// Типы для базовых компонентов
import { ViewStyle, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface CustomButtonProps {
    variant: 'primary' | 'secondary' | 'service' | 'round' | 'text' | 'reverse';
    title?: string;
    onPress: (event?: GestureResponderEvent) => void;
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    iconSize?: number;
    disabled?: boolean;
    loading?: boolean;
    size?: 'small' | 'medium' | 'large';
    style?: ViewStyle;
    titleColor?: string;
    buttonColor?: string;
    borderColor?: string;
    borderWidth?: number;
    hitSlop?: number;
    activeOpacity?: number;
    isVisible?: boolean; // для reverse варианта
}

export interface CustomViewProps {
    variant?: 'card' | 'container' | 'row' | 'column' | 'center' | 'flex';
    padding?: number | 'small' | 'medium' | 'large' | 'none';
    margin?: number | 'small' | 'medium' | 'large' | 'none';
    backgroundColor?: string;
    borderRadius?: number | 'small' | 'medium' | 'large';
    borderWidth?: number;
    borderColor?: string;
    shadowEnabled?: boolean;
    flex?: number;
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    style?: ViewStyle;
    children: React.ReactNode;
}

export interface CustomTouchableProps {
    onPress: (event?: GestureResponderEvent) => void;
    disabled?: boolean;
    activeOpacity?: number;
    hitSlop?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    style?: ViewStyle;
    children: React.ReactNode;
    padding?: number | 'small' | 'medium' | 'large' | 'none';
    margin?: number | 'small' | 'medium' | 'large' | 'none';
    borderRadius?: number;
    backgroundColor?: string;
    borderWidth?: number;
    borderColor?: string;
    flex?: number;
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
}