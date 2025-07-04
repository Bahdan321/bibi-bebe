import { CustomTextProps } from '@/types/types';
import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { FONT_SIZES, FONT_WEIGHTS, SPACING, BORDER_RADIUS } from '@/constants/design';

const CustomText: React.FC<CustomTextProps> = ({
    content,
    size = FONT_SIZES.medium,
    color,
    weight = 'normal',
    lineThrough = false,
    opacity = 1,
    borderRadius = BORDER_RADIUS.small,
    borderColor,
    borderWidth,
    backgroundColor,
    paddingHorizontal = 0,
    textCenter = false,
    style,
}) => {
    const validatedOpacity = Math.min(Math.max(opacity, 0), 1);
    
    const textStyle: TextStyle = {
        fontSize: size,
        color: color,
        fontWeight: FONT_WEIGHTS[weight] || weight,
        textDecorationLine: lineThrough ? 'line-through' : 'none',
        opacity: validatedOpacity,
        paddingHorizontal: paddingHorizontal,
        textAlign: textCenter ? 'center' : 'auto',
    };

    const viewStyle: ViewStyle = {
        backgroundColor: backgroundColor,
        borderWidth: borderWidth,
        borderColor: borderColor,
        borderRadius: borderRadius,
        padding: borderWidth ? SPACING.xs : SPACING.xxs,
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