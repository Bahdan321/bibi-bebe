import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ReverseButtonProps = {
    isVisible: boolean;
    onPress: () => void;
}

const ReverseButton: React.FC<ReverseButtonProps> = ({ isVisible, onPress }) => {
    const iconName = isVisible ? 'eye-off' : 'eye';
    return (
        <TouchableOpacity onPress={onPress}>
            <Ionicons name={iconName} size={24} color="gray" />
        </TouchableOpacity>
    );
};

export default ReverseButton;