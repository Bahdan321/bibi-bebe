import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import CustomButton from './base/CustomButton';
import CustomText from './base/CustomText';
import CustomTextInput from './base/CustomTextInput';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskMenuProps } from '@/types/types';
import {
  toggleTaskRemove,
  toggleDublicateTask,
  toggleTaskCompletion,
  changeEisenhowerMatrixStatus,
  toggleTaskChangeDisplayDate,
  addTask,
  addReward,
  toggleTaskRename,
  toggleTaskRenameDescription,
  tasks$,
  getTaskStateForDate,
} from '@/Supabase/utils/SupaLegend';
import { getFormatedDateOfYear } from '@/utils/DateUtils';
import TimePickerModal from './TimePickerModal';
import { useTranslation } from 'react-i18next';

import DropdownMenu from './DropdownMenu';
import { CalendarModal, TaskReminderModal } from './modals';
import { router } from 'expo-router';
import NewSubtaskInput from './NewSubtaskInput';
import SubtaskItem from './SubtaskItem';
import { v4 as uuidv4 } from 'uuid';
import { observe } from '@legendapp/state';
import { useCurrentUserId } from '@/hooks/useCurrentUser';
import { useTasksInitializer } from '@/hooks/useTasksInitializer';
import { useCurrentSpaceId } from '@/hooks/useCurrentSpace';

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
  const { t } = useTranslation();
  const currentUserId = useCurrentUserId();
  const currentSpaceId = useCurrentSpaceId();
  useTasksInitializer();

  const [taskStatusCopy, setTaskStatusCopy] = useState(task.status);
  const [taskStatusColor, setTaskStatusColor] = useState(
    task.status ? theme.colors.finishedTask : theme.colors.unfinishedTask,
  );
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isReminderVisible, setIsReminderVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isMainDropdownVisible, setIsMainDropdownVisible] = useState(false);
  const [isEisenhowerMatrixDropdownVisible, setIsEisenhowerMatrixDropdownVisible] = useState(false);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [rewardNameInput, setRewardNameInput] = useState(task.reward);
  const [taskRewardCopy, setTaskRewardCopy] = useState(task.reward);
  const [isRepeatMenuVisible, setIsRepeatMenuVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    task.repeat_interval ? JSON.parse(task.repeat_interval) : []
  );

  const daysOfWeek = [
    { text: t('tasks.daysOfWeek.monday'), value: 'mon' },
    { text: t('tasks.daysOfWeek.tuesday'), value: 'tue' },
    { text: t('tasks.daysOfWeek.wednesday'), value: 'wed' },
    { text: t('tasks.daysOfWeek.thursday'), value: 'thu' },
    { text: t('tasks.daysOfWeek.friday'), value: 'fri' },
    { text: t('tasks.daysOfWeek.saturday'), value: 'sat' },
    { text: t('tasks.daysOfWeek.sunday'), value: 'sun' },
  ];

  // Функция для закрытия всех dropdown
  const closeAllDropdowns = () => {
    setIsMainDropdownVisible(false);
    setIsEisenhowerMatrixDropdownVisible(false);
    setIsRepeatMenuVisible(false);
  };

  // Функция переключения дня
  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Элементы меню повторения
  const repeatMenuItems = daysOfWeek.map((day) => ({
    text: day.text,
    icon: selectedDays.includes(day.value) ? 'checkmark' : 'square-outline' as keyof typeof Ionicons.glyphMap,
    onPress: () => toggleDay(day.value),
  }));

  useEffect(() => {
    if (selectedDays.length > 0) {
      tasks$[task.id].repeat_interval.set(JSON.stringify(selectedDays));
      tasks$[task.id].is_repeating.set(true);
    } else {
      tasks$[task.id].repeat_interval.set(null);
      tasks$[task.id].is_repeating.set(false);
    }
  }, [selectedDays, task.id]);

  const borderAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (task.reward && !task.status) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(borderAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
          Animated.timing(borderAnim, { toValue: 0, duration: 800, useNativeDriver: false }),
        ])
      ).start();
    }
  }, [task.reward, task.status, borderAnim]);

  const animatedRewardStyle = {
    borderWidth: borderAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }),
    borderColor: theme.colors.primary,
  };

  useEffect(() => {
    const updateSubtasks = () => {
      const allTasks = tasks$.get();
      const subtasksList = Object.values(allTasks).filter((t: any) => t.parent_task_id === task.id) as Task[];
      setSubtasks(subtasksList);
    };
    updateSubtasks();

    const dispose = observe(() => {
      const allTasks = tasks$.get();
      const subtasksList = Object.values(allTasks).filter((t: any) => t.parent_task_id === task.id) as Task[];
      setSubtasks(subtasksList);
    });

    return () => dispose();
  }, [task.id]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      if (!task.due_date) {
        setTimeLeft('Дата не установлена');
        return;
      }
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

  const handleDateChange = () => {
    closeAllDropdowns(); // Закрываем все dropdown перед открытием календаря
    setIsCalendarVisible(true);
  };

  const handleCalendarApply = (selectedDate: Date) => {
    if (isNaN(selectedDate.getTime())) return;

    const displayDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    toggleTaskChangeDisplayDate(task.id, displayDate);
    setIsCalendarVisible(false);
    router.dismissTo('/(private)/home');
  };

  const handleDuplicate = () => {
    if (!currentSpaceId || !currentUserId) return;

    toggleDublicateTask(
      task.title || '',
      currentSpaceId,
      currentUserId,
      task.due_date || new Date().toISOString(),
      task.display_date || new Date().toISOString(),
      task.reward || '',
      task.status,
      task.description || undefined,
      task.parent_task_id || undefined,
      task.created_at,
      task.updated_at,
      task.completion_date,
      task.is_repeating,
      task.repeat_interval,
      task.planning_period,
      task.is_urgent,
      task.is_important
    );
    onClose();
  };

  const handleDelete = () => {
    toggleTaskRemove(task.id, date);
    subtasks.forEach((subtask) => toggleTaskRemove(subtask.id, date));
    onClose(); // Закрытие меню сразу
  };

  const handleTaskToggle = async () => {
    toggleTaskCompletion(task.id, date);
    const updatedTask = tasks$[task.id].get();
    const state = getTaskStateForDate(updatedTask, date);
    setTaskStatusCopy(state.completed);
    setTaskStatusColor(state.completed ? theme.colors.finishedTask : theme.colors.unfinishedTask);
  };

  const formattedDate = getFormatedDateOfYear(new Date(date || new Date()));

  const handleChangeTaskColor = () => {
    setIsEisenhowerMatrixDropdownVisible(!isEisenhowerMatrixDropdownVisible);
    setIsRepeatMenuVisible(false);
    setIsMainDropdownVisible(false);
  };

  const handleOpenMainMenu = () => {
    setIsMainDropdownVisible(!isMainDropdownVisible);
    setIsRepeatMenuVisible(false);
    setIsEisenhowerMatrixDropdownVisible(false);
  };

  const handleOpenRepeatMenu = () => {
    setIsRepeatMenuVisible(!isRepeatMenuVisible);
    setIsMainDropdownVisible(false);
    setIsEisenhowerMatrixDropdownVisible(false);
  };

  const closeMainDropdown = () => setIsMainDropdownVisible(false);
  const closeEisenhowerMatrixDropdown = () => setIsEisenhowerMatrixDropdownVisible(false);
  const closeRepeatMenu = () => setIsRepeatMenuVisible(false);

  const handleChangeDate = (task: Task, newDate?: Date) => {
    let dateToUse = newDate || new Date(task.display_date || new Date());
    dateToUse.setDate(dateToUse.getDate() + 1);

    const newDisplayDate = `${dateToUse.getFullYear()}-${String(dateToUse.getMonth() + 1).padStart(2, '0')}-${String(dateToUse.getDate()).padStart(2, '0')}`;
    toggleTaskChangeDisplayDate(task.id, newDisplayDate);
    router.dismissTo('/(private)/home');
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    console.log('handleDeleteSubtask called with:', subtaskId);
    await toggleTaskRemove(subtaskId, date);
  };

  const menuItems = [
    { icon: 'pencil' as keyof typeof Ionicons.glyphMap, text: t('tasks.menu.tomorrow'), onPress: () => handleChangeDate(task) },
    {
      icon: 'pencil' as keyof typeof Ionicons.glyphMap,
      text: t('tasks.menu.nextWeek'),
      onPress: () => {
        const nextWeekDate = new Date(task.display_date || new Date());
        if (!isNaN(nextWeekDate.getTime())) {
          nextWeekDate.setDate(nextWeekDate.getDate() + 7);
          handleChangeDate(task, nextWeekDate);
        }
      },
    },
    { icon: 'duplicate-outline' as keyof typeof Ionicons.glyphMap, text: t('tasks.menu.duplicate'), onPress: handleDuplicate },
    { icon: 'trash-bin-outline' as keyof typeof Ionicons.glyphMap, text: t('tasks.menu.delete'), onPress: handleDelete },
  ];

  const eisenhowermatrixitems = [
    { text: t('tasks.eisenhowerMatrix.urgentImportant'), color: theme.eisenhowerMatrix.urgentImportant, icon: 'alert-circle' as keyof typeof Ionicons.glyphMap, onPress: () => changeEisenhowerMatrixStatus(task.id, true, true) },
    { text: t('tasks.eisenhowerMatrix.notUrgentImportant'), color: theme.eisenhowerMatrix.notUrgentImportant, icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap, onPress: () => changeEisenhowerMatrixStatus(task.id, false, true) },
    { text: t('tasks.eisenhowerMatrix.urgentNotImportant'), color: theme.eisenhowerMatrix.urgentNotImportant, icon: 'time' as keyof typeof Ionicons.glyphMap, onPress: () => changeEisenhowerMatrixStatus(task.id, true, false) },
    { text: t('tasks.eisenhowerMatrix.notUrgentNotImportant'), color: theme.eisenhowerMatrix.notUrgentNotImportant, icon: 'heart-circle' as keyof typeof Ionicons.glyphMap, onPress: () => changeEisenhowerMatrixStatus(task.id, false, false) },
  ];

  const handleAddSubtask = async (subtaskTitle: string) => {
    if (!currentSpaceId || !currentUserId) return;

    await addTask(
      subtaskTitle,
      currentSpaceId,
      currentUserId,
      task.due_date || new Date().toISOString(),
      task.display_date || new Date().toISOString(),
      '',
      false,
      undefined,
      task.id,
      new Date().toISOString(),
      new Date().toISOString(),
      undefined,
      false,
      undefined,
      undefined,
      false,
      false
    );
  };

  const handleSubtaskToggle = (subtaskId: string) => toggleTaskCompletion(subtaskId, date);

  const handleAddReward = async () => {
    const trimmed = rewardNameInput?.trim();
    if (!trimmed) return;

    try {
      addReward(task.id, trimmed);
      setTaskRewardCopy(trimmed);
    } catch (err) {
      console.error(t('console.addingRewardError'), err);
    }
  };

  if (!visible) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.primary, borderRadius: 30 }]}>
      <View style={styles.header}>
        <CustomButton
          variant="text"
          onPress={handleDateChange}
          style={styles.dateContainer}
          title={formattedDate}
          icon="calendar-outline"
          iconColor={theme.colors.text}
          titleColor={theme.colors.text}
          iconSize={24}
        />
        <CustomButton
          variant="text"
          onPress={onClose}
          icon="close"
          iconColor={theme.colors.text}
          iconSize={24}
        />
      </View>

      <View style={styles.titleSection}>
        <CustomTextInput
          multiline
          variant="title"
          style={[
            { flex: 1 },
            {
              color: taskStatusCopy ? theme.colors.secondary : theme.colors.text,
              opacity: taskStatusCopy ? 0.6 : 1,
              textDecorationLine: taskStatusCopy ? 'line-through' : 'none',
            },
          ]}
          value={title}
          onChangeText={setTitle}
          placeholder="Название задачи"
          onFocus={closeAllDropdowns} // Закрываем dropdown при фокусе
        />
        <CustomButton
          variant="text"
          onPress={handleTaskToggle}
          icon="checkmark-outline"
          iconColor={taskStatusColor}
          iconSize={32}
          style={{ opacity: taskStatusCopy ? 0.5 : 1 }}
        />
      </View>

      <CustomTextInput
        variant="description"
        style={{ marginBottom: 20 }}
        value={description}
        onChangeText={setDescription}
        placeholder={t('tasks.addDescription')}
        multiline
        maxLength={150}
        onFocus={closeAllDropdowns} // Закрываем dropdown при фокусе
      />

      <View style={styles.subtasksSection}>
        <CustomText translationKey="tasks.subtasks" style={{ marginBottom: 10 }} color={theme.colors.secondary} />
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
          spaceId={currentSpaceId || ''}
          userId={currentUserId || ''}
          date={date}
          onAddSubtask={handleAddSubtask}
          closeAllDropdowns={closeAllDropdowns}
        />
      </View>

      <View style={{ marginBottom: 20 }}>
        <CustomText translationKey="tasks.reward" style={{ marginBottom: 10 }} color={theme.colors.secondary} />
        <CustomTextInput
          style={{ marginBottom: 10 }}
          placeholderTextColor={theme.colors.background}
          value={rewardNameInput || ''}
          onChangeText={setRewardNameInput}
          placeholder={t('tasks.enterRewardName')}
          onFocus={closeAllDropdowns} // Закрываем dropdown при фокусе (на всякий случай, если reward input фокусируется)
        />
        <CustomButton
          variant="primary"
          onPress={handleAddReward}
          style={{ ...styles.addRewardButton, backgroundColor: theme.colors.button, borderRadius: 10 }}
          title={task.reward ? t('tasks.changeReward') : t('tasks.addReward')}
          titleColor={theme.colors.primary}
        />
      </View>

      <View style={styles.actions}>
        <View style={styles.ellipsisContainer}>
          <CustomButton
            variant="text"
            style={styles.actionButton}
            onPress={handleOpenRepeatMenu}
            icon="repeat-outline"
            iconColor={theme.colors.text}
            iconSize={24}
          />
          <DropdownMenu
            items={repeatMenuItems}
            visible={isRepeatMenuVisible}
            onClose={closeRepeatMenu}
            closeOnSelect={false}
            containerStyle={styles.repeatDropdownMenu}
          />
        </View>

        <View style={styles.ellipsisContainer}>
          <CustomButton
            variant="text"
            onPress={handleChangeTaskColor}
            style={styles.actionButton}
            icon="ellipse-outline"
            iconColor={theme.colors.text}
            iconSize={24}
          />
          <DropdownMenu
            items={eisenhowermatrixitems}
            visible={isEisenhowerMatrixDropdownVisible}
            onClose={closeEisenhowerMatrixDropdown}
            containerStyle={styles.eisenhowerDropdownMenu}
          />
        </View>
        <CustomButton
          variant="text"
          style={styles.actionButton}
          onPress={() => { setIsReminderVisible(true); }}
          icon="notifications-outline"
          iconColor={theme.colors.text}
          iconSize={24}
        />
        <View style={styles.ellipsisContainer}>
          <CustomButton
            variant="text"
            onPress={handleOpenMainMenu}
            style={styles.actionButton}
            icon="ellipsis-horizontal"
            iconColor={theme.colors.text}
            iconSize={24}
          />
          <DropdownMenu
            items={menuItems}
            visible={isMainDropdownVisible}
            onClose={closeMainDropdown}
            containerStyle={styles.dropdownMenu}
          />
        </View>
      </View>

      <TimePickerModal
        visible={isTimePickerVisible}
        onClose={() => setIsTimePickerVisible(false)}
        onTimeSelected={() => setIsTimePickerVisible(false)}
      />
      <TaskReminderModal
        visible={isReminderVisible}
        onClose={() => setIsReminderVisible(false)}
        onConfirm={async (hours, minutes) => {
          try {
            const dateISO = task.display_date || task.due_date || date;
            const title = task.title || '';
            const { scheduleTaskReminder } = await import('@/utils/notifications');
            await scheduleTaskReminder(title, dateISO, hours, minutes);
            Alert.alert(t('reminders.successTitle'), t('reminders.scheduled'));
          } catch (err: any) {
            if (err?.message === 'past_time') {
              Alert.alert(t('reminders.errorTitle'), t('reminders.pastTime'));
            } else if (err?.message === 'permission_denied') {
              Alert.alert(t('reminders.errorTitle'), t('reminders.permissionDenied'));
            } else {
              Alert.alert(t('reminders.errorTitle'), t('reminders.failed'));
            }
          } finally {
            setIsReminderVisible(false);
          }
        }}
      />
      <CalendarModal
        visible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        onApply={handleCalendarApply}
        initialDate={new Date(task.display_date || task.due_date || new Date())}
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
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  addRewardButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  repeatDropdownMenu: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    left: 0,
    marginBottom: 5,
    zIndex: 1000,
  },
});

export default TaskMenu;