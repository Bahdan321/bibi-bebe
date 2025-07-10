import React from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Gigabar from "./Gigabar";
import { useTheme } from '@/providers/ThemeProvider';
import CustomTextInput from './base/CustomTextInput';

// const NewTaskInput: React.FC<{ onAddTask: (text: string) => void }> = ({ onAddTask }) => {
const NewTaskInput: React.FC<{ onAddTask: (text: string) => void }> = ({ onAddTask }) => {
    const [inputValue, setInputValue] = useState('');
    const { theme } = useTheme();

    const handleSubmit = () => {
        console.log('Добавляем задачу:', inputValue);
        if (inputValue.trim() !== '') {
            onAddTask(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <View>
            <CustomTextInput
                variant="default"
                style={{ fontWeight: '700', color: theme.colors.text, paddingVertical: 10, paddingLeft: 10, }}
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={handleSubmit}
                // onBlur={handleSubmit}
                // placeholder="Че делать будем?"
                placeholderTextColor={theme.colors.background}
                underlineColorAndroid="transparent"
            />
            <Gigabar color={theme.colors.background} size={1} marginHorizontal={6} />
        </View>
    );
};

const styles = StyleSheet.create({
});

export default NewTaskInput;