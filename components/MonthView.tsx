import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
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
import CustomText from '@/components/base/CustomText';
import CustomTouchable from '@/components/base/CustomTouchable';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, subDays, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import Gigabar from './Gigabar';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '@/providers/LocalizationProvider';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// --- КОНСТАНТЫ РАЗМЕРОВ (КРИТИЧНО ДЛЯ АНИМАЦИИ) ---
const MONTH_HEADER_HEIGHT = 60;
const WEEK_HEADER_HEIGHT = 40;
const DAY_HEIGHT = (SCREEN_WIDTH - 32) / 7; // Квадратные дни
const GIGABAR_HEIGHT = 2;
const MONTH_MARGIN_BOTTOM = 32;
const WEEKS_IN_VIEW = 6; // Всегда резервируем место под 6 недель

// Полная высота одного элемента списка
const ITEM_HEIGHT =
    MONTH_HEADER_HEIGHT +
    WEEK_HEADER_HEIGHT +
    GIGABAR_HEIGHT +
    (WEEKS_IN_VIEW * DAY_HEIGHT) +
    MONTH_MARGIN_BOTTOM;

interface MonthViewProps {
    currentDate: Date;
    onDayPress: (date: string) => void;
}

// Создаем Анимированный FlatList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// --- 1. Компонент Дня (Без изменений, максимальная оптимизация) ---
const DayItem = React.memo(({
    date,
    monthDate,
    theme,
    onDayPress,
    taskCount,
    isTodayDay
}: any) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const dayNumber = date.getDate();
    const isCurrentMonthDay = date.getMonth() === monthDate.getMonth();

    const renderTaskIndicators = () => {
        if (taskCount === 0) return null;
        const maxDots = 4;
        const dotsToShow = Math.min(taskCount, maxDots);
        return (
            <View style={styles.indicatorsContainer}>
                {Array.from({ length: dotsToShow }, (_, index) => (
                    <View key={index} style={[styles.taskIndicator, { backgroundColor: theme.colors.text }]} />
                ))}
                {taskCount > maxDots && (
                    <CustomText content="+" size="xs" color={theme.colors.text} weight="bold" style={styles.moreIndicatorContainer} />
                )}
            </View>
        );
    };

    return (
        <CustomTouchable
            style={[
                styles.dayContainer,
                { height: DAY_HEIGHT },
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
            {renderTaskIndicators()}
        </CustomTouchable>
    );
}, (prev, next) => {
    return (
        prev.taskCount === next.taskCount &&
        prev.isTodayDay === next.isTodayDay &&
        prev.date.getTime() === next.date.getTime() &&
        prev.monthDate.getTime() === next.monthDate.getTime()
    );
});

// --- 2. Компонент Месяца с АНИМАЦИЕЙ ---
const MonthItem = React.memo(({
    monthDate,
    theme,
    currentLanguage,
    weekDays,
    onDayPress,
    todos,
    scrollY, // SharedValue приходит сюда
    index
}: any) => {
    const monthName = format(monthDate, 'LLLL', { locale: currentLanguage === "ru" ? ru : enUS });
    const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const startDay = getDay(monthStart);
        const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
        const calendarStart = subDays(monthStart, adjustedStartDay);
        const endDay = getDay(monthEnd);
        const adjustedEndDay = endDay === 0 ? 6 : endDay - 1;
        const calendarEnd = addDays(monthEnd, 6 - adjustedEndDay);
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    }, [monthDate]);

    // --- ЛОГИКА АНИМАЦИИ ---
    const animatedStyle = useAnimatedStyle(() => {
        // Вычисляем позицию этого конкретного месяца в общем списке
        const itemOffset = index * ITEM_HEIGHT;

        // Определяем зоны для интерполяции относительно текущего скролла
        // Когда элемент в центре экрана - он "активен"
        const inputRange = [
            itemOffset - SCREEN_HEIGHT,      // Где-то внизу
            itemOffset - SCREEN_HEIGHT / 2,  // Подходит к центру (или уходит)
            itemOffset,                      // Верх элемента совпал с верхом скролла
            itemOffset + SCREEN_HEIGHT / 2,  // Центр
            itemOffset + SCREEN_HEIGHT       // Ушел наверх
        ];

        const opacity = interpolate(
            scrollY.value,
            inputRange,
            [0.3, 0.6, 1, 0.6, 0.3], // Немного изменил значения для плавности
            Extrapolate.CLAMP
        );

        const scale = interpolate(
            scrollY.value,
            inputRange,
            [0.9, 0.95, 1, 0.95, 0.9],
            Extrapolate.CLAMP
        );

        const translateY = interpolate(
            scrollY.value,
            inputRange,
            [20, 10, 0, -10, -20], // Легкое движение вверх-вниз
            Extrapolate.CLAMP
        );

        return {
            opacity,
            transform: [{ scale }, { translateY }],
        };
    });

    return (
        <Animated.View style={[styles.monthContainer, { height: ITEM_HEIGHT }, animatedStyle]}>
            <View style={[styles.monthHeader, { height: MONTH_HEADER_HEIGHT }]}>
                <CustomText content={capitalizedMonthName} size="xxxl" color={theme.colors.text} weight="bold" />
            </View>

            <View style={[styles.weekHeader, { height: WEEK_HEADER_HEIGHT }]}>
                {weekDays.map((day: string, idx: number) => (
                    <View key={idx} style={styles.weekDayContainer}>
                        <CustomText content={day} size="md" color={theme.colors.secondary} weight="600" textCenter />
                    </View>
                ))}
            </View>

            <Gigabar color="gray" size={GIGABAR_HEIGHT} />

            <View style={styles.calendarGrid}>
                {calendarDays.map((date, idx) => {
                    // Упрощенная проверка задач для примера (твоя логика должна быть здесь)
                    const dateString = format(date, 'yyyy-MM-dd');
                    const isTodayDay = date.toDateString() === new Date().toDateString();

                    // Вставь сюда свою оптимизированную логику подсчета
                    const count = Object.values(todos || {}).filter((task: Task) => {
                        // ... твоя логика проверки ...
                        let taskDisplayDate = task.display_date;
                        if (!taskDisplayDate) {
                            taskDisplayDate = task.due_date || new Date().toISOString().split('T')[0];
                        }
                        return taskDisplayDate === dateString;
                    }).length;

                    return (
                        <DayItem
                            key={idx}
                            date={date}
                            monthDate={monthDate}
                            theme={theme}
                            onDayPress={onDayPress}
                            taskCount={count}
                            isTodayDay={isTodayDay}
                        />
                    );
                })}
            </View>
        </Animated.View>
    );
});

const MonthView: React.FC<MonthViewProps> = observer(({ currentDate, onDayPress }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { currentLanguage } = useLocalization();
    const todos = tasks$.get();

    // Shared Value для скролла
    const scrollY = useSharedValue(0);

    const monthsOfYear = useMemo(() => {
        const yearStart = startOfYear(currentDate);
        const yearEnd = endOfYear(currentDate);
        return eachMonthOfInterval({ start: yearStart, end: yearEnd });
    }, [currentDate.getFullYear()]);

    const weekDays = useMemo(() => [
        t('calendar.daysOfWeek.mon'), t('calendar.daysOfWeek.tue'), t('calendar.daysOfWeek.wed'),
        t('calendar.daysOfWeek.thu'), t('calendar.daysOfWeek.fri'), t('calendar.daysOfWeek.sat'), t('calendar.daysOfWeek.sun')
    ], [currentLanguage]);

    // Индекс текущего месяца
    const initialScrollIndex = currentDate.getMonth();

    // Layout для FlatList (супер быстро, так как фиксированная высота)
    const getItemLayout = (_: any, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });

    // Обработчик скролла для Reanimated
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    const renderItem = useCallback(({ item, index }: { item: Date, index: number }) => {
        return (
            <MonthItem
                monthDate={item}
                theme={theme}
                currentLanguage={currentLanguage}
                weekDays={weekDays}
                onDayPress={onDayPress}
                todos={todos}
                scrollY={scrollY} // Передаем shared value
                index={index}     // Передаем индекс для расчета позиции
            />
        );
    }, [theme, currentLanguage, weekDays, todos]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <AnimatedFlatList
                data={monthsOfYear}
                renderItem={renderItem}
                keyExtractor={(item: any) => item.toISOString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}

                // Подключаем Reanimated Scroll Handler
                onScroll={scrollHandler}
                scrollEventThrottle={16}

                // Оптимизация
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                windowSize={3}
                removeClippedSubviews={true}

                // Позиционирование
                getItemLayout={getItemLayout}
                initialScrollIndex={initialScrollIndex}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    monthContainer: {
        // Высота задается динамически через style prop, но можно добавить overflow hidden
        overflow: 'hidden',
        // marginBottom включен в расчет ITEM_HEIGHT, поэтому здесь не нужен, 
        // отступы внутри самого Item лучше делать паддингами, если нужно
    },
    monthHeader: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    weekHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weekDayContainer: {
        flex: 1,
        alignItems: 'center',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayContainer: {
        width: `${100 / 7}%`,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 4,
        position: 'relative',
    },
    indicatorsContainer: {
        position: 'absolute',
        bottom: 4,
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
        fontSize: 12,
    },
});

export default MonthView;