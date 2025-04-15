import { Space } from '@/types/types';
import * as SecureStore from 'expo-secure-store';

export async function saveSpace(space: Space) {
    await SecureStore.setItemAsync('current_space', JSON.stringify(space));
}

export async function getSpace() {
    const spaceString = await SecureStore.getItemAsync('current_space');
    if (spaceString) {
        return JSON.parse(spaceString);
    }
    return null;
}

