import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Task } from '@/types/types';
import { updateTaskTitle } from '@/Supabase/utils/SupaLegend';
import CustomText from './base/CustomText';
import CustomTouchable from './base/CustomTouchable';

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
          color={subtask.status ? theme.colors.icon : theme.colors.text}
        />
      </CustomTouchable>
      {isEditing ? (
        <TextInput
          style={{
            color: theme.colors.text,
            fontSize: hp('2'),
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
            size={hp('2')}
            color={subtask.status ? theme.colors.secondary : theme.colors.text}
            lineThrough={subtask.status}
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