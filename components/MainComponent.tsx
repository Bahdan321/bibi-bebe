import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DayBlock from './DayBlock';
import { useTheme } from '@/providers/ThemeProvider';
import { getWeekDays } from '@/utils/DateUtils';
import { MainComponentProps } from '@/types/types';
import { observer } from '@legendapp/state/react';

const MainComponent: React.FC<MainComponentProps> = observer(({ currentDate }) => {
    const days = getWeekDays(currentDate);
    const { theme } = useTheme();
    const scrollRef = useRef<ScrollView>(null);
    const dayRefs = useRef<Array<View | null>>([]);

    const today = new Date().toDateString();
    const currentDayIndex = days.findIndex(d => new Date(d.date).toDateString() === today);

    useEffect(() => {
        if (currentDayIndex >= 0 && scrollRef.current) {
            const dayRef = dayRefs.current[currentDayIndex];
            if (dayRef) {
                dayRef.measure((x, y, width, height, pageX, pageY) => {
                    scrollRef.current?.scrollTo({ y: y, animated: false });
                });
            }
        }
    }, [currentDayIndex, days]); // Зависимости: индекс и дни (на случай смены недели)

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <ScrollView
                ref={scrollRef}
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                nestedScrollEnabled={true}
            >
                <View style={styles.content}>
                    {days.map((day, index) => (
                        <View
                            key={index}
                            ref={(ref) => (dayRefs.current[index] = ref)}
                        >
                            <DayBlock date={day.date} dayOfWeek={day.dayOfWeek} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        padding: 12,
    }
});

export default MainComponent;