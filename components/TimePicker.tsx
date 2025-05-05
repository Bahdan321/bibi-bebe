import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

// Интерфейс для пропсов
interface TimePickerProps {
    onTimeSelected?: (time: { day: string; hours: number; minutes: number }) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onTimeSelected }) => {
    const { theme } = useTheme();
    const [selectedDay, setSelectedDay] = useState('00');
    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const daysRef = useRef(null);
    const hoursRef = useRef(null);
    const minutesRef = useRef(null);

    const daysArray = Array.from({ length: 18 }, (_, i) => (i).toString().padStart(2, '0')); // От "00" до "17"
    const hoursArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')); // От "00" до "23"
    const minutesArray = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')); // От "00" до "55"

    const ITEM_HEIGHT = 50;
    const WHEEL_HEIGHT = ITEM_HEIGHT * 5;

    useEffect(() => {
        if (onTimeSelected) {
            onTimeSelected({ day: selectedDay, hours: parseInt(hours), minutes: parseInt(minutes) });
        }
        // Установка начальных позиций
        const dayIndex = daysArray.indexOf(selectedDay);
        const hourIndex = hoursArray.indexOf(hours);
        const minuteIndex = minutesArray.indexOf(minutes);
        if (dayIndex !== -1 && daysRef.current) {
            daysRef.current.scrollTo({ y: (dayIndex - 1) * ITEM_HEIGHT, animated: false });
        }
        if (hourIndex !== -1 && hoursRef.current) {
            hoursRef.current.scrollTo({ y: (hourIndex - 1) * ITEM_HEIGHT, animated: false });
        }
        if (minuteIndex !== -1 && minutesRef.current) {
            minutesRef.current.scrollTo({ y: (minuteIndex - 1) * ITEM_HEIGHT, animated: false });
        }
    }, [selectedDay, hours, minutes]);

    const handleDaysScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const selectedIndex = Math.round(offsetY / ITEM_HEIGHT) + 1; // +1 для учета padding
        if (selectedIndex >= 0 && selectedIndex < daysArray.length) {
            setSelectedDay(daysArray[selectedIndex]);
        }
    };

    const handleHoursScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const selectedIndex = Math.round(offsetY / ITEM_HEIGHT) + 1;
        if (selectedIndex >= 0 && selectedIndex < hoursArray.length) {
            setHours(hoursArray[selectedIndex]);
        }
    };

    const handleMinutesScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const selectedIndex = Math.round(offsetY / ITEM_HEIGHT) + 1;
        if (selectedIndex >= 0 && selectedIndex < minutesArray.length) {
            setMinutes(minutesArray[selectedIndex]);
        }
    };

    const selectedDayIndex = daysArray.indexOf(selectedDay);
    const selectedHourIndex = hoursArray.indexOf(hours);
    const selectedMinuteIndex = minutesArray.indexOf(minutes);

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: theme.colors.secondary }]}>Days</Text>
                <Text style={styles.labelSpacer} />
                <Text style={[styles.label, { color: theme.colors.secondary }]}>Hours</Text>
                <Text style={styles.labelSpacer} />
                <Text style={[styles.label, { color: theme.colors.secondary }]}>Min</Text>
            </View>
            <View style={styles.unifiedPicker}>
                <View style={[styles.wheelWrapper, { height: WHEEL_HEIGHT }]}>
                    <ScrollView
                        ref={daysRef}
                        showsVerticalScrollIndicator={false}
                        decelerationRate="fast"
                        snapToInterval={ITEM_HEIGHT}
                        onMomentumScrollEnd={handleDaysScroll}
                        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
                    >
                        {daysArray.map((day, index) => {
                            const isSelected = index === selectedDayIndex;
                            const fontSize = isSelected ? 30 : 18;
                            const fontWeight = isSelected ? 'bold' : 'normal';
                            return (
                                <View key={`day-${index}`} style={styles.item}>
                                    <Text
                                        style={[
                                            styles.itemText,
                                            {
                                                color: isSelected ? theme.colors.secondary : theme.colors.text,
                                                fontSize,
                                                fontWeight
                                            }
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
                <Text style={styles.separator}>:</Text>
                <View style={[styles.wheelWrapper, { height: WHEEL_HEIGHT }]}>
                    <ScrollView
                        ref={hoursRef}
                        showsVerticalScrollIndicator={false}
                        decelerationRate="fast"
                        snapToInterval={ITEM_HEIGHT}
                        onMomentumScrollEnd={handleHoursScroll}
                        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
                    >
                        {hoursArray.map((hour, index) => {
                            const isSelected = index === selectedHourIndex;
                            const fontSize = isSelected ? 30 : 18;
                            const fontWeight = isSelected ? 'bold' : 'normal';
                            return (
                                <View key={`hour-${index}`} style={styles.item}>
                                    <Text
                                        style={[
                                            styles.itemText,
                                            {
                                                color: isSelected ? theme.colors.secondary : theme.colors.text,
                                                fontSize,
                                                fontWeight
                                            }
                                        ]}
                                    >
                                        {hour}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
                <Text style={styles.separator}>:</Text>
                <View style={[styles.wheelWrapper, { height: WHEEL_HEIGHT }]}>
                    <ScrollView
                        ref={minutesRef}
                        showsVerticalScrollIndicator={false}
                        decelerationRate="fast"
                        snapToInterval={ITEM_HEIGHT}
                        onMomentumScrollEnd={handleMinutesScroll}
                        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
                    >
                        {minutesArray.map((minute, index) => {
                            const isSelected = index === selectedMinuteIndex;
                            const fontSize = isSelected ? 30 : 18;
                            const fontWeight = isSelected ? 'bold' : 'normal';
                            return (
                                <View key={`minute-${index}`} style={styles.item}>
                                    <Text
                                        style={[
                                            styles.itemText,
                                            {
                                                color: isSelected ? theme.colors.secondary : theme.colors.text,
                                                fontSize,
                                                fontWeight
                                            }
                                        ]}
                                    >
                                        {minute}
                                    </Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
            <Text style={[styles.selectedTime, { color: theme.colors.secondary }]}>
                {selectedDay} at {hours}:{minutes}
            </Text>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginVertical: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00ff00',
        width: 80,
        textAlign: 'center',
    },
    labelSpacer: {
        width: 20,
    },
    unifiedPicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        padding: 10,
    },
    wheelWrapper: {
        width: 80,
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative',
    },
    item: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    itemText: {
        color: '#fff',
    },
    separator: {
        fontSize: 24,
        color: '#fff',
        marginHorizontal: 10,
    },
    selectedTime: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        color: '#00ff00',
    },
});

export default TimePicker;