import AsyncStorage from '@react-native-async-storage/async-storage';

const FRAME_ENABLED_KEY = 'frame_enabled';

export const saveFrameEnabled = async (enabled: boolean) => {
  try {
    await AsyncStorage.setItem(FRAME_ENABLED_KEY, enabled ? '1' : '0');
  } catch (error) {
    console.error('Error saving frame enabled:', error);
  }
};

export const getFrameEnabled = async (): Promise<boolean | null> => {
  try {
    const v = await AsyncStorage.getItem(FRAME_ENABLED_KEY);
    if (v === null) return null;
    return v === '1';
  } catch (error) {
    console.error('Error getting frame enabled:', error);
    return null;
  }
};