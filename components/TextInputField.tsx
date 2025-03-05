import React from "react";
import { TextInput, StyleSheet, View, Text, ViewStyle } from 'react-native';

type TextInputFieldProps = {
    label: string;
    labelColor?: string;
    borderColor: string;
    textColor: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    style?: ViewStyle | ViewStyle[];
}

const TextInputField: React.FC<TextInputFieldProps> = ({ label, labelColor, borderColor,textColor, value, onChangeText, secureTextEntry = false, style }) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.label,{color: labelColor}]}>{label}</Text>
            <TextInput
                style={[styles.input, {borderColor: borderColor, color:textColor}]}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        color: '#333',
    },
    borderColor:{
        fontSize: 2,
        borderColor: "white",
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});

export default TextInputField;