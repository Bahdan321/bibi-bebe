import { useEffect } from 'react';
import { useCurrentSpaceId } from './useCurrentSpace';
import { setCurrentSpaceId } from '@/Supabase/utils/SupaLegend';

/**
 * Хук для автоматической инициализации tasks$ при изменении текущего пространства
 */
export const useTasksInitializer = () => {
    const currentSpaceId = useCurrentSpaceId();

    useEffect(() => {
        console.log('Обновление currentSpaceId$ для пространства:', currentSpaceId);
        setCurrentSpaceId(currentSpaceId);
    }, [currentSpaceId]);
};