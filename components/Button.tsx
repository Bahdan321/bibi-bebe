import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
    title: string;
    titleColor: string;
    buttonColor: string;
    onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, titleColor, buttonColor, onPress }) => {
    return (
        <TouchableOpacity
            style={{ backgroundColor: buttonColor }}
            onPress={onPress}

        >
            <Text style={{ color: titleColor }}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default Button;