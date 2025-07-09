import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Gigabar from './Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import CustomTextInput from './base/CustomTextInput';

interface NewSubtaskInputProps {
  parentTaskId: string;
  spaceId: string;
  userId: string;
  date: string;
  onAddSubtask: (title: string) => void;
}

const NewSubtaskInput: React.FC<NewSubtaskInputProps> = ({ parentTaskId, spaceId, userId, date, onAddSubtask }) => {
  const [inputValue, setInputValue] = useState('');
  const { theme } = useTheme();

  const handleSubmit = () => {
    if (inputValue.trim() !== '') {
      onAddSubtask(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <View>
      <CustomTextInput
        variant="default"
        style={{ fontWeight: '400', color: theme.colors.text }}
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={handleSubmit}
        placeholder="Добавить подзадачу"
        placeholderTextColor={theme.colors.background}
        underlineColorAndroid="transparent"
      />
      {/* <Gigabar color={theme.colors.background} size={1} marginHorizontal={6} /> */}
    </View>
  );
};

export default NewSubtaskInput;