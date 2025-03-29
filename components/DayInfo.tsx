import React from 'react';
import { View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomText from '@/components/CustomText';
import { useTheme } from '@/providers/ThemeProvider';
import { DayInfoProps } from '@/types/types';
import { getFormatedDate } from '@/utils/DateUtils';

const truncateDayOfWeek = (dayOfWeek: string) => {
    const dayMap: { [key: string]: string } = {
        'Понедельник': "Пн",
        'Вторник': "Вт",
        'Среда': "Ср",
        'Четверг': "Чт",
        'Пятница': "Пт",
        'Суббота': "Сб",
        'Воскресенье': "Вс",
        'понедельник': "Пн",
        'вторник': "Вт",
        'среда': "Ср",
        'четверг': "Чт",
        'пятница': "Пт",
        'суббота': "Сб",
        'воскресенье': "Вс",
    }
    return dayMap[dayOfWeek] || dayOfWeek;
}

const DayInfo: React.FC<DayInfoProps> = ({ date, dayOfWeek }) => {
    const { theme } = useTheme();
    const dateObj = new Date(date);
    return (
        <View style={styles.container}>
            <CustomText content={getFormatedDate(date)} size={hp("2.5")} color={theme.colors.secondary} weight='bold' />
            <CustomText content={truncateDayOfWeek(dayOfWeek)} size={hp("2.5")} color={theme.colors.secondary} weight='bold' />
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