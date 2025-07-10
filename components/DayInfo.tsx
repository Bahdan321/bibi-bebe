import React from 'react';
import { View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomText from './base/CustomText';
import { useTheme } from '@/providers/ThemeProvider';
import { DayInfoProps } from '@/types/types';
import { getFormatedDate, truncateDayOfWeek } from '@/utils/DateUtils';

const DayInfo: React.FC<DayInfoProps> = ({ date, dayOfWeek }) => {
    const { theme } = useTheme();
    const dateObj = new Date(date);
    const today = new Date();
    const isToday = dateObj.toDateString() === today.toDateString();

    return (
        <View style={styles.container}>
            <CustomText
                content={getFormatedDate(date)}
                size={hp("2.5")}
                color={isToday ? theme.colors.currentDay : theme.colors.secondary}
                weight='bold'
            />
            <CustomText
                content={truncateDayOfWeek(dayOfWeek)}
                size={hp("2.5")}
                color={isToday ? theme.colors.currentDay : theme.colors.secondary}
                weight='bold'
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
});

export default DayInfo;