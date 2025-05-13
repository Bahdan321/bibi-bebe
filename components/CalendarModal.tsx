import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/themes';
import { Ionicons } from '@expo/vector-icons';

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
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.header}>
            <TouchableOpacity onPress={handlePrevMonth}>
              <Text style={styles.headerText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>
              {capitalizedMonthName} {currentYear}
            </Text>
            <TouchableOpacity onPress={handleNextMonth}>
              <Text style={styles.headerText}>→</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.daysOfWeekContainer}>
            {daysOfWeek.map((day, index) => (
              <Text key={index} style={styles.dayLabel}>
                {day}
              </Text>
            ))}
          </View>
          <View style={styles.grid}>
            {prevMonthDays.map((day, index) => (
              <View key={`prev-${index}`} style={styles.dayCell}>
                <Text style={styles.prevMonthDayText}>{day}</Text>
              </View>
            ))}
            {daysArray.map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentMonth &&
                    selectedDate.getFullYear() === currentYear
                    ? styles.selectedDay
                    : null,
                ]}
                onPress={() => handleDateSelect(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDate &&
                      selectedDate.getDate() === day &&
                      selectedDate.getMonth() === currentMonth &&
                      selectedDate.getFullYear() === currentYear
                      ? styles.selectedDayText
                      : null,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
            {nextMonthDays.map((day, index) => (
              <View key={`next-${index}`} style={styles.dayCell}>
                <Text style={styles.nextMonthDayText}>{day}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Применить</Text>
          </TouchableOpacity>
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
      backgroundColor: theme.colors.third,
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
    headerText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    daysOfWeekContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    dayLabel: {
      width: '14%',
      textAlign: 'center',
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: 'bold',
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
    dayText: {
      color: theme.colors.text,
      fontSize: 16,
    },
    prevMonthDayText: {
      color: theme.colors.secondary,
      fontSize: 16,
      opacity: 0.5,
    },
    nextMonthDayText: {
      color: theme.colors.secondary,
      fontSize: 16,
      opacity: 0.5,
    },
    selectedDay: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 50,
      padding: theme.spacing.sm,
    },
    selectedDayText: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    applyButton: {
      marginTop: theme.spacing.lg,
      backgroundColor: theme.colors.button,
      padding: theme.spacing.sm,
      borderRadius: 10,
      alignItems: 'center',
    },
    applyButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default CalendarModal;