import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Task, TaskMenuProps } from '@/types/types';
import {
  toggleTaskRemove,
  toggleDublicateTask,
  toggleTaskCompletion,
  changeEisenhowerMatrixStatus,
  toggleTaskChangeDisplayDate,
  addTask,
  addReward,
  tasks$,
} from '@/Supabase/utils/SupaLegend';
import { getFormatedDateOfYear } from '@/utils/DateUtils';
import TimePickerModal from './TimePickerModal';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DropdownMenu from './DropdownMenu';
import CalendarModal from './CalendarModal';
import { router } from 'expo-router';
import NewSubtaskInput from './NewSubtaskInput';
import SubtaskItem from './SubtaskItem';
import { v4 as uuidv4 } from 'uuid';
import { observe } from '@legendapp/state';

const TaskMenu: React.FC<TaskMenuProps> = ({
  task,
  visible,
  date,
  onClose,
  title,
  setTitle,
  description,
  setDescription,
}) => {
  const { theme } = useTheme();

  const [taskStatusCopy, setTaskStatusCopy] = useState(task.status);
  const [taskStatusColor, setTaskStatusColor] = useState(
    task.status ? theme.colors.icon : theme.colors.text,
  );
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isMainDropdownVisible, setIsMainDropdownVisible] = useState(false);
  const [isEisenhowerMatrixDropdownVisible, setIsEisenhowerMatrixDropdownVisible] = useState(false);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [rewardNameInput, setRewardNameInput] = useState(task.reward);
  const [taskRewardCopy, setTaskRewardCopy] = useState(task.reward);

  const borderAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (task.reward && !task.status) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    }
  }, [task.reward, task.status, borderAnim]);

  const animatedRewardStyle = {
    borderWidth: borderAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 3],
    }),
    borderColor: theme.colors.primary,
  };

  useEffect(() => {
    const updateSubtasks = () => {
      const allTasks = tasks$.get();
      const subtasksList = Object.values(allTasks).filter((t) => t.parent_task_id === task.id);
      setSubtasks(subtasksList);
    };
    updateSubtasks();

    const dispose = observe(() => {
      const allTasks = tasks$.get();
      const subtasksList = Object.values(allTasks).filter((t) => t.parent_task_id === task.id);
      setSubtasks(subtasksList);
    });

    return () => dispose();
  }, [task.id]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const due = new Date(task.due_date);
      if (isNaN(due.getTime())) {
        setTimeLeft('Некорректная дата');
        return;
      }

      const diffMs = due.getTime() - now.getTime();
      if (diffMs < 0) {
        setTimeLeft('Срок истёк');
        return;
      }

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`Осталось ${diffDays} дн. ${diffHours} ч. ${diffMinutes} мин.`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [task.due_date]);

  const handleDateChange = () => setIsCalendarVisible(true);

  const handleCalendarApply = (selectedDate: Date) => {
    if (isNaN(selectedDate.getTime())) return;

    const displayDate = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1,
    ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

    toggleTaskChangeDisplayDate(task.id, displayDate);
    setIsCalendarVisible(false);
    router.dismissTo('/(private)/home');
  };

  const handleDuplicate = () => {
    toggleDublicateTask(
      task.title,
      task.space_id,
      task.user_id,
      task.due_date,
      task.display_date,
      task.status,
      task.description,
      task.parent_task_id,
      task.created_at,
      task.updated_at,
      task.completion_date,
      task.is_repeating,
      task.repeat_interval,
      task.planning_period,
      task.is_urgent,
      task.is_important,
      task.reward,
      task.is_anime_task,
      task.id,
      subtasks,
    );
    onClose();
  };

  const handleDelete = () => {
    toggleTaskRemove(task.id);
    subtasks.forEach((subtask) => toggleTaskRemove(subtask.id));
    onClose();
  };

  const handleTaskToggle = async (taskId: string) => {
    const currentStatus = taskStatusCopy;
    toggleTaskCompletion(taskId);
    setTaskStatusCopy((prev) => !prev);
    setTaskStatusColor((prev) => (prev === theme.colors.text ? theme.colors.icon : theme.colors.text));
  };

  const formattedDate = getFormatedDateOfYear(date);

  const handleChangeTaskColor = () => {
    setIsEisenhowerMatrixDropdownVisible(!isEisenhowerMatrixDropdownVisible);
    setIsMainDropdownVisible(false);
  };

  const handleOpenMainMenu = () => {
    setIsMainDropdownVisible(!isMainDropdownVisible);
    setIsEisenhowerMatrixDropdownVisible(false);
  };

  const closeMainDropdown = () => setIsMainDropdownVisible(false);
  const closeEisenhowerMatrixDropdown = () => setIsEisenhowerMatrixDropdownVisible(false);

  const handleChangeDate = (task: Task, newDate?: Date) => {
    let dateToUse = newDate || new Date(task.display_date);
    dateToUse.setDate(dateToUse.getDate() + 1);

    const newDisplayDate = `${dateToUse.getFullYear()}-${String(
      dateToUse.getMonth() + 1,
    ).padStart(2, '0')}-${String(dateToUse.getDate()).padStart(2, '0')}`;
    toggleTaskChangeDisplayDate(task.id, newDisplayDate);
    router.dismissTo('/(private)/home');
  };

  const handleDeleteSubtask = (subtaskId: string) => toggleTaskRemove(subtaskId);

  const menuItems = [
    {
      icon: 'pencil' as keyof typeof Ionicons.glyphMap,
      text: 'На завтра',
      onPress: () => handleChangeDate(task),
    },
    {
      icon: 'pencil' as keyof typeof Ionicons.glyphMap,
      text: 'На неделю',
      onPress: () => {
        const nextWeekDate = new Date(task.display_date);
        if (!isNaN(nextWeekDate.getTime())) {
          nextWeekDate.setDate(nextWeekDate.getDate() + 7);
          handleChangeDate(task, nextWeekDate);
        }
      },
    },
    {
      icon: 'duplicate-outline' as keyof typeof Ionicons.glyphMap,
      text: 'Дублировать',
      onPress: handleDuplicate,
    },
    {
      icon: 'trash-bin-outline' as keyof typeof Ionicons.glyphMap,
      text: 'Удалить',
      onPress: handleDelete,
    },
  ];

  const eisenhowermatrixitems = [
    {
      text: 'Срочно и Важно',
      color: theme.eisenhowerMatrix.urgentImportant,
      icon: 'alert-circle',
      onPress: () => changeEisenhowerMatrixStatus(task.id, true, true),
    },
    {
      text: 'Важно, не срочно',
      color: theme.eisenhowerMatrix.notUrgentImportant,
      icon: 'checkmark-circle',
      onPress: () => changeEisenhowerMatrixStatus(task.id, false, true),
    },
    {
      text: 'Срочно, не важно',
      color: theme.eisenhowerMatrix.urgentNotImportant,
      icon: 'time',
      onPress: () => changeEisenhowerMatrixStatus(task.id, true, false),
    },
    {
      text: 'Не срочно и не важно',
      color: theme.eisenhowerMatrix.notUrgentNotImportant,
      icon: 'heart-circle',
      onPress: () => changeEisenhowerMatrixStatus(task.id, false, false),
    },
  ];

  const handleAddSubtask = async (subtaskTitle: string) => {
    await addTask(
      subtaskTitle,
      task.space_id,
      task.user_id,
      task.due_date,
      task.display_date,
      false,
      '',
      task.id,
      new Date().toISOString(),
      new Date().toISOString(),
      null,
      false,
      null,
      null,
      false,
      false,
      null,
      false,
    );
  };

  const handleSubtaskToggle = (subtaskId: string) => toggleTaskCompletion(subtaskId);

  const handleAddReward = async () => {
    const trimmed = rewardNameInput.trim();
    if (!trimmed) return;

    try {
      addReward(
        task.id,
        trimmed,
      );
      setTaskRewardCopy(trimmed);
    } catch (err) {
      console.error('Ошибка при добавлении награды:', err);
      // Alert.alert('Ошибка', 'Не удалось добавить награду');
    }
  };

  if (!visible) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.third, borderRadius: 30 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDateChange} style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.text} style={styles.icon} />
          <Text style={[styles.dateText, { color: theme.colors.text }]}>{formattedDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <TextInput
          style={[
            styles.titleInput,
            {
              color: taskStatusCopy ? theme.colors.secondary : theme.colors.text,
              opacity: taskStatusCopy ? 0.6 : 1,
              textDecorationLine: taskStatusCopy ? 'line-through' : 'none',
            },
          ]}
          value={title}
          onChangeText={setTitle}
          placeholder="Название задачи"
          placeholderTextColor={theme.colors.secondary}
        />
        <TouchableOpacity onPress={() => handleTaskToggle(task.id)}>
          <Ionicons name="checkmark-outline" size={32} color={taskStatusColor} />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <TextInput
        style={[styles.descriptionInput, { color: theme.colors.text }, { lineHeight: 20 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Добавьте описание"
        placeholderTextColor={theme.colors.secondary}
        multiline
        maxLength={150}
      />

      {/* Subtasks */}
      <View style={styles.subtasksSection}>
        <Text style={[styles.subtasksTitle, { color: theme.colors.text }]}>Подзадачи</Text>
        {subtasks.map((subtask, index) => (
          <React.Fragment key={subtask.id}>
            <SubtaskItem
              subtask={subtask}
              onToggleSubtaskCompletion={handleSubtaskToggle}
              onDeleteSubtask={handleDeleteSubtask}
            />
            {index < subtasks.length - 1 && (
              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-down" size={24} color={theme.colors.text} />
              </View>
            )}
          </React.Fragment>
        ))}
        <NewSubtaskInput
          parentTaskId={task.id}
          spaceId={task.space_id}
          userId={task.user_id}
          date={date}
          onAddSubtask={handleAddSubtask}
        />
      </View>

      {/* Reward block */}
      <View style={{ marginBottom: 20 }}>
        <Text style={[styles.rewardHeaderText, { color: theme.colors.text, marginBottom: 10 }]}>Награда</Text>
        <TextInput
          value={rewardNameInput}
          onChangeText={setRewardNameInput}
          placeholder="Введите название награды"
          placeholderTextColor={theme.colors.secondary}
          style={[
            styles.titleInput,
            {
              fontSize: 18,
              marginBottom: 10,
              color: theme.colors.text,
            },
          ]}
        />
        <TouchableOpacity
          onPress={handleAddReward}
          style={[
            styles.addRewardButton,
            { backgroundColor: theme.colors.button, borderRadius: 10 },
          ]}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
            {task.reward ? 'Изменить награду' : 'Добавить награду'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="repeat-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.ellipsisContainer}>
          <TouchableOpacity onPress={handleChangeTaskColor} style={styles.actionButton}>
            <Feather name="circle" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <DropdownMenu
            items={eisenhowermatrixitems}
            visible={isEisenhowerMatrixDropdownVisible}
            onClose={closeEisenhowerMatrixDropdown}
            layout="vertical"
            containerStyle={styles.eisenhowerDropdownMenu}
          />
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.ellipsisContainer}>
          <TouchableOpacity onPress={handleOpenMainMenu} style={styles.actionButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <DropdownMenu
            items={menuItems}
            visible={isMainDropdownVisible}
            onClose={closeMainDropdown}
            containerStyle={styles.dropdownMenu}
          />
        </View>
      </View>

      {/* Modals */}
      <TimePickerModal
        visible={isTimePickerVisible}
        onClose={() => setIsTimePickerVisible(false)}
        onTimeSelected={() => setIsTimePickerVisible(false)}
      />
      <CalendarModal
        visible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        onApply={handleCalendarApply}
        initialDate={new Date(task.display_date || task.due_date)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  descriptionInput: {
    fontSize: 16,
    marginBottom: 20,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  ellipsisContainer: {
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: 5,
    zIndex: 1000,
  },
  eisenhowerDropdownMenu: {
    position: 'absolute',
    bottom: '100%',
    right: -100,
    marginBottom: 5,
    zIndex: 1000,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  subtasksSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  subtasksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 0,
  },
  rewardInfoContainer: {
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    marginBottom: 12
  },
  rewardHeaderText: {
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
  },
  rewardName: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: hp('1.8%'),
  },
  addRewardButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default TaskMenu;
