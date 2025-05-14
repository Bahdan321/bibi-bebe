import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface RewardModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (rewardName: string, rewardDescription: string) => void;
    initialRewardName: string;
    initialRewardDescription: string;
}

const RewardModal: React.FC<RewardModalProps> = ({
    visible,
    onClose,
    onSave,
    initialRewardName,
    initialRewardDescription,
}) => {
    const { theme } = useTheme();
    const [rewardName, setRewardName] = useState(initialRewardName);
    const [rewardDescription, setRewardDescription] = useState(initialRewardDescription);

    const handleSave = () => {
        if (rewardName.trim() && rewardDescription.trim()) {
            onSave(rewardName, rewardDescription);
            setRewardName('');
            setRewardDescription('');
        } else {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.third }]}>
                    <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                        Добавьте награду
                    </Text>
                    <TextInput
                        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.background }]}
                        value={rewardName}
                        onChangeText={setRewardName}
                        placeholder="Название награды"
                        placeholderTextColor={theme.colors.secondary}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.background }]}
                        value={rewardDescription}
                        onChangeText={setRewardDescription}
                        placeholder="Описание награды"
                        placeholderTextColor={theme.colors.secondary}
                        multiline
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Отмена" onPress={onClose} color={theme.colors.button} />
                        <Button title="Подтвердить" onPress={handleSave} color={theme.colors.button} />
                    </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default RewardModal;