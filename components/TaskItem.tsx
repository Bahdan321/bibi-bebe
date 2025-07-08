import React, { useRef, useState } from 'react';
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
import { supabase, toggleTaskCompletion } from '@/Supabase/utils/SupaLegend';
import useRandomMeme from '@/hooks/useRandomMeme';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Confetti from './Confetti';

const TaskItem: React.FC<TaskItemProps> = observer(({ task, date, onToggleTaskCompletion }) => {
  const { theme } = useTheme();
  const [showAnimation, setShowAnimation] = useState(false);
  const getRandomMeme = useRandomMeme();

  console.log('TaskItem rendered for task:', task);
  console.log('TaskItem rendered for task JSON:', JSON.stringify(task));

  // Анимированные значения для мема
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

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
  };

  const taskBorderColor = (isUrgent: boolean, isImportant: boolean) => {
    if (isUrgent && isImportant) {
      return theme.eisenhowerMatrix.urgentImportant;
    } else if (!isUrgent && isImportant) {
      return theme.eisenhowerMatrix.notUrgentImportant;
    } else if (isUrgent && !isImportant) {
      return theme.eisenhowerMatrix.urgentNotImportant;
    }
  };

  const handleToggleCompletion = async () => {
    onToggleTaskCompletion(task.id);
    if (task.status && !showAnimation) {
      setShowAnimation(true);
      opacity.value = withTiming(1, { duration: 500 }); // Появление
      scale.value = withTiming(1, { duration: 500 });
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 }); // Исчезновение
        scale.value = withTiming(0.5, { duration: 500 });
        setTimeout(() => setShowAnimation(false), 500); // Убираем после анимации
      }, 2000); // Мем виден 2 секунды
    }
  };

  return (
    <View style={{ flexDirection: 'column', marginHorizontal: 6 }}>
      <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
        <CustomTouchable onPress={handleTextPress} style={{ flex: 1 }}>
          <CustomText
            content={truncateTask(task.title)}
            size="sm"
            color={task.status ? theme.colors.secondary : theme.colors.text}
            weight="bold"
            lineThrough={task.status}
            opacity={task.status ? 0.6 : 1}
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
          iconColor={task.status ? theme.colors.third : theme.colors.text}
          onPress={handleToggleCompletion}
          style={{
            backgroundColor: theme.colors.primary,
            borderColor: task.status ? theme.colors.third : theme.colors.text,
            borderWidth: 1.5,
            width: 28,
            height: 28
          }}
          hitSlop={10}
        />
      </View>
      <Gigabar color="gray" size={1} />
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
          <Image
            source={getRandomMeme}
            style={{ width: 250, height: 250, borderRadius: 20, }}
          />
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
    fontSize: 12, // xs размер из theme.fontSize
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default TaskItem;