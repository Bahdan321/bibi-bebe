import React, { useState } from "react";
import { TextInput, StyleSheet, View, ViewStyle, Text } from 'react-native';
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
    error?: string;
    onBlur?: () => void;
}

const TextInputField: React.FC<TextInputFieldProps> = ({ 
    label, 
    labelColor, 
    borderColor, 
    textColor, 
    value, 
    onChangeText, 
    secureTextEntry = false, 
    style, 
    error, 
    onBlur 
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error;

    return (
        <View style={styles.wrapper}>
            <View 
                style={[
                    styles.container, 
                    style, 
                    { borderColor: hasError ? '#FF3B30' : borderColor },
                    hasError ? styles.errorContainer : {}
                ]}
            >
                <CustomText
                    content={label}
                    size={isFocused || value ? "xs" : "md"}
                    color={hasError ? '#FF3B30' : (labelColor || '#B0B0B0')}
                    style={[styles.labelContainer, {
                        top: isFocused || value ? 5 : 15,
                    } as any]}
                />
                <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        if (onBlur) onBlur();
                    }}
                />
            </View>
            {hasError && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 15,
    },
    container: {
        position: 'relative',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#2A2A2A',
    },
    errorContainer: {
        borderWidth: 1,
    },
    labelContainer: {
        position: 'absolute',
        left: 10,
    },
    input: {
        height: 40,
        fontSize: 16, // md размер из theme.fontSize
        paddingTop: 15, // Отступ для текста, чтобы не перекрывать лейбл
        paddingHorizontal: 10,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 10,
    },
});

export default TextInputField;