import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import CustomTouchable from './base/CustomTouchable';
import Gigabar from './Gigabar';
import CustomButton from './base/CustomButton';
import CustomText from './base/CustomText';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TaskItemProps } from '@/types/types';
import { observer } from '@legendapp/state/react';
import { useTheme } from '@/providers/ThemeProvider';
import { router } from 'expo-router';
import { getTaskStateForDate, tasks$ } from '@/Supabase/utils/SupaLegend';
import useRandomMeme from '@/hooks/useRandomMeme';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Confetti from './Confetti';

const TaskItem: React.FC<TaskItemProps> = observer(({ task, date, onToggleTaskCompletion }) => {
  const { theme } = useTheme();
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentMeme, setCurrentMeme] = useState<any>(null);
  const getRandomMeme = useRandomMeme();

  // Дублирование чтобы состояние нормально обновлялось, а то из-за ебанного getTaskStateForDate не работало нормально
  const reactiveTask = tasks$[task.id];

  // Тут состояние задачи нормально вычисляется, может можно сделать попроще
  const completed = reactiveTask?.is_repeating?.get()
    ? (() => {
      const overrides = reactiveTask.overrides?.get() || [];
      const override = overrides.find((o) => o.date === date);
      return override ? override.completed : false;
    })()
    : reactiveTask?.status?.get() || false;

  const deleted = reactiveTask?.is_repeating?.get()
    ? (() => {
      const overrides = reactiveTask.overrides?.get() || [];
      const override = overrides.find((o) => o.date === date);
      return override ? override.deleted : false;
    })()
    : reactiveTask?.deleted?.get() || false;

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
    // Если задача не была выполнена и мы её выполняем - показываем анимацию
    if (!completed) {
      const meme = getRandomMeme();
      setCurrentMeme(meme);
      setShowAnimation(true);

      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withTiming(1, { duration: 500 });

      // Вызываем изменение состояния сразу
      onToggleTaskCompletion(task.id, date);

      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 });
        scale.value = withTiming(0.5, { duration: 500 });
        setTimeout(() => {
          setShowAnimation(false);
          setCurrentMeme(null);
        }, 500);
      }, 2000);
    } else {
      // Если задача выполнена и мы её снимаем с выполнения - просто меняем состояние
      onToggleTaskCompletion(task.id, date);
    }
  };



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
          <Image source={currentMeme} style={{ width: 250, height: 250, borderRadius: 20 }} />
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
});

export default TaskItem;