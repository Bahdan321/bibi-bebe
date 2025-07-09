import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/types/types';
import { updateTaskTitle } from '@/Supabase/utils/SupaLegend';
import CustomText from './base/CustomText';
import CustomTouchable from './base/CustomTouchable';
import CustomTextInput from './base/CustomTextInput';

interface SubtaskItemProps {
  subtask: Task;
  onToggleSubtaskCompletion: (subtaskId: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, onToggleSubtaskCompletion, onDeleteSubtask }) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(subtask.title);

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditEnd = () => {
    if (editedTitle.trim() !== '') {
      updateTaskTitle(subtask.id, editedTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomTouchable onPress={() => onToggleSubtaskCompletion(subtask.id)} style={styles.checkbox}>
        <Ionicons
          name={subtask.status ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={subtask.status ? theme.colors.finishedTask : theme.colors.unfinishedTask}
        />
      </CustomTouchable>
      {isEditing ? (
        <CustomTextInput
          variant="default"
          style={{
            color: theme.colors.text,
            marginLeft: 10,
            flex: 1,
            flexWrap: 'wrap', // Для переноса текста
          }}
          value={editedTitle}
          onChangeText={setEditedTitle}
          onBlur={handleEditEnd}
          onSubmitEditing={handleEditEnd}
          autoFocus
          multiline // Разрешаем многострочный ввод
        />
      ) : (
        <CustomTouchable
          onPress={handleEditStart}
          style={{
            marginLeft: 10,
            flex: 1,
          }}
        >
          <CustomText
            content={subtask.title}
            size="sm"
            color={subtask.status ? theme.colors.secondary : theme.colors.text}
            lineThrough={subtask.status}
            opacity={subtask.status ? 0.6 : 1}
            style={{
              flexWrap: 'wrap', // Для переноса текста
            }}
          />
        </CustomTouchable>
      )}
      <CustomTouchable onPress={() => onDeleteSubtask(subtask.id)} style={styles.deleteButton}>
        <Ionicons name="close-circle" size={24} color={theme.colors.text} />
      </CustomTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between',
  },
  checkbox: {
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
});

export default SubtaskItem;