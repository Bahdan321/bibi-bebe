import React from 'react';
import { Text, TextStyle } from 'react-native';

type CustomTextProps = {
    content: string;
    size: number;
    color: string;
    weight: 'normal' | 'bold' | '600' | '700';
}

const CustomText: React.FC<CustomTextProps> = ({ content, size, color, weight }) => {
    const textStyle: TextStyle = {
        fontSize: size,
        color: color,
        fontWeight: weight,
    };

    return <Text style={textStyle}>{content}</Text>;
};

export default CustomText;