import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Gigabar from './Gigabar';
import RoundButton from './RoundButton';
import CustomText from './CustomText';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TaskItemProps } from '@/types/types';
import { observer } from '@legendapp/state/react';
import { useTheme } from '@/providers/ThemeProvider';

const TaskItem: React.FC<TaskItemProps> = observer(({ task, onToggleTaskCompletion }) => {
  const { theme } = useTheme();

  const truncateTask = (text: string) => {
    const maxLength = 27;
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  const handleTextPress = () => {
    console.log('123');
  };

  return (
    <View style={{ flexDirection: 'column', marginHorizontal: 6 }}>
      <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={handleTextPress} style={{ flex: 1 }}>
          <CustomText
            content={truncateTask(task.text)}
            size={hp('2.2')}
            color={task.done ? theme.colors.secondary : theme.colors.text} // Изменено с completed на done
            weight="700"
            lineThrough={task.done} // Изменено с completed на done
            opacity={task.done ? 0.6 : 1} // Изменено с completed на done
          />
        </TouchableOpacity>
        <RoundButton
          iconName={'checkmark-outline'}
          iconColor={task.done ? theme.colors.secondary : theme.colors.text} // Изменено с completed на done
          buttonColor={task.done ? 'transparent' : 'transparent'} // Изменено с completed на done
          borderColor={task.done ? theme.colors.secondary : theme.colors.text} // Изменено с completed на done
          borderWidth={1.5}
          onPress={() => { onToggleTaskCompletion(task.id) }} // Изменено с number на string
          size={hp('3.5')}
          hitSlop={10}
        />
      </View>
      <Gigabar color="gray" size={1} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
    marginBottom: 15,
    borderRadius: 4,
  },
});

export default TaskItem;