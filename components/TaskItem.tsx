import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import CustomTouchable from './base/CustomTouchable';
import Gigabar from './Gigabar';
import CustomButton from './base/CustomButton';
import CustomText from './base/CustomText';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TaskItemProps } from '@/types/types';
import { observer } from '@legendapp/state/react';
import { useTheme } from '@/providers/ThemeProvider';
import { router } from 'expo-router';
import { getTaskStateForDate, tasks$, finishDelete } from '@/Supabase/utils/SupaLegend';
import useRandomMeme from '@/hooks/useRandomMeme';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Confetti from './Confetti';

// Для LayoutAnimation
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TaskItem: React.FC<TaskItemProps> = observer(({ task, date, onToggleTaskCompletion }) => {
  const { theme } = useTheme();
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentMeme, setCurrentMeme] = useState<any>(null);
  const getRandomMeme = useRandomMeme();

  const reactiveTask = tasks$[task.id];

  const state = getTaskStateForDate(reactiveTask.get(), date);
  const completed = state.completed;
  const deleted = state.deleted;
  const deleting = state.deleting;

  if (deleted) return null;

  // Анимация появления новой задачи (fade-in + slide-down)
  const appearOpacity = useSharedValue(0);
  const appearTranslateY = useSharedValue(20); // Начальный сдвиг вниз для slide эффекта

  useEffect(() => {
    appearOpacity.value = withTiming(1, { duration: 300 });
    appearTranslateY.value = withTiming(0, { duration: 300 });
  }, []); // Запускается только при монтировании (добавлении новой задачи)

  const appearAnimatedStyle = useAnimatedStyle(() => ({
    opacity: appearOpacity.value,
    transform: [{ translateY: appearTranslateY.value }],
  }));

  // Анимация удаления: opacity + height (для сжатия)
  const deleteOpacity = useSharedValue(1);
  const deleteHeight = useSharedValue<'auto' | number>('auto');

  const contentRef = useRef<View>(null);

  const deleteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: deleteOpacity.value,
    height: deleteHeight.value === 'auto' ? 'auto' : deleteHeight.value,
    overflow: 'hidden',
  }));

  useEffect(() => {
    if (deleting) {
      // Анимируем сдвиг списка
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      // Измеряем высоту и анимируем
      contentRef.current?.measure((x, y, width, height) => {
        deleteHeight.value = height; // Текущая высота
        deleteOpacity.value = withTiming(0, { duration: 300 });
        deleteHeight.value = withTiming(0, { duration: 300 }, () => {
          // Завершаем удаление после анимации
          finishDelete(task.id, date);
        });
      });
    }
  }, [deleting, task.id, date]);

  // Твоя существующая анимация для мемов (оставляем как есть)
  const memeOpacity = useSharedValue(0);
  const memeScale = useSharedValue(0.5);

  const memeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: memeOpacity.value,
    transform: [{ scale: memeScale.value }],
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
    if (!completed) {
      const meme = getRandomMeme();
      setCurrentMeme(meme);
      setShowAnimation(true);

      memeOpacity.value = withTiming(1, { duration: 500 });
      memeScale.value = withTiming(1, { duration: 500 });

      onToggleTaskCompletion(task.id, date);

      setTimeout(() => {
        memeOpacity.value = withTiming(0, { duration: 500 });
        memeScale.value = withTiming(0.5, { duration: 500 });
        setTimeout(() => {
          setShowAnimation(false);
          setCurrentMeme(null);
        }, 500);
      }, 2000);
    } else {
      onToggleTaskCompletion(task.id, date);
    }
  };

  return (
    <Animated.View style={[appearAnimatedStyle, { flexDirection: 'column', marginHorizontal: 6 }]}>
      <Animated.View style={deleteAnimatedStyle}>
        <View ref={contentRef} style={[styles.container, { backgroundColor: theme.colors.primary }]}>
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
              memeAnimatedStyle,
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
      </Animated.View>
    </Animated.View>
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