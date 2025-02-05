import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DayInfoProps {
    date: string;
    dayOfWeek: string;
}

const truncateDayOfWeek = (dayOfWeek: string) => {
    const dayMap: {[key:string]:string} = {
        'Понедельник':"Пн",
        'Вторник':"Вт",
        'Среда':"Ср",
        'Четверг':"Чт",
        'Пятница':"Пт",
        'Суббота':"Сб",
        'Воскресенье':"Вс",
    }
    return dayMap[dayOfWeek] || dayOfWeek;
}

const DayInfo: React.FC<DayInfoProps> = ({ date, dayOfWeek }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.dayText}>{truncateDayOfWeek(dayOfWeek)}</Text>
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dateText: {
        fontSize: 21,
        color: 'white',
    },
    dayText: {
        fontSize: 21,
        color: 'white',
    },
});

export default DayInfo;