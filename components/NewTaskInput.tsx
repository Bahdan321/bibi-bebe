import React from "react";
import { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";
import Gigabar from "./Gigabar";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '@/providers/ThemeProvider';

// const NewTaskInput: React.FC<{ onAddTask: (text: string) => void }> = ({ onAddTask }) => {
const NewTaskInput: React.FC<{ onAddTask: (text: string) => void }> = ({ onAddTask }) => {
    const [inputValue, setInputValue] = useState('');
    const { theme } = useTheme();

    const handleSubmit = () => {
        // console.log('Добавляем задачу:', inputValue);
        if (inputValue.trim() !== '') {
            onAddTask(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <View>
            <TextInput
                style={{ fontWeight: '700', fontSize: hp("2.2"), color: theme.colors.text }}
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