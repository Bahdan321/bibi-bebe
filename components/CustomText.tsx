import React from 'react';
import { Text, TextStyle } from 'react-native';

type CustomTextProps = {
    content: string;
    size: number;
    color: string;
    weight: 'normal' | 'bold' | '600' | '700' | '400';
    lineThrough?: boolean;
    opacity?: number;
}

const CustomText: React.FC<CustomTextProps> = ({
    content,
    size,
    color,
    weight,
    lineThrough = false,
    opacity = 1,
}) => {
    const validatedOpacity = Math.min(Math.max(opacity, 0), 1);

    const textStyle: TextStyle = {
        fontSize: size,
        color: color,
        fontWeight: weight,
        textDecorationLine: lineThrough ? 'line-through' : 'none',
        opacity: validatedOpacity,
    };

    return <Text style={textStyle}>{content}</Text>;
};

export default CustomText;