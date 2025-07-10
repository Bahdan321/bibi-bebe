import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/themes';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './base/CustomText';
import CustomTouchable from './base/CustomTouchable';

interface ICalendarState {
  currentMonth: number;
  currentYear: number;
  selectedDate: Date | null;
}

interface ICalendarProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedDate: Date) => void;
  initialDate?: Date;
}

const CalendarModal: React.FC<ICalendarProps> = ({ visible, onClose, onApply, initialDate }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [state, setState] = useState<ICalendarState>({
    currentMonth: initialDate ? initialDate.getMonth() : new Date().getMonth(),
    currentYear: initialDate ? initialDate.getFullYear() : new Date().getFullYear(),
    selectedDate: initialDate || null,
  });

  // Reset to initialDate when modal opens
  useEffect(() => {
    if (visible) {
      setState({
        currentMonth: initialDate ? initialDate.getMonth() : new Date().getMonth(),
        currentYear: initialDate ? initialDate.getFullYear() : new Date().getFullYear(),
        selectedDate: initialDate || null,
      });
    }
  }, [visible, initialDate]);

  const { currentMonth, currentYear, selectedDate } = state;

  // Количество дней в текущем месяце
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Первый день месяца (с учетом понедельника как первого дня недели)
  const firstDayOfMonthRaw = new Date(currentYear, currentMonth, 1).getDay();
  const firstDayOfMonth = (firstDayOfMonthRaw + 6) % 7; // Пн = 0, Вт = 1, ..., Вс = 6
  // Количество дней в предыдущем месяце
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = new Date(prevMonthYear, currentMonth, 0).getDate();
  // Дни из конца предыдущего месяца
  const prevMonthDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1
  );
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Последний день месяца для вычисления оставшихся ячеек
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const lastDayOfMonthIndex = new Date(currentYear, currentMonth, lastDayOfMonth).getDay();
  const adjustedLastDayIndex = (lastDayOfMonthIndex + 6) % 7; // Индекс последнего дня (Пн = 0, ..., Вс = 6)
  const daysToNextMonth = adjustedLastDayIndex === 6 ? 0 : 7 - adjustedLastDayIndex - 1; // Количество дней следующего месяца
  // Дни из начала следующего месяца
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const nextMonthDays = Array.from(
    { length: daysToNextMonth },
    (_, i) => i + 1
  );

  // Массив дней недели (начинаем с понедельника)
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Форматирование названия месяца с большой буквы
  const monthName = new Date(currentYear, currentMonth).toLocaleString('ru', { month: 'long' });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const handlePrevMonth = () => {
    setState(prev => {
      const newMonth = prev.currentMonth === 0 ? 11 : prev.currentMonth - 1;
      const newYear = prev.currentMonth === 0 ? prev.currentYear - 1 : prev.currentYear;
      return { ...prev, currentMonth: newMonth, currentYear: newYear };
    });
  };

  const handleNextMonth = () => {
    setState(prev => {
      const newMonth = prev.currentMonth === 11 ? 0 : prev.currentMonth + 1;
      const newYear = prev.currentMonth === 11 ? prev.currentYear + 1 : prev.currentYear;
      return { ...prev, currentMonth: newMonth, currentYear: newYear };
    });
  };

  const handleDateSelect = (day: number) => {
    const newSelectedDate = new Date(currentYear, currentMonth, day);
    setState(prev => ({ ...prev, selectedDate: newSelectedDate }));
  };

  const handleApply = () => {
    if (selectedDate) {
      onApply(selectedDate);
    }
    onClose();
  };

  const handleClose = () => {
    setState(prev => ({
      ...prev,
      selectedDate: initialDate || null,
      currentMonth: initialDate ? initialDate.getMonth() : new Date().getMonth(),
      currentYear: initialDate ? initialDate.getFullYear() : new Date().getFullYear(),
    }));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.calendarContainer}>
          <View style={styles.closeButtonContainer}>
            <CustomTouchable onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </CustomTouchable>
          </View>
          <View style={styles.header}>
            <CustomTouchable onPress={handlePrevMonth}>
              <CustomText
                content="←"
                size="xxl"
                color={theme.colors.text}
                weight="bold"
              />
            </CustomTouchable>
            <CustomText
              content={`${capitalizedMonthName} ${currentYear}`}
              size="xxl"
              color={theme.colors.text}
              weight="bold"
            />
            <CustomTouchable onPress={handleNextMonth}>
              <CustomText
                content="→"
                size="xxl"
                color={theme.colors.text}
                weight="bold"
              />
            </CustomTouchable>
          </View>
          <View style={styles.daysOfWeekContainer}>
            {daysOfWeek.map((day, index) => (
              <CustomText
                key={index}
                content={day}
                size="sm"
                color={theme.colors.text}
                weight="bold"
                style={styles.dayLabelContainer}
                textCenter
              />
            ))}
          </View>
          <View style={styles.grid}>
            {prevMonthDays.map((day, index) => (
              <View key={`prev-${index}`} style={styles.dayCell}>
                <CustomText
                  content={day.toString()}
                  size="md"
                  color={theme.colors.secondary}
                  style={styles.prevMonthDayTextContainer}
                  textCenter={true}
                />
              </View>
            ))}
            {daysArray.map(day => {
              const isSelected = selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;

              return (
                <CustomTouchable
                  key={day}
                  style={isSelected ? [styles.dayCell, styles.selectedDay] as any : styles.dayCell}
                  onPress={() => handleDateSelect(day)}
                >
                  <CustomText
                    content={day.toString()}
                    size="md"
                    color={isSelected ? theme.colors.primary : theme.colors.text}
                    weight={isSelected ? "bold" : "normal"}
                    textCenter={true}
                  />
                </CustomTouchable>
              );
            })}
            {nextMonthDays.map((day, index) => (
              <View key={`next-${index}`} style={styles.dayCell}>
                <CustomText
                  content={day.toString()}
                  size="md"
                  color={theme.colors.secondary}
                  style={styles.nextMonthDayTextContainer}
                  textCenter={true}
                />
              </View>
            ))}
          </View>
          <CustomTouchable style={styles.applyButton} onPress={handleApply}>
            <CustomText
              content="Применить"
              size="md"
              color={theme.colors.primary}
              weight="bold"
              textCenter={true}
            />
          </CustomTouchable>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendarContainer: {
      backgroundColor: theme.colors.primary,
      borderRadius: 30,
      padding: theme.spacing.lg,
      width: '90%',
      position: 'relative',
    },
    closeButtonContainer: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
    },
    closeButton: {
      padding: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },

    daysOfWeekContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    dayLabelContainer: {
      width: '14%',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    dayCell: {
      width: '14%',
      alignItems: 'center',
      padding: theme.spacing.sm,
    },
    prevMonthDayTextContainer: {
      opacity: 0.5,
    },
    nextMonthDayTextContainer: {
      opacity: 0.5,
    },
    selectedDay: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 8,
      padding: theme.spacing.sm,
    },

    applyButton: {
      marginTop: theme.spacing.lg,
      backgroundColor: theme.colors.button,
      padding: theme.spacing.sm,
      borderRadius: 10,
      alignItems: 'center',
    },

  });

export default CalendarModal;