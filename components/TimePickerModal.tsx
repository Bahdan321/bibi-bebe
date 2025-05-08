import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import TimePicker from './TimePicker';
import { useTheme } from '@/providers/ThemeProvider';

// Интерфейс для пропсов
interface TimePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onTimeSelected: (time: { day: string; hours: number; minutes: number }) => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({ visible, onClose, onTimeSelected }) => {
    const { theme } = useTheme();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.third }]}>
                    <TimePicker
                        onTimeSelected={onTimeSelected}
                        onConfirm={onClose}
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%',
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '50%',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TimePickerModal;