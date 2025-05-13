import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

const TimePicker = ({ onTimeSelected }) => {
    const { theme } = useTheme();
    const [selectedDay, setSelectedDay] = useState('Today');
    const [hours, setHours] = useState(12);
    const [minutes, setMinutes] = useState(0);
    const daysRef = useRef(null);
    const hoursRef = useRef(null);
    const minutesRef = useRef(null);

    const daysArray = ['Today', 'Mon 28 Sep', 'Tue 29 Sep', 'Wed 30 Sep', 'Thu 1 Oct', 'Fri 2 Oct', 'Sat 3 Oct'];
    const hoursArray = Array.from({ length: 24 }, (_, i) => i);
    const minutesArray = Array.from({ length: 12 }, (_, i) => i * 5);

    const ITEM_HEIGHT = 50;
    const VISIBLE_ITEMS = 5;

    useEffect(() => {
        // Notify parent component when time changes
        if (onTimeSelected) {
            onTimeSelected({ day: selectedDay, hours, minutes });
        }
    }, [selectedDay, hours, minutes]);

    const handleDaysScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const selectedIndex = Math.round(offsetY / ITEM_HEIGHT);
        if (selectedIndex >= 0 && selectedIndex < daysArray.length) {
            setSelectedDay(daysArray[selectedIndex]);
        }
    };

    const handleHoursScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const selectedIndex = Math.round(offsetY / ITEM_HEIGHT);
        if (selectedIndex >= 0 && selectedIndex < hoursArray.length) {
            setHours(hoursArray[selectedIndex]);
        }
    };

    const handleMinutesScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const selectedIndex = Math.round(offsetY / ITEM_HEIGHT);
        if (selectedIndex >= 0 && selectedIndex < minutesArray.length) {
            setMinutes(minutesArray[selectedIndex]);
        }
    };

    // Add padding items to allow scrolling to the first and last items
    const paddedDaysArray = [...Array(Math.floor(VISIBLE_ITEMS / 2)).fill(''), ...daysArray, ...Array(Math.floor(VISIBLE_ITEMS / 2)).fill('')];
    const paddedHoursArray = [...Array(Math.floor(VISIBLE_ITEMS / 2)).fill(''), ...hoursArray, ...Array(Math.floor(VISIBLE_ITEMS / 2)).fill('')];
    const paddedMinutesArray = [...Array(Math.floor(VISIBLE_ITEMS / 2)).fill(''), ...minutesArray, ...Array(Math.floor(VISIBLE_ITEMS / 2)).fill('')];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Select Time</Text>
            <View style={styles.pickerContainer}>
                <View style={styles.wheelContainer}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Day</Text>
                    <View style={[styles.wheelWrapper, { borderColor: theme.colors.border }]}>
                        <ScrollView
                            ref={daysRef}
                            showsVerticalScrollIndicator={false}
                            decelerationRate="fast"
                            snapToInterval={ITEM_HEIGHT}
                            onMomentumScrollEnd={handleDaysScroll}
                            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
                        >
                            {paddedDaysArray.map((day, index) => (
                                <View key={`day-${index}`} style={styles.item}>
                                    <Text 
                                        style={[
                                            styles.itemText, 
                                            { color: theme.colors.text },
                                            day === selectedDay && [styles.selectedItem, { color: theme.colors.primary }]
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={[styles.selectionHighlight, { borderColor: theme.colors.primary }]} />
                    </View>
                </View>

                <View style={styles.wheelContainer}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Hour</Text>
                    <View style={[styles.wheelWrapper, { borderColor: theme.colors.border }]}>
                        <ScrollView
                            ref={hoursRef}
                            showsVerticalScrollIndicator={false}
                            decelerationRate="fast"
                            snapToInterval={ITEM_HEIGHT}
                            onMomentumScrollEnd={handleHoursScroll}
                            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
                        >
                            {paddedHoursArray.map((hour, index) => (
                                <View key={`hour-${index}`} style={styles.item}>
                                    <Text 
                                        style={[
                                            styles.itemText, 
                                            { color: theme.colors.text },
                                            hour === hours && [styles.selectedItem, { color: theme.colors.primary }]
                                        ]}
                                    >
                                        {hour !== '' ? hour.toString().padStart(2, '0') : ''}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={[styles.selectionHighlight, { borderColor: theme.colors.primary }]} />
                    </View>
                </View>

                <View style={styles.wheelContainer}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Min</Text>
                    <View style={[styles.wheelWrapper, { borderColor: theme.colors.border }]}>
                        <ScrollView
                            ref={minutesRef}
                            showsVerticalScrollIndicator={false}
                            decelerationRate="fast"
                            snapToInterval={ITEM_HEIGHT}
                            onMomentumScrollEnd={handleMinutesScroll}
                            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
                        >
                            {paddedMinutesArray.map((minute, index) => (
                                <View key={`minute-${index}`} style={styles.item}>
                                    <Text 
                                        style={[
                                            styles.itemText, 
                                            { color: theme.colors.text },
                                            minute === minutes && [styles.selectedItem, { color: theme.colors.primary }]
                                        ]}
                                    >
                                        {minute !== '' ? minute.toString().padStart(2, '0') : ''}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={[styles.selectionHighlight, { borderColor: theme.colors.primary }]} />
                    </View>
                </View>
            </View>
            <Text style={[styles.selectedTime, { color: theme.colors.primary }]}>
                {selectedDay} at {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    wheelContainer: {
        width: width / 3.5,
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    wheelWrapper: {
        height: 250,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        position: 'relative',
    },
    item: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
        fontWeight: '400',
    },
    selectedItem: {
        fontWeight: '600',
    },
    selectionHighlight: {
        position: 'absolute',
        top: '50%',
        marginTop: -25,
        width: '100%',
        height: 50,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        pointerEvents: 'none',
    },
    selectedTime: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default TimePicker;