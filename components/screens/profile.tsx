import React, { useState, useEffect } from "react";
import {
    ImageBackground,
    ScrollView,
    View,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import {
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useTheme } from "@/providers/ThemeProvider";
import { useTranslation } from 'react-i18next';
import CustomText from "@/components/base/CustomText";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/base/CustomButton";
import { ChangeProfileModal } from "@/components/modals";
import { useAuth } from "@/providers/AuthProvider";
import { getAdaptiveTextSize } from "@/utils/textUtils";
import useRandomMemeAvatar from "@/hooks/useRandomMemeAvatar";
import { LinearGradient } from 'expo-linear-gradient'; // Добавляем для мягкого градиента
import { Card, Divider } from 'react-native-paper'; // Предполагаем, что добавим react-native-paper для карточек

export default function Profile() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { signOut, user, isLoading } = useAuth();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // Хук для получения мема по индексу и сохраненного индекса
    const { getMemeByIndex, getSavedAvatarIndex, getRandomMemeIndexWithSave } = useRandomMemeAvatar();
    const [currentAvatarIndex, setCurrentAvatarIndex] = useState<number | null>(null);

    // Загружаем сохраненный индекс аватара при монтировании компонента
    useEffect(() => {
        const loadSavedAvatar = async () => {
            console.log('🔄 Загружаем аватар для пользователя:', user?.username);

            const savedIndex = await getSavedAvatarIndex();
            console.log('💾 Сохраненный индекс из AsyncStorage:', savedIndex);

            if (savedIndex !== null) {
                console.log('✅ Используем сохраненный индекс:', savedIndex);
                setCurrentAvatarIndex(savedIndex);
            } else if (user?.avatar_url) {
                const urlIndex = parseInt(user.avatar_url);
                console.log('🔗 Используем индекс из avatar_url:', urlIndex);
                setCurrentAvatarIndex(urlIndex);
            } else {
                console.log('🎲 Генерируем новый случайный индекс');
                const randomIndex = await getRandomMemeIndexWithSave();
                console.log('🎯 Новый сгенерированный индекс:', randomIndex);
                setCurrentAvatarIndex(randomIndex);
            }
        };

        loadSavedAvatar();
    }, [user?.avatar_url]);

    console.log(user);

    // Данные пользователя из AuthProvider
    const username = user?.username;
    const title = user?.title;
    const email = user?.email; // Email теперь не отображается напрямую, но оставляем для модала или настроек

    const openEditModal = () => {
        setIsEditModalVisible(true);
    };

    const closeEditModal = () => {
        setIsEditModalVisible(false);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            console.log(t('profile.signOutSuccess'));
        } catch (error) {
            console.error(t('profile.signOutError'), error);
        }
    };

    // Фиктивные данные для статистики (замени на реальные из твоего провайдера или API)
    const stats = {
        completedTasks: 42,
        currentTasks: 5,
        streak: 7,
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.background]} // Мягкий градиент от светло-зеленого к белому (адаптируй цвета)
                style={{ flex: 1, minHeight: '100%', paddingBottom: 32 }}
            >
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    {/* Заголовок с кнопкой редактирования */}
                    <View style={styles.header}>
                        <CustomText
                            translationKey="profile.title"
                            size="xxxl"
                            color={theme.colors.text}
                            weight="bold"
                        />
                        <CustomButton
                            variant="text"
                            icon="pencil"
                            iconColor={theme.colors.text}
                            iconSize={24}
                            onPress={openEditModal}
                        />
                    </View>

                    <View style={styles.avatarContainer}>
                        <ImageBackground
                            source={
                                currentAvatarIndex !== null
                                    ? getMemeByIndex(currentAvatarIndex)
                                    : require("../../assets/images/memes/meme10.jpg")
                            }
                            style={styles.avatar}
                            imageStyle={{ borderRadius: 60 }} // Круглый аватар
                        />
                    </View>

                    {/* Имя и титул под аватаром */}
                    <View style={styles.userInfo}>
                        <CustomText
                            content={username || t('profile.user')}
                            size="xxl"
                            color={theme.colors.text}
                            weight="bold"
                            textCenter={true}
                        />
                        <CustomText
                            content={title || t('profile.noTitle')}
                            size="md"
                            color={theme.colors.secondary}
                            weight="normal"
                            textCenter={true}
                        />
                    </View>

                    <Divider style={{ marginVertical: 16 }} />

                    Карточка статистики
                    {/* <Card style={styles.card}>
                        <Card.Title title={t('profile.stats')} />
                        <Card.Content>
                            <View style={styles.statsRow}>
                                <CustomText content={`${t('profile.completedTasks')}: ${stats.completedTasks}`} size="md" />
                                <CustomText content={`${t('profile.currentTasks')}: ${stats.currentTasks}`} size="md" />
                            </View>
                            <CustomText content={`${t('profile.streak')}: ${stats.streak} ${t('profile.days')}`} size="md" />
                        </Card.Content>
                    </Card> */}

                    Карточка настроек
                    {/* <Card style={styles.card}>
                        <Card.Title title={t('profile.settings')} />
                        <Card.Content>
                            <TouchableOpacity onPress={() => { }}>
                                <CustomText content={t('profile.accountDetails')} size="md" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { }}>
                                <CustomText content={t('profile.theme')} size="md" />
                            </TouchableOpacity>
                        </Card.Content>
                    </Card> */}

                    {/* Кнопка выхода внизу */}
                    <View style={styles.logoutButtonContainer}>
                        <CustomButton
                            variant="primary"
                            title={t('profile.signOut')}
                            icon="log-out-outline"
                            onPress={handleSignOut}
                            buttonColor={theme.colors.profileButton}
                            size="medium"
                            style={styles.logoutButton}
                        />
                    </View>
                </ScrollView>

                {/* Модальное окно редактирования профиля*/}
                <ChangeProfileModal
                    visible={isEditModalVisible}
                    onClose={closeEditModal}
                    initialUsername={username || ''}
                // initialTitle={title || ''}
                />
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 24,
    },
    avatarContainer: {
        alignItems: "center",
        marginVertical: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    avatarOverlay: {
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 20,
        padding: 8,
    },
    userInfo: {
        alignItems: "center",
        marginBottom: 16,
    },
    card: {
        marginBottom: 24,
        borderRadius: 20,
        elevation: 2, // Для тени
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    logoutButtonContainer: {
        marginTop: 32,
        alignItems: "center",
    },
    logoutButton: {
        width: "80%",
    },
});