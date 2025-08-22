import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/themes';
import CustomText from '../base/CustomText';
import CustomTouchable from '../base/CustomTouchable';
import CustomModal from '../base/CustomModal';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

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
  const { t } = useTranslation();
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
  const daysOfWeek = [
    t('calendar.daysOfWeek.mon'), t('calendar.daysOfWeek.tue'), t('calendar.daysOfWeek.wed'),
    t('calendar.daysOfWeek.thu'), t('calendar.daysOfWeek.fri'), t('calendar.daysOfWeek.sat'), t('calendar.daysOfWeek.sun')
  ];

  // Форматирование названия месяца с большой буквы
  const getCurrentLocale = () => i18n.language === 'ru' ? 'ru' : 'en-US';
  const monthName = new Date(currentYear, currentMonth).toLocaleString(getCurrentLocale(), { month: 'long' });
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
    <CustomModal
      visible={visible}
      onClose={handleClose}
      animationType="fade"
      statusBarStyle="light"
      statusBarBackgroundColor="transparent"
      overlayColor="rgba(0, 0, 0, 0.5)"
      width="90%"
      borderRadius={30}
      padding={theme.spacing?.lg || 20}
      centered={true}
      closeButtonPosition="absolute-top-right"
      showCloseButton={true}
    >
      <View style={styles.content}>
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
            translationKey="calendar.apply"
            size="md"
            color={theme.colors.primary}
            weight="bold"
            textCenter={true}
          />
        </CustomTouchable>
      </View>
    </CustomModal>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      marginTop: theme.spacing?.sm || 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing?.md || 15,
      marginTop: theme.spacing?.sm || 10,
    },
    daysOfWeekContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing?.sm || 10,
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
      padding: theme.spacing?.sm || 10,
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
      padding: theme.spacing?.sm || 10,
    },
    applyButton: {
      marginTop: theme.spacing?.lg || 20,
      backgroundColor: theme.colors.button,
      padding: theme.spacing?.sm || 10,
      borderRadius: 10,
      alignItems: 'center',
    },
  });

export default CalendarModal;