import React from "react";
import { TextInput, StyleSheet, View, Text } from 'react-native';

type TextInputFieldProps = {
    label: string;
    value: string;
    onChangeText: (text:string) => void;
    secureTextEntry?: boolean;
}

const TextInputField: React.FC<TextInputFieldProps> = ({ label, value, onChangeText, secureTextEntry = false }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
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
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});
export default TextInputField;