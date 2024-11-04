import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface CircleButtonProps {
    onPress: () => void;
    iconName?: string;
    buttonColor?: string;
    iconColor?: string;
    size?: number
}

export const CircleButton: React.FC<CircleButtonProps> = ({ onPress, iconName = "close", buttonColor = 'white', iconColor = 'black', size = 50 }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="rounded-full p-4"
            style={{ backgroundColor: buttonColor, height: size, width: size }}
        >
            <View className='flex items-center justify-center'>
                <MaterialIcons name={iconName} size={24} color={iconColor} />
            </View>
        </TouchableOpacity>
    );
}
