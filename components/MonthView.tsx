import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { tasks$ } from '@/Supabase/utils/SupaLegend';
import { observer } from '@legendapp/state/react';
import { Task } from '@/types/types';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomText from './CustomText';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, subDays, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';

interface MonthViewProps {
    currentDate: Date;
    onDayPress: (date: string) => void;
}

const MonthView: React.FC<MonthViewProps> = observer(({ currentDate, onDayPress }) => {
    const { theme } = useTheme();
    const todos = tasks$.get();

    // Получаем все месяцы текущего года
    const yearStart = startOfYear(currentDate);
    const yearEnd = endOfYear(currentDate);
    const monthsOfYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    // Функция для получения дней конкретного месяца
    const getMonthDays = (monthDate: Date) => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);

        // Получаем первый день недели (понедельник = 1)
        const startDay = getDay(monthStart);
        const adjustedStartDay = startDay === 0 ? 6 : startDay - 1; // Преобразуем воскресенье (0) в 6

        // Добавляем дни предыдущего месяца для заполнения первой недели
        const calendarStart = subDays(monthStart, adjustedStartDay);

        // Получаем последний день недели
        const endDay = getDay(monthEnd);
        const adjustedEndDay = endDay === 0 ? 6 : endDay - 1;

        // Добавляем дни следующего месяца для заполнения последней недели
        const calendarEnd = addDays(monthEnd, 6 - adjustedEndDay);

        // Получаем все дни для отображения в календаре
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    };

    // Функция для проверки наличия задач в определенный день
    const hasTasksForDay = (date: Date): boolean => {
        const dateString = format(date, 'yyyy-MM-dd');
        return Object.values(todos || {}).some((task: Task) => {
            let taskDisplayDate = task.display_date;
            if (!taskDisplayDate) {
                if (task.created_at && typeof task.created_at === 'string' && !isNaN(new Date(task.created_at).getTime())) {
                    taskDisplayDate = new Date(task.created_at).toISOString().split('T')[0];
                } else {
                    taskDisplayDate = task.due_date || new Date().toISOString().split('T')[0];
                }
            }

            if (task.is_repeating) {
                if (task.repeat_interval) {
                    try {
                        const repeatDays = JSON.parse(task.repeat_interval);
                        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
                        const taskDate = new Date(taskDisplayDate);
                        return taskDate <= date && repeatDays.includes(dayOfWeek);
                    } catch (e) {
                        return false;
                    }
                }
                return false;
            } else {
                return taskDisplayDate === dateString;
            }
        });
    };

    // Функция для получения количества задач в день
    const getTaskCountForDay = (date: Date): number => {
        const dateString = format(date, 'yyyy-MM-dd');
        return Object.values(todos || {}).filter((task: Task) => {
            let taskDisplayDate = task.display_date;
            if (!taskDisplayDate) {
                if (task.created_at && typeof task.created_at === 'string' && !isNaN(new Date(task.created_at).getTime())) {
                    taskDisplayDate = new Date(task.created_at).toISOString().split('T')[0];
                } else {
                    taskDisplayDate = task.due_date || new Date().toISOString().split('T')[0];
                }
            }

            if (task.is_repeating) {
                if (task.repeat_interval) {
                    try {
                        const repeatDays = JSON.parse(task.repeat_interval);
                        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
                        const taskDate = new Date(taskDisplayDate);
                        return taskDate <= date && repeatDays.includes(dayOfWeek);
                    } catch (e) {
                        return false;
                    }
                }
                return false;
            } else {
                return taskDisplayDate === dateString;
            }
        }).length;
    };

    // Проверка, является ли день текущим месяцем
    const isCurrentMonth = (date: Date, monthDate: Date): boolean => {
        return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear();
    };

    // Проверка, является ли день сегодняшним
    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    // Дни недели
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    // Рендер индикаторов задач
    const renderTaskIndicators = (date: Date) => {
        const taskCount = getTaskCountForDay(date);
        if (taskCount === 0) return null;

        const maxDots = 4; // Максимальное количество точек
        const dotsToShow = Math.min(taskCount, maxDots);

        return (
            <View style={styles.indicatorsContainer}>
                {Array.from({ length: dotsToShow }, (_, index) => (
                    <View
                        key={index}
                        style={[styles.taskIndicator, { backgroundColor: theme.colors.text }]}
                    />
                ))}
                {taskCount > maxDots && (
                    <Text style={[styles.moreIndicator, { color: theme.colors.text }]}>+</Text>
                )}
            </View>
        );
    };

    // Функция для рендера отдельного месяца
    const renderMonth = (monthDate: Date, monthIndex: number) => {
        const monthName = format(monthDate, 'LLLL', { locale: ru });
        const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        const calendarDays = getMonthDays(monthDate);

        return (
            <View key={monthIndex} style={styles.monthContainer}>
                {/* Заголовок месяца */}
                <View style={styles.monthHeader}>
                    <CustomText
                        content={capitalizedMonthName}
                        size={hp('2.8')}
                        color={theme.colors.text}
                        weight="700"
                        textCenter
                    />
                </View>

                {/* Заголовок с днями недели */}
                <View style={styles.weekHeader}>
                    {weekDays.map((day, index) => (
                        <View key={index} style={styles.weekDayContainer}>
                            <CustomText
                                content={day}
                                size={hp('1.6')}
                                color={theme.colors.secondary}
                                weight="600"
                                textCenter
                            />
                        </View>
                    ))}
                </View>

                {/* Сетка календаря */}
                <View style={styles.calendarGrid}>
                    {calendarDays.map((date, index) => {
                        const dateString = format(date, 'yyyy-MM-dd');
                        const dayNumber = date.getDate();
                        const isCurrentMonthDay = isCurrentMonth(date, monthDate);
                        const isTodayDay = isToday(date);
                        const hasTasks = hasTasksForDay(date);

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayContainer,
                                    isTodayDay && { backgroundColor: theme.colors.button },
                                    !isCurrentMonthDay && { opacity: 0.3 }
                                ]}
                                onPress={() => onDayPress(dateString)}
                                activeOpacity={0.7}
                            >
                                <CustomText
                                    content={dayNumber.toString()}
                                    size={hp('1.8')}
                                    color={isTodayDay ? theme.colors.primary : theme.colors.text}
                                    weight={isTodayDay ? '700' : '400'}
                                    textCenter
                                />
                                {renderTaskIndicators(date)}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {monthsOfYear.map((monthDate, index) => renderMonth(monthDate, index))}
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: hp("2"),
        paddingTop: 12,
    },
    monthContainer: {
        marginBottom: 32,
    },
    monthHeader: {
        paddingVertical: 12,
        paddingBottom: 16,
        alignItems: 'center',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    weekHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    weekDayContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayContainer: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 4,
        position: 'relative',
    },
    indicatorsContainer: {
        position: 'absolute',
        bottom: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskIndicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 1,
    },
    moreIndicator: {
        fontSize: 8,
        fontWeight: 'bold',
        marginLeft: 2,
    },
});

export default MonthView;