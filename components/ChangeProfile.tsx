import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform, Alert } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import CustomText from './base/CustomText';
import CustomButton from './base/CustomButton';
import CustomTextInput from './base/CustomTextInput';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthProvider';

interface ChangeProfileProps {
    visible: boolean;
    onClose: () => void;
    initialUsername: string;
}

const ChangeProfile: React.FC<ChangeProfileProps> = ({
    visible,
    onClose,
    initialUsername,
}) => {
    const { theme } = useTheme();
    const { updateUserProfile, isLoading } = useAuth();
    const [username, setUsername] = useState(initialUsername);
    const [error, setError] = useState('');

    // Function to show toast notification
    const showSuccessMessage = () => {
        if (Platform.OS === 'android') {
            ToastAndroid.show('Профиль успешно обновлен!', ToastAndroid.SHORT);
        } else {
            // For iOS or other platforms
            Alert.alert('Успех', 'Профиль успешно обновлен!', [{ text: 'OK' }], { cancelable: true });
        }
    };

    const handleSave = async () => {
        if (!username.trim()) {
            setError('Имя пользователя не может быть пустым');
            return;
        }

        setError('');

        const result = await updateUserProfile(username);

        if (result.success) {
            // Close modal immediately
            onClose();
            // Show toast notification
            showSuccessMessage();
        } else {
            setError(result.error || 'Произошла ошибка при обновлении профиля');
        }
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
                        <View
                            style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.secondary }]}
                        >
                            <Ionicons name="person" size={60} color={theme.colors.primary} />
                        </View>
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

                    {error ? (
                        <CustomText
                            content={error}
                            size="sm"
                            color="red"
                            style={{ marginBottom: 10, textAlign: 'center' }}
                        />
                    ) : null}

                    <CustomButton
                        variant="primary"
                        title={isLoading ? "Сохранение..." : "Сохранить"}
                        titleColor={theme.colors.primary}
                        buttonColor={theme.colors.button}
                        onPress={handleSave}
                        style={styles.saveButton}
                        disabled={isLoading}
                    />

                    {isLoading && (
                        <ActivityIndicator
                            size="small"
                            color={theme.colors.button}
                            style={{ marginTop: 10 }}
                        />
                    )}
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
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    saveButton: {
        marginTop: 10,
    },
});

export default ChangeProfile;