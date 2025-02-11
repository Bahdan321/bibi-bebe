import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomText from '@/components/CustomText';
import { useTheme } from '@/providers/ThemeProvider';

interface DayInfoProps {
    date: string;
    dayOfWeek: string;
}

const truncateDayOfWeek = (dayOfWeek: string) => {
    const dayMap: { [key: string]: string } = {
        'Понедельник': "Пн",
        'Вторник': "Вт",
        'Среда': "Ср",
        'Четверг': "Чт",
        'Пятница': "Пт",
        'Суббота': "Сб",
        'Воскресенье': "Вс",
    }
    return dayMap[dayOfWeek] || dayOfWeek;
}

const DayInfo: React.FC<DayInfoProps> = ({ date, dayOfWeek }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <CustomText content={date} size={hp("2.5")} color={theme.colors.secondary} weight='normal' />
            <CustomText content={truncateDayOfWeek(dayOfWeek)} size={hp("2.5")} color={theme.colors.secondary} weight='normal' />
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