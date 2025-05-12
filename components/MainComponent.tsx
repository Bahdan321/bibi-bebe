import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DraggableDayBlock from './DraggableDayBlock';
import { useTheme } from '@/providers/ThemeProvider';
import { getWeekDays } from '@/utils/DateUtils';
import { MainComponentProps } from '@/types/types';
import { observer } from '@legendapp/state/react';

const MainComponent: React.FC<MainComponentProps> = observer(({ currentDate }) => {
    const days = getWeekDays(currentDate);

    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                simultaneousHandlers={[]}
                waitFor={[]}
            >
                <View style={styles.content}>
                    {days.map((day, index) => (
                        <DraggableDayBlock key={index} date={day.date} dayOfWeek={day.dayOfWeek} />
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
