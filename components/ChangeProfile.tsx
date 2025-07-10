import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import CustomText from './base/CustomText';
import CustomButton from './base/CustomButton';
import CustomTextInput from './base/CustomTextInput';
import { Ionicons } from '@expo/vector-icons';

interface ChangeProfileProps {
    visible: boolean;
    onClose: () => void;
    onSave: (username: string) => void;
    initialUsername: string;
}

const ChangeProfile: React.FC<ChangeProfileProps> = ({
    visible,
    onClose,
    onSave,
    initialUsername
}) => {
    const { theme } = useTheme();
    const [username, setUsername] = useState(initialUsername);
    const [avatarSource, setAvatarSource] = useState(null); // Заглушка для аватарки

    const handleSave = () => {
        if (username.trim()) {
            onSave(username);
        }
    };

    const handleSelectAvatar = () => {
        // Заглушка для выбора аватарки
        console.log('Выбор аватарки (заглушка)');
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: theme.colors.primary }]}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <CustomText
                            content="Редактирование профиля"
                            size="xl"
                            color={theme.colors.text}
                            weight="bold"
                        />
                    </View>

                    <View style={styles.avatarContainer}>
                        <TouchableOpacity
                            style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.secondary }]}
                            onPress={handleSelectAvatar}
                        >
                            <Ionicons name="person" size={60} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <CustomText
                            content="Имя пользователя"
                            size="md"
                            color={theme.colors.text}
                            style={{ marginBottom: 8 }}
                        />
                        <CustomTextInput
                            style={{
                                color: theme.colors.text,
                                borderColor: theme.colors.background,
                                borderWidth: 1,
                                borderRadius: 8,
                                padding: 10,
                                marginBottom: 20
                            }}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Введите имя"
                            placeholderTextColor={theme.colors.background}
                        />
                    </View>

                    <CustomButton
                        variant="primary"
                        title="Сохранить"
                        titleColor={theme.colors.primary}
                        buttonColor={theme.colors.button}
                        onPress={handleSave}
                        style={styles.saveButton}
                    />
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
        width: '90%',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative', // Добавлено для позиционирования кнопки закрытия
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    saveButton: {
        marginTop: 10,
    }
});

export default ChangeProfile;