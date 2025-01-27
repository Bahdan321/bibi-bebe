import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DayInfoProps {
    date: string;
    dayOfWeek: string;
}

const DayInfo: React.FC<DayInfoProps> = ({ date, dayOfWeek }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.dayText}>{dayOfWeek}</Text>
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
        fontSize: 16,
        color: 'white',
    },
    dayText: {
        fontSize: 16,
        color: 'white',
    },
});

export default DayInfo;