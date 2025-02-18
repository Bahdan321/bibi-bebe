import React from 'react';
import { TouchableOpacity, ViewStyle,StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ReverseButtonProps = {
    isVisible: boolean;
    onPress: () => void;
    style?: ViewStyle;
}

const ReverseButton: React.FC<ReverseButtonProps> = ({ isVisible, onPress, style }) => {
    const iconName = isVisible ? 'eye-off' : 'eye';
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Ionicons name={iconName} size={24} color="gray" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 8,
    },
});

export default ReverseButton;