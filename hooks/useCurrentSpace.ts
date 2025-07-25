import { useAuth } from '@/providers/AuthProvider';
import { useState, useEffect } from 'react';
import { getSpace } from '@/storages/spaceStorage';
import { Space } from '@/types/types';

/**
 * Хук для получения ID текущего пространства
 * @returns ID текущего пространства или null
 */
export const useCurrentSpaceId = (): string | null => {
    const { user } = useAuth();
    return user?.current_space_id || null;
};

/**
 * Хук для получения полной информации о текущем пространстве
 * @returns Объект пространства или null
 */
export const useCurrentSpace = (): Space | null => {
    const { user } = useAuth();
    const [space, setSpace] = useState<Space | null>(null);

    useEffect(() => {
        const loadSpace = async () => {
            if (user?.current_space_id) {
                try {
                    const spaceData = await getSpace();
                    if (spaceData && spaceData.space_id === user.current_space_id) {
                        setSpace(spaceData);
                    } else {
                        setSpace(null);
                    }
                } catch (error) {
                    console.error('Ошибка при загрузке пространства:', error);
                    setSpace(null);
                }
            } else {
                setSpace(null);
            }
        };

        loadSpace();
    }, [user?.current_space_id]);

    return space;
};