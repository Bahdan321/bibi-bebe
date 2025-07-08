import React, { useState, useRef } from 'react';
    import { View, ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
    import CustomText from '@/components/CustomText';

    const TimePicker = () => {
    const [selectedDay, setSelectedDay] = useState('Today');
    const [hours, setHours] = useState(12);
    const [minutes, setMinutes] = useState(0);
    const daysRef = useRef(null);
    const hoursRef = useRef(null);
    const minutesRef = useRef(null);

    const daysArray = ['Today', 'Mon 28 Sep', 'Tue 29 Sep', 'Wed 30 Sep', 'Thu 1 Oct', 'Fri 2 Oct', 'Sat 3 Oct'];
    const hoursArray = Array.from({ length: 24 }, (_, i) => i);
    const minutesArray = Array.from({ length: 12 }, (_, i) => i * 5);

    const ITEM_HEIGHT = 40;

    const handleDaysScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const selectedIndex = Math.round(offsetY / ITEM_HEIGHT);
        if (selectedIndex >= 0 && selectedIndex < daysArray.length) {
        setSelectedDay(daysArray[selectedIndex]);
        }
    };

    const handleHoursScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const selectedIndex = Math.round(offsetY / ITEM_HEIGHT);
        if (selectedIndex >= 0 && selectedIndex < hoursArray.length) {
        setHours(hoursArray[selectedIndex]);
        }
    };

    const handleMinutesScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const selectedIndex = Math.round(offsetY / ITEM_HEIGHT);
        if (selectedIndex >= 0 && selectedIndex < minutesArray.length) {
        setMinutes(minutesArray[selectedIndex]);
        }
    };

    return (
        <View style={styles.container}>
        <View style={styles.wheelContainer}>
            <ScrollView
            ref={daysRef}
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={ITEM_HEIGHT}
            onMomentumScrollEnd={handleDaysScroll}
            >
            {daysArray.map((day) => (
                <View key={day} style={styles.item}>
                <CustomText
                    content={day}
                    size={18}
                    weight={day === selectedDay ? 'bold' : 'normal'}
                    style={styles.itemTextContainer}
                />
                </View>
            ))}
            </ScrollView>
            <View style={styles.selectionLineTop} />
            <View style={styles.selectionLineBottom} />
        </View>
        <View style={styles.wheelContainer}>
            <ScrollView
            ref={hoursRef}
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={ITEM_HEIGHT}
            onMomentumScrollEnd={handleHoursScroll}
            >
            {hoursArray.map((hour) => (
                <View key={hour} style={styles.item}>
                <CustomText
                    content={hour.toString()}
                    size={18}
                    weight={hour === hours ? 'bold' : 'normal'}
                    style={styles.itemTextContainer}
                />
                </View>
            ))}
            </ScrollView>
            <View style={styles.selectionLineTop} />
            <View style={styles.selectionLineBottom} />
        </View>
        <View style={styles.wheelContainer}>
            <ScrollView
            ref={minutesRef}
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={ITEM_HEIGHT}
            onMomentumScrollEnd={handleMinutesScroll}
            >
            {minutesArray.map((minute) => (
                <View key={minute} style={styles.item}>
                <CustomText
                    content={minute < 10 ? '0' + minute : minute.toString()}
                    size={18}
                    weight={minute === minutes ? 'bold' : 'normal'}
                    style={styles.itemTextContainer}
                />
                </View>
            ))}
            </ScrollView>
            <View style={styles.selectionLineTop} />
            <View style={styles.selectionLineBottom} />
        </View>
        <CustomText
            content={`Выбрано: ${selectedDay} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`}
            size={16}
            style={styles.selectedTextContainer}
        />
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wheelContainer: {
        height: 5 * 40,
        width: 100,
        marginHorizontal: 10,
        position: 'relative',
    },
    item: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTextContainer: {
        // стили для контейнера текста элемента
    },
    selectedTextContainer: {
        marginTop: 10,
    },
    selectionLineTop: {
        position: 'absolute',
        top: 2 * 40,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'gray',
    },
    selectionLineBottom: {
        position: 'absolute',
        top: 3 * 40,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'gray',
    },
    });

    export default TimePicker;