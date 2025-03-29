import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import DayBlock from './DayBlock';
import { useTheme } from '@/providers/ThemeProvider';

const MainComponent: React.FC = () => {
    const days = [
        { date: '21-01-25', dayOfWeek: 'Понедельник' },
        // { date: '21-01-26', dayOfWeek: 'Вторник' },
        // { date: '21-01-27', dayOfWeek: 'Среда' },
        // { date: '21-01-28', dayOfWeek: 'Четверг' },
        // { date: '21-01-29', dayOfWeek: 'Пятница' },
        // { date: '21-01-30', dayOfWeek: 'Суббота' },
        // { date: '21-01-31', dayOfWeek: 'Воскресенье' },
    ];

    const { theme } = useTheme();


    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                nestedScrollEnabled={true}
            >
                <View style={styles.content}>
                    {days.map((day, index) => (
                        <DayBlock key={index} date={day.date} dayOfWeek={day.dayOfWeek} />
                    ))}
                    {/* <DayBlock date={days[0].date} dayOfWeek={days[0].dayOfWeek} /> */}
                </View>
            </ScrollView>
        </View>
    );
};

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