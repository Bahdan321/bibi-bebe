import React, { useState, useRef, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { useTheme } from "@/providers/ThemeProvider";

type TimeResult =
    | { hours: number; minutes: number } // when showDays === false
    | { day: string; hours: number; minutes: number }; // when showDays === true

export interface TimePickerProps {
    onTimeSelected?: (time: TimeResult) => void;
    onConfirm?: () => void;
    /**
     * If TRUE (default) shows picker for days + hours + minutes.
     * If FALSE shows only hours + minutes.
     */
    showDays?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
    onTimeSelected,
    onConfirm,
    showDays = true,
}) => {
    const { theme } = useTheme();

    /* ---------- state ---------- */
    const [selectedDay, setSelectedDay] = useState("00");
    const [hours, setHours] = useState("00");
    const [minutes, setMinutes] = useState("00");

    /* ---------- refs ---------- */
    const daysRef = useRef<ScrollView | null>(null);
    const hoursRef = useRef<ScrollView | null>(null);
    const minutesRef = useRef<ScrollView | null>(null);

    /* ---------- data ---------- */
    const daysArray = Array.from({ length: 31 }, (_, i) =>
        i.toString().padStart(2, "0"),
    );
    const hoursArray = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0"),
    );
    const minutesArray = Array.from({ length: 12 }, (_, i) =>
        (i * 5).toString().padStart(2, "0"),
    );

    const ITEM_HEIGHT = 50;
    const WHEEL_HEIGHT = ITEM_HEIGHT * 5;
    const PADDING_VERTICAL = 2 * ITEM_HEIGHT;

    /* ---------- initial scroll positioning ---------- */
    useEffect(() => {
        if (showDays && daysRef.current) {
            const dayIndex = daysArray.indexOf(selectedDay);
            if (dayIndex !== -1) {
                daysRef.current.scrollTo({ y: dayIndex * ITEM_HEIGHT, animated: false });
            }
        }

        const hourIndex = hoursArray.indexOf(hours);
        const minuteIndex = minutesArray.indexOf(minutes);

        if (hourIndex !== -1 && hoursRef.current) {
            hoursRef.current.scrollTo({ y: hourIndex * ITEM_HEIGHT, animated: false });
        }
        if (minuteIndex !== -1 && minutesRef.current) {
            minutesRef.current.scrollTo({ y: minuteIndex * ITEM_HEIGHT, animated: false });
        }
    }, [selectedDay, hours, minutes, showDays]);

    /* ---------- handlers ---------- */
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
            if (showDays) {
                onTimeSelected({
                    day: selectedDay,
                    hours: parseInt(hours),
                    minutes: parseInt(minutes),
                } as TimeResult);
            } else {
                onTimeSelected({
                    hours: parseInt(hours),
                    minutes: parseInt(minutes),
                } as TimeResult);
            }
        }
        onConfirm?.();
    };

    /* ---------- derived ---------- */
    const selectedDayIndex = daysArray.indexOf(selectedDay);
    const selectedHourIndex = hoursArray.indexOf(hours);
    const selectedMinuteIndex = minutesArray.indexOf(minutes);

    /* ---------- render helpers ---------- */
    const renderWheel = (
        data: string[],
        selectedIndex: number,
        onScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void,
        ref: React.RefObject<ScrollView | null>,
    ) => (
        <View style={[styles.wheelWrapper, { height: WHEEL_HEIGHT }]}>
            <ScrollView
                ref={ref}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={ITEM_HEIGHT}
                onMomentumScrollEnd={onScrollEnd}
                contentContainerStyle={{ paddingVertical: PADDING_VERTICAL }}
            >
                {data.map((value, index) => {
                    const isSelected = index === selectedIndex;
                    const fontSize = isSelected ? 30 : 18;
                    const fontWeight = isSelected ? "bold" : "normal";
                    return (
                        <View key={index} style={styles.item}>
                            <Text
                                style={[
                                    styles.itemText,
                                    {
                                        color: isSelected
                                            ? theme.colors.secondary
                                            : theme.colors.text,
                                        fontSize,
                                        fontWeight,
                                    },
                                ]}
                            >
                                {value}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );

    /* ---------- JSX ---------- */
    return (
        <View style={[styles.container, { backgroundColor: "transparent" }]}>
            {/* Labels */}
            <View style={styles.labelContainer}>
                {showDays && (
                    <>
                        <Text style={[styles.label, { color: theme.colors.secondary }]}>
                            Дни
                        </Text>
                        <Text style={styles.labelSpacer} />
                    </>
                )}

                <Text style={[styles.label, { color: theme.colors.secondary }]}>
                    Часы
                </Text>
                <Text style={styles.labelSpacer} />
                <Text style={[styles.label, { color: theme.colors.secondary }]}>
                    Минуты
                </Text>
            </View>

            {/* Wheels */}
            <View style={styles.unifiedPicker}>
                {showDays && (
                    <>
                        {renderWheel(daysArray, selectedDayIndex, handleDaysScroll, daysRef)}
                        <Text style={[styles.separator, { color: theme.colors.text }]}>
                            :
                        </Text>
                    </>
                )}

                {renderWheel(hoursArray, selectedHourIndex, handleHoursScroll, hoursRef)}
                <Text style={[styles.separator, { color: theme.colors.text }]}>:</Text>
                {renderWheel(
                    minutesArray,
                    selectedMinuteIndex,
                    handleMinutesScroll,
                    minutesRef,
                )}
            </View>

            {/* Selected time preview */}
            {/* <Text style={[styles.selectedTime, { color: theme.colors.secondary }]}>
                {showDays ? `${selectedDay} at ` : ""}
                {hours}:{minutes}
            </Text> */}

            {/* Confirm */}
            <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: theme.colors.secondary }]}
                onPress={handleConfirm}
            >
                <Text style={[styles.confirmButtonText, { color: theme.colors.primary }]}>
                    Подтвердить
                </Text>
            </TouchableOpacity>
        </View>
    );
};

/* ---------- styles ---------- */
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginVertical: 10,
    },
    labelContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        width: 80,
        textAlign: "center",
    },
    labelSpacer: {
        width: 20,
    },
    unifiedPicker: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        padding: 10,
    },
    wheelWrapper: {
        width: 80,
        borderRadius: 5,
        overflow: "hidden",
        position: "relative",
    },
    item: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    itemText: {
        color: "#fff",
    },
    separator: {
        fontSize: 24,
        marginHorizontal: 10,
    },
    selectedTime: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
    },
    confirmButton: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default TimePicker;
