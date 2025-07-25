import { useAuth } from '@/providers/AuthProvider';
import { User } from '@/types/types';

/**
 * Хук для получения текущего пользователя
 * @returns Объект пользователя или null, если не аутентифицирован
 */
export const useCurrentUser = (): User | null => {
    const { user } = useAuth();
    return user;
};

/**
 * Хук для получения ID текущего пользователя
 * @returns ID пользователя или null, если не аутентифицирован
 */
export const useCurrentUserId = (): string | null => {
    const { user } = useAuth();
    return user?.user_id || null;
};