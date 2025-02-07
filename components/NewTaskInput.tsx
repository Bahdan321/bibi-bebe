import React from "react";
import { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";
import Gigabar from "./Gigabar";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const NewTaskInput: React.FC<{ onAddTask: (text: string) => void }> = ({ onAddTask }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        if (inputValue.trim() !== '') {
            onAddTask(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <View>
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
            <Gigabar color="gray" size={1} marginHorizontal={6} />
        </View>
    );
};

const styles = StyleSheet.create({
    taskText: {
        fontWeight: '700',
        fontSize: hp("2.2"),
        color: "white"
    }
});

export default NewTaskInput;