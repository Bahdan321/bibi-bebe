import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

type ButtonProps = {
    title: string;
    titleColor: string;
    buttonColor: string;
    onPress: () => void;
    style?: ViewStyle
}

const Button: React.FC<ButtonProps> = ({ title, titleColor, buttonColor, onPress, style }) => {
    return (
        <TouchableOpacity
            style={[styles.button,{ backgroundColor: buttonColor }]}
            onPress={onPress}
        >
            <Text style={[styles.text,{color:titleColor}]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: { 
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: { 
        fontSize: 16,
    },
});

export default Button;