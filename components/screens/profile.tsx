import React, { useState } from "react";
import {
    ImageBackground,
    ScrollView,
    View,
    StyleSheet,
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

export default function Profile() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { signOut, user, isLoading } = useAuth();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    console.log(user)

    // Данные пользователя из AuthProvider
    const username = user?.username;
    const title = user?.title;
    const email = user?.email;

    // // Показываем индикатор загрузки, если данные еще загружаются
    // if (isLoading) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
    //             <CustomText
    //                 translationKey="profile.loadingProfile"
    //                 size="lg"
    //                 color={theme.colors.text}
    //                 weight="normal"
    //             />
    //         </View>
    //     );
    // }

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

    return (
        <ImageBackground
            source={require("../../assets/images/gradients/OrangeBlueGradient2.png")}
            style={{ flex: 1, minHeight: '100%', backgroundColor: theme.colors.settingsBackground, paddingBottom: 32 }}
            resizeMode="cover"
        >
            <ScrollView style={{ padding: 16 }}>
                <View style={{ padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <CustomText
                        translationKey="profile.title"
                        size="xxxl"
                        color={theme.colors.text}
                        weight="bold"
                        opacity={1}
                        borderWidth={0}
                        paddingHorizontal={0}
                        textCenter={false}
                    />
                    <CustomButton
                        variant="text"
                        icon="pencil"
                        iconColor={theme.colors.text}
                        iconSize={24}
                        onPress={openEditModal}
                    />
                </View>

                {/* Блок с ником и титулом */}
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: theme.colors.primary,
                            borderColor: theme.colors.secondary,
                            borderWidth: 1,
                        },
                    ]}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "column", alignItems: "center", flex: 1 }}>
                            <CustomText
                                content={username || t('profile.user')}
                                size={getAdaptiveTextSize(username || t('profile.user'), 'username')}
                                color={theme.colors.text}
                                weight="bold"
                                opacity={1}
                                borderWidth={0}
                                paddingHorizontal={0}
                                textCenter={false}
                            />
                            <CustomText
                                content={title || t('profile.noTitle')}
                                size={getAdaptiveTextSize(title || t('profile.noTitle'), 'title')}
                                color={theme.colors.secondary}
                                weight="normal"
                                opacity={0.9}
                                borderWidth={0}
                                paddingHorizontal={0}
                                textCenter={false}
                            />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderRadius: 20,
                                overflow: "hidden",
                            }}
                        >
                            <ImageBackground
                                source={
                                    user?.avatar_url
                                        ? { uri: user.avatar_url }
                                        : require("../../assets/images/memes/meme10.jpg")
                                }
                                style={{
                                    flex: 1,
                                    backgroundColor: theme.colors.settingsBackground,
                                    padding: 48,
                                }}
                                resizeMode="cover"
                            >
                            </ImageBackground>
                        </View>
                    </View>
                </View>

                {/* Информация о пользователе */}
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: theme.colors.primary,
                            borderColor: theme.colors.secondary,
                            borderWidth: 1,
                            justifyContent: "center",
                            alignItems: "flex-start",
                        },
                    ]}
                >
                    <View style={styles.infoWrapper}>
                        <CustomText
                            translationKey="profile.email"
                            translationOptions={{ email: email || t('profile.emailNotSpecified') }}
                            size={getAdaptiveTextSize(email || t('profile.emailNotSpecified'), 'email')}
                            color={theme.colors.text}
                            weight="bold"
                            opacity={1}
                            borderWidth={0}
                            paddingHorizontal={0}
                            textCenter={false}
                            style={{ marginBottom: 8 }}
                        />
                    </View>
                </View>

                {/* Кнопка выхода из аккаунта */}
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

            {/* Модальное окно редактирования профиля */}
            <ChangeProfileModal
                visible={isEditModalVisible}
                onClose={closeEditModal}
                initialUsername={username || ''}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        borderRadius: 20,
        padding: 8,
        marginBottom: 24,
    },
    infoWrapper: {
        marginTop: 8,
    },
    logoutButtonContainer: {
        marginTop: 16,
        alignItems: "center",
    },
    logoutButton: {
        width: "80%",
    },
});

