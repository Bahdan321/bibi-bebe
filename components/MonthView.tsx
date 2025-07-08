import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { useTheme } from '@/providers/ThemeProvider';
import { tasks$ } from '@/Supabase/utils/SupaLegend';
import { observer } from '@legendapp/state/react';
import { Task } from '@/types/types';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CustomText from '@/components/base/CustomText';
import CustomTouchable from '@/components/base/CustomTouchable';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, subDays, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import Gigabar from './Gigabar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MonthViewProps {
    currentDate: Date;
    onDayPress: (date: string) => void;
}

const MonthView: React.FC<MonthViewProps> = observer(({ currentDate, onDayPress }) => {
    const { theme } = useTheme();
    const todos = tasks$.get();
    const scrollY = useSharedValue(0);

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
            <Animated.View style={styles.indicatorsContainer}>
                {Array.from({ length: dotsToShow }, (_, index) => (
                    <View
                        key={index}
                        style={[styles.taskIndicator, { backgroundColor: theme.colors.text }]}
                    />
                ))}
                {taskCount > maxDots && (
                    <CustomText
                        content="+"
                        size="xs"
                        color={theme.colors.text}
                        weight="bold"
                        style={styles.moreIndicatorContainer}
                    />
                )}
            </Animated.View>
        );
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Функция для рендера отдельного месяца
    const renderMonth = (monthDate: Date, monthIndex: number) => {
        const monthName = format(monthDate, 'LLLL', { locale: ru });
        const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        const calendarDays = getMonthDays(monthDate);

        // Примерная высота одного месяца (заголовок + дни недели + календарь + отступы)
        const MONTH_HEIGHT = 400; // Приблизительная высота месяца
        const monthOffset = monthIndex * MONTH_HEIGHT;

        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
                monthOffset - SCREEN_HEIGHT,
                monthOffset - SCREEN_HEIGHT / 2,
                monthOffset,
                monthOffset + SCREEN_HEIGHT / 2,
                monthOffset + SCREEN_HEIGHT
            ];

            const opacity = interpolate(
                scrollY.value,
                inputRange,
                [0, 0.3, 1, 1, 0.3],
                Extrapolate.CLAMP
            );

            const translateY = interpolate(
                scrollY.value,
                inputRange,
                [50, 25, 0, 0, 25],
                Extrapolate.CLAMP
            );

            return {
                opacity,
                transform: [{ translateY }],
            };
        });

        return (
            <Animated.View key={monthIndex} style={[styles.monthContainer, animatedStyle]}>
                {/* Заголовок месяца */}
                <View style={styles.monthHeader}>
                    <CustomText
                        content={capitalizedMonthName}
                        size="xxxl"
                        color={theme.colors.text}
                        weight="bold"
                    // textCenter
                    />
                </View>

                {/* Заголовок с днями недели */}
                <View style={styles.weekHeader}>
                    {weekDays.map((day, index) => (
                        <View key={index} style={styles.weekDayContainer}>
                            <CustomText
                                content={day}
                                size="md"
                                color={theme.colors.secondary}
                                weight="600"
                                textCenter
                            />
                        </View>
                    ))}
                </View>

                <Gigabar color="gray" size={2} />
                {/* Сетка календаря */}
                <View style={styles.calendarGrid}>
                    {calendarDays.map((date, index) => {
                        const dateString = format(date, 'yyyy-MM-dd');
                        const dayNumber = date.getDate();
                        const isCurrentMonthDay = isCurrentMonth(date, monthDate);
                        const isTodayDay = isToday(date);
                        const hasTasks = hasTasksForDay(date);

                        return (
                            <CustomTouchable
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
                                    size="md"
                                    color={isTodayDay ? theme.colors.primary : theme.colors.text}
                                    weight={isTodayDay ? '700' : '400'}
                                    textCenter
                                />
                                {renderTaskIndicators(date)}
                            </CustomTouchable>
                        );
                    })}
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <Animated.ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                {monthsOfYear.map((monthDate, index) => renderMonth(monthDate, index))}
            </Animated.ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
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
    moreIndicatorContainer: {
        marginLeft: 2,
    },
});

export default MonthView;