import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Gigabar from './Gigabar';
import RoundButton from './RoundButton';
import CustomText from './CustomText';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TaskItemProps } from '@/types/types';
import { observer } from '@legendapp/state/react';
import { useTheme } from '@/providers/ThemeProvider';
import TaskMenu from './TaskMenu';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';

const TaskItem: React.FC<TaskItemProps> = observer(({ task, date, onToggleTaskCompletion }) => {
  const { theme } = useTheme();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const truncateTask = (text: string) => {
    const maxLength = 25;
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  const handleTextPress = () => {
    console.log('Task text pressed:', task);
    router.push({
      pathname: '/(private)/taskMenu',
      params: {
        task: JSON.stringify(task),
        date: date,
      },
    });
    // setIsMenuVisible(true);
    // bottomSheetRef.current?.expand();
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
    // bottomSheetRef.current?.close();
  };

  return (
    <View style={{ flexDirection: 'column', marginHorizontal: 6 }}>
      <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={handleTextPress} style={{ flex: 1 }}>
          <CustomText
            content={truncateTask(task.title)}
            size={hp('2.2')}
            color={task.status ? theme.colors.secondary : theme.colors.text}
            weight="700"
            lineThrough={task.status}
            opacity={task.status ? 0.6 : 1}
          />
        </TouchableOpacity>
        <RoundButton
          iconName={'checkmark-outline'}
          iconColor={task.status ? theme.colors.third : theme.colors.text}
          buttonColor={theme.colors.primary}
          borderColor={task.status ? theme.colors.third : theme.colors.text}
          borderWidth={1.5}
          onPress={() => { onToggleTaskCompletion(task.id) }}
          size={hp('3.5')}
          hitSlop={10}
        />
      </View>
      <Gigabar color="gray" size={1} />
      <TaskMenu
        task={task}
        visible={isMenuVisible}
        onClose={handleCloseMenu}
        date={date}
      />
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
