import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '@/components/base/CustomText';
import { useTheme } from '@/providers/ThemeProvider';
import { DayInfoProps } from '@/types/types';
import { getFormatedDate, truncateDayOfWeek } from '@/utils/DateUtils';

const DayInfo: React.FC<DayInfoProps> = ({ date, dayOfWeek }) => {
    const { theme } = useTheme();
    const dateObj = new Date(date);
    return (
        <View style={styles.container}>
            <CustomText content={getFormatedDate(date)} size="sm" color={theme.colors.secondary} weight='bold' />
            <CustomText content={truncateDayOfWeek(dayOfWeek)} size="sm" color={theme.colors.secondary} weight='bold' />
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