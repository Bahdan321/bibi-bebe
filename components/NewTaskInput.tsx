import React from "react";
import { useState } from "react";
import { TextInput, StyleSheet } from "react-native";

const NewTaskInput: React.FC<{ onAddTask: (text: string) => void }> = ({ onAddTask }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        if (inputValue.trim() !== '') {
            onAddTask(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <TextInput
            style={styles.taskText}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSubmit}
            // onBlur={handleSubmit}
            // placeholder="Че делать будем?"
            placeholderTextColor="gray"
            underlineColorAndroid="transparent"
        />
    );
};

const styles = StyleSheet.create({
    taskText: {
        fontWeight: '400',
        fontSize: 18,
        color: "white"
    }
});

export default NewTaskInput;