import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import CustomText from './CustomText';
import { CustomButton } from './base';

// Интерфейс для пропсов
interface TimePickerProps {
    onTimeSelected?: (time: { day: string; hours: number; minutes: number }) => void;
    onConfirm?: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onTimeSelected, onConfirm }) => {
    const { theme } = useTheme();
    const [selectedDay, setSelectedDay] = useState('00');
    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const daysRef = useRef<ScrollView>(null);
    const hoursRef = useRef<ScrollView>(null);
    const minutesRef = useRef<ScrollView>(null);

    const daysArray = Array.from({ length: 31 }, (_, i) => (i).toString().padStart(2, '0')); // От "00" до "17"
    const hoursArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')); // От "00" до "23"
    const minutesArray = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')); // От "00" до "55"

    const ITEM_HEIGHT = 50;
    const WHEEL_HEIGHT = ITEM_HEIGHT * 5;
    const PADDING_VERTICAL = 2 * ITEM_HEIGHT;

    useEffect(() => {
        // Установка начальных позиций
        const dayIndex = daysArray.indexOf(selectedDay);
        const hourIndex = hoursArray.indexOf(hours);
        const minuteIndex = minutesArray.indexOf(minutes);
        if (dayIndex !== -1 && daysRef.current) {
            daysRef.current.scrollTo({ y: dayIndex * ITEM_HEIGHT, animated: false });
        }
        if (hourIndex !== -1 && hoursRef.current) {
            hoursRef.current.scrollTo({ y: hourIndex * ITEM_HEIGHT, animated: false });
        }
        if (minuteIndex !== -1 && minutesRef.current) {
            minutesRef.current.scrollTo({ y: minuteIndex * ITEM_HEIGHT, animated: false });
        }
    }, [selectedDay, hours, minutes]);

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

    const handleConfirm = () => {
        if (onTimeSelected) {
            onTimeSelected({ day: selectedDay, hours: parseInt(hours), minutes: parseInt(minutes) });
        }
        if (onConfirm) {
            onConfirm();
        }
    };

    const selectedDayIndex = daysArray.indexOf(selectedDay);
    const selectedHourIndex = hoursArray.indexOf(hours);
    const selectedMinuteIndex = minutesArray.indexOf(minutes);

    return (
        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
            <View style={styles.labelContainer}>
                <CustomText 
                    content="Дни" 
                    size={16} 
                    color={theme.colors.secondary} 
                    weight="bold" 
                    textCenter 
                />
                <View style={styles.labelSpacer} />
                <CustomText 
                    content="Часы" 
                    size={16} 
                    color={theme.colors.secondary} 
                    weight="bold" 
                    textCenter 
                />
                <View style={styles.labelSpacer} />
                <CustomText 
                    content="Минуты" 
                    size={16} 
                    color={theme.colors.secondary} 
                    weight="bold" 
                    textCenter 
                />
            </View>
            <View style={styles.unifiedPicker}>
                <View style={[styles.wheelWrapper, { height: WHEEL_HEIGHT }]}>
                    <ScrollView
                        ref={daysRef}
                        showsVerticalScrollIndicator={false}
                        decelerationRate="fast"
                        snapToInterval={ITEM_HEIGHT}
                        onMomentumScrollEnd={handleDaysScroll}
                        contentContainerStyle={{ paddingVertical: PADDING_VERTICAL }}
                    >
                        {daysArray.map((day, index) => {
                            const isSelected = index === selectedDayIndex;
                            const fontSize = isSelected ? 30 : 18;
                            const fontWeight = isSelected ? 'bold' : 'normal';
                            return (
                                <View key={`day-${index}`} style={styles.item}>
                                    <CustomText
                                        content={day}
                                        size={fontSize}
                                        color={isSelected ? theme.colors.secondary : theme.colors.text}
                                        weight={fontWeight as 'normal' | 'bold'}
                                        textCenter
                                    />
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
                <CustomText 
                    content=":" 
                    size={24} 
                    color={theme.colors.text} 
                    weight="normal" 
                />
                <View style={[styles.wheelWrapper, { height: WHEEL_HEIGHT }]}>
                    <ScrollView
                        ref={hoursRef}
                        showsVerticalScrollIndicator={false}
                        decelerationRate="fast"
                        snapToInterval={ITEM_HEIGHT}
                        onMomentumScrollEnd={handleHoursScroll}
                        contentContainerStyle={{ paddingVertical: PADDING_VERTICAL }}
                    >
                        {hoursArray.map((hour, index) => {
                            const isSelected = index === selectedHourIndex;
                            const fontSize = isSelected ? 30 : 18;
                            const fontWeight = isSelected ? 'bold' : 'normal';
                            return (
                                <View key={`hour-${index}`} style={styles.item}>
                                    <CustomText
                                        content={hour}
                                        size={fontSize}
                                        color={isSelected ? theme.colors.secondary : theme.colors.text}
                                        weight={fontWeight as 'normal' | 'bold'}
                                        textCenter
                                    />
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
                <CustomText 
                    content=":" 
                    size={24} 
                    color={theme.colors.text} 
                    weight="normal" 
                />
                <View style={[styles.wheelWrapper, { height: WHEEL_HEIGHT }]}>
                    <ScrollView
                        ref={minutesRef}
                        showsVerticalScrollIndicator={false}
                        decelerationRate="fast"
                        snapToInterval={ITEM_HEIGHT}
                        onMomentumScrollEnd={handleMinutesScroll}
                        contentContainerStyle={{ paddingVertical: PADDING_VERTICAL }}
                    >
                        {minutesArray.map((minute, index) => {
                            const isSelected = index === selectedMinuteIndex;
                            const fontSize = isSelected ? 30 : 18;
                            const fontWeight = isSelected ? 'bold' : 'normal';
                            return (
                                <View key={`minute-${index}`} style={styles.item}>
                                    <CustomText
                                        content={minute}
                                        size={fontSize}
                                        color={isSelected ? theme.colors.secondary : theme.colors.text}
                                        weight={fontWeight as 'normal' | 'bold'}
                                        textCenter
                                    />
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
            <CustomText
                content={`${selectedDay} at ${hours}:${minutes}`}
                size={18}
                color={theme.colors.text}
                weight="normal"
                textCenter
                style={styles.selectedTime}
            />
            <CustomButton
                variant="primary"
                size="medium"
                title="Подтвердить"
                onPress={handleConfirm}
                style={styles.confirmButton}
            />
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
    selectedTime: {
        marginTop: 10,
    },
    confirmButton: {
        marginTop: 20,
    },
});

export default TimePicker;