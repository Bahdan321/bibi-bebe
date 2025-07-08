import React, { useState } from "react";
import { TextInput, StyleSheet, View, ViewStyle } from 'react-native';
import CustomText from '@/components/base/CustomText';

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

const TextInputField: React.FC<TextInputFieldProps> = ({ label, labelColor, borderColor, textColor, value, onChangeText, secureTextEntry = false, style }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, style, { borderColor }]}>
            <CustomText
                content={label}
                size={isFocused || value ? 12 : 16}
                color={labelColor || '#B0B0B0'}
                style={[styles.labelContainer, {
                    top: isFocused || value ? 5 : 15, // Позиция лейбла
                }]}
            />
            <TextInput
                style={[styles.input, { color: textColor }]}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#2A2A2A',
        marginBottom: 15,
    },
    labelContainer: {
        position: 'absolute',
        left: 10,
    },
    input: {
        height: 40,
        fontSize: 16,
        paddingTop: 15, // Отступ для текста, чтобы не перекрывать лейбл
        paddingHorizontal: 10,
    },
});

export default TextInputField;