import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import CustomTouchable from './base/CustomTouchable';
import Gigabar from './Gigabar';
import CustomButton from './base/CustomButton';
import CustomText from './base/CustomText';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TaskItemProps } from '@/types/types';
import { observer } from '@legendapp/state/react';
import { useTheme } from '@/providers/ThemeProvider';
import TaskMenu from './TaskMenu';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { supabase, toggleTaskCompletion, getTaskStateForDate } from '@/Supabase/utils/SupaLegend';
import useRandomMeme from '@/hooks/useRandomMeme';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Confetti from './Confetti';

const TaskItem: React.FC<TaskItemProps> = observer(({ task, date, onToggleTaskCompletion }) => {
  const { theme } = useTheme();
  const [showAnimation, setShowAnimation] = useState(false);
  const getRandomMeme = useRandomMeme();
  const prevCompletedRef = useRef<boolean | null>(null); // Хранит предыдущее состояние completed

  const { completed, deleted } = getTaskStateForDate(task, date);
  if (deleted) return null;

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const truncateTask = (text: string) => {
    const maxLength = 25;
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const handleTextPress = () => {
    router.push({
      pathname: '/(private)/taskMenu',
      params: {
        task: JSON.stringify(task),
        date: date,
      },
    });
  };

  const taskBorderColor = (isUrgent: boolean, isImportant: boolean) => {
    if (isUrgent && isImportant) return theme.eisenhowerMatrix.urgentImportant;
    if (!isUrgent && isImportant) return theme.eisenhowerMatrix.notUrgentImportant;
    if (isUrgent && !isImportant) return theme.eisenhowerMatrix.urgentNotImportant;
  };

  const handleToggleCompletion = async () => {
    onToggleTaskCompletion(task.id, date);
  };

  useEffect(() => {
    const currentCompleted = completed;

    // Проверяем переход из false в true
    if (prevCompletedRef.current === false && currentCompleted === true && !showAnimation) {
      setShowAnimation(true);
      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withTiming(1, { duration: 500 });
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 });
        scale.value = withTiming(0.5, { duration: 500 });
        setTimeout(() => setShowAnimation(false), 500);
      }, 2000);
    }

    // Обновляем предыдущее состояние
    prevCompletedRef.current = currentCompleted;
  }, [completed]);

  return (
    <View style={{ flexDirection: 'column', marginHorizontal: 6 }}>
      <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
        <CustomTouchable onPress={handleTextPress} style={{ flex: 1 }}>
          <CustomText
            content={truncateTask(task.title)}
            size="md"
            color={completed ? theme.colors.secondary : theme.colors.unfinishedTask}
            weight="bold"
            lineThrough={completed}
            opacity={completed ? 0.6 : 1}
            paddingHorizontal={2}
            borderRadius={999}
            borderWidth={task.is_important || task.is_urgent ? 0 : 0}
            borderColor={taskBorderColor(task.is_urgent, task.is_important)}
            backgroundColor={taskBorderColor(task.is_urgent, task.is_important)}
          />
        </CustomTouchable>
        <CustomButton
          variant="round"
          size="small"
          icon="checkmark-outline"
          iconColor={completed ? theme.colors.finishedTask : theme.colors.unfinishedTask}
          onPress={handleToggleCompletion}
          style={{
            opacity: completed ? 0.5 : 1,
            backgroundColor: theme.colors.primary,
            borderColor: completed ? theme.colors.finishedTask : theme.colors.unfinishedTask,
            borderWidth: 1.5,
            width: 28,
            height: 28,
          }}
          hitSlop={10}
        />
      </View>
      <Gigabar color={completed ? theme.colors.finishedTask : theme.colors.unfinishedTask} size={1} />
      {showAnimation && (
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              top: 8,
              left: wp("15%"),
              zIndex: 1000,
            },
          ]}
        >
          <Image source={getRandomMeme} style={{ width: 250, height: 250, borderRadius: 20 }} />
          <Confetti />
        </Animated.View>
      )}
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
  rewardIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rewardText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default TaskItem;