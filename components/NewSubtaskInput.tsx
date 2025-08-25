import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Gigabar from './Gigabar';
import { useTheme } from '@/providers/ThemeProvider';
import CustomTextInput from './base/CustomTextInput';
import { useTranslation } from 'react-i18next';

interface NewSubtaskInputProps {
  parentTaskId: string;
  spaceId: string;
  userId: string;
  date: string;
  onAddSubtask: (title: string) => void;
  closeAllDropdowns?: () => void; // Добавляем проп для закрытия dropdown
}

const NewSubtaskInput: React.FC<NewSubtaskInputProps> = ({ parentTaskId, spaceId, userId, date, onAddSubtask, closeAllDropdowns }) => {
  const [inputValue, setInputValue] = useState('');
  const { theme } = useTheme();
  const { t } = useTranslation();

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
        placeholder={t('tasks.addSubtask')}
        placeholderTextColor={theme.colors.background}
        underlineColorAndroid="transparent"
        onFocus={closeAllDropdowns} // Закрываем все dropdown при фокусе на поле
      />
      {/* <Gigabar color={theme.colors.background} size={1} marginHorizontal={6} /> */}
    </View>
  );
};

export default NewSubtaskInput;