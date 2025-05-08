import { CustomTextProps } from '@/types/types';
import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';

const CustomText: React.FC<CustomTextProps> = ({
    content,
    size,
    color,
    weight,
    lineThrough = false,
    opacity = 1,
    borderRadius = 1,
    borderColor,
    borderWidth,
    backgroundColor,
    paddingHorizontal = 0

}) => {
    const validatedOpacity = Math.min(Math.max(opacity, 0), 1);
    const textStyle: TextStyle = {
        fontSize: size,
        color: color,
        fontWeight: weight,
        textDecorationLine: lineThrough ? 'line-through' : 'none',
        opacity: validatedOpacity,
        borderRadius: borderRadius,
        paddingHorizontal: paddingHorizontal,
    };

    const viewStyle: ViewStyle = {
        backgroundColor: backgroundColor,
        borderWidth: borderWidth,
        borderColor: borderColor,
        borderRadius: borderRadius,
        padding: borderWidth ? 5 : 2,
        alignSelf: 'flex-start', // Make the View wrap the Text content
    };

    return (
        <View style={viewStyle}>
            <Text style={textStyle}>{content}</Text>
        </View>
    )
};

export default CustomText;