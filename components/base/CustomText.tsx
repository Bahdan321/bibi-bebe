import { CustomTextProps } from '@/types/types';
import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

const CustomText: React.FC<CustomTextProps> = ({
    content,
    size = 'md',
    color,
    weight = 'normal',
    lineThrough = false,
    opacity = 1,
    borderRadius = 'sm',
    borderColor,
    borderWidth,
    backgroundColor,
    paddingHorizontal = 0,
    textCenter = false,
    style,
}) => {
    const { theme } = useTheme();
    const validatedOpacity = Math.min(Math.max(opacity, 0), 1);

    // Resolve size value
    const fontSize = typeof size === 'number' ? size : theme.fontSize[size];

    // Resolve borderRadius value
    const resolvedBorderRadius = typeof borderRadius === 'number' ? borderRadius : theme.borderRadius[borderRadius];

    // Resolve fontWeight value
    const fontWeight = theme.fontWeight[weight];

    const textStyle: TextStyle = {
        fontSize: fontSize,
        color: color,
        fontWeight: fontWeight,
        textDecorationLine: lineThrough ? 'line-through' : 'none',
        opacity: validatedOpacity,
        paddingHorizontal: paddingHorizontal,
        textAlign: textCenter ? 'center' : 'auto',
    };

    const viewStyle: ViewStyle = {
        backgroundColor: backgroundColor,
        borderWidth: borderWidth,
        borderColor: borderColor,
        borderRadius: resolvedBorderRadius,
        padding: borderWidth ? theme.spacing.xs : 0,
        alignSelf: textCenter ? 'center' : 'flex-start',
        opacity: validatedOpacity,
    };

    const combinedViewStyle = [viewStyle, style];

    return (
        <View style={combinedViewStyle}>
            <Text style={textStyle}>{content}</Text>
        </View>
    )
};

export default CustomText;