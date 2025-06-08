import React, { useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import TimePicker from "./TimePicker";
import { useTheme } from "@/providers/ThemeProvider";
import { scheduleReminder } from "@/utils/notification";

/**
 * ReminderModal
 *
 * A modal that lets the user pick a time (hours & minutes) and schedules a
 * local notification when confirmed.
 *
 * Props:
 *  - visible: controls modal visibility
 *  - onClose: callback when modal should close
 *  - taskTitle: (optional) string used for notification title/body
 *  - onReminderSet: (optional) callback invoked with (date, identifier) after scheduling
 */
export interface ReminderModalProps {
    visible: boolean;
    onClose: () => void;
    taskTitle?: string;
    onReminderSet?: (date: Date, identifier: string | null) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
    visible,
    onClose,
    taskTitle = "Напоминание",
    onReminderSet,
}) => {
    const { theme } = useTheme();
    const [selected, setSelected] = useState<{ hours: number; minutes: number } | null>(null);

    const handleTimeSelected = ({ hours, minutes }: { hours: number; minutes: number }) => {
        setSelected({ hours, minutes });
        handleConfirm();
    };

    const handleConfirm = async () => {
        if (!selected) {
            onClose();
            return;
        }

        const now = new Date();
        const fireDate = new Date();
        fireDate.setHours(selected.hours, selected.minutes, 0, 0);
        // if selected time already passed today -> schedule for tomorrow
        if (fireDate.getTime() <= now.getTime()) {
            fireDate.setDate(fireDate.getDate() + 1);
        }

        const identifier = await scheduleReminder(
            fireDate,
            taskTitle,
            "Пора выполнить задачу"
        );

        onReminderSet?.(fireDate, identifier);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={[styles.modalContainer, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.third }]}>
                    <TimePicker
                        showDays={false}
                        onTimeSelected={handleTimeSelected}
                    />
                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: theme.colors.secondary }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.closeButtonText, { color: theme.colors.primary }]}>
                            Закрыть
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        width: "90%",
    },
    confirmButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        width: "60%",
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        width: "50%",
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ReminderModal;
