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
import CustomText from "@/components/base/CustomText";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/base/CustomButton";
import ChangeProfile from "@/components/ChangeProfile";
import { useAuth } from "@/providers/AuthProvider";

export default function Profile() {
    const { theme } = useTheme();
    const { signOut } = useAuth();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // Заглушечные данные пользователя
    const username = "Олег Мангол";
    const title = "Ценитель шашлыков";
    const email = "olegmangol@gmail.com";

    const openEditModal = () => {
        setIsEditModalVisible(true);
    };

    const closeEditModal = () => {
        setIsEditModalVisible(false);
    };

    const handleProfileUpdate = (newUsername: string) => {
        // Здесь будет логика обновления профиля в базе данных
        console.log("Профиль обновлен:", newUsername);
        closeEditModal();
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            console.log("Выход из аккаунта выполнен успешно");
        } catch (error) {
            console.error("Ошибка при выходе из аккаунта:", error);
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
                        content="Профиль"
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
                                content={username}
                                size="xxxl"
                                color={theme.colors.text}
                                weight="bold"
                                opacity={1}
                                borderWidth={0}
                                paddingHorizontal={0}
                                textCenter={false}
                            />
                            <CustomText
                                content={title}
                                size="lg"
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
                                source={require("../../assets/images/memes/meme10.jpg")}
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

                {/* Почта */}
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
                    <View style={styles.emailWrapper}>
                        <CustomText
                            content={`Email: ${email}`}
                            size="md"
                            color={theme.colors.text}
                            weight="bold"
                            opacity={1}
                            borderWidth={0}
                            paddingHorizontal={0}
                            textCenter={true}
                        />
                    </View>
                </View>

                {/* Кнопка выхода из аккаунта */}
                <View style={styles.logoutButtonContainer}>
                    <CustomButton
                        variant="primary"
                        title="Выйти из аккаунта"
                        icon="log-out-outline"
                        onPress={handleSignOut}
                        buttonColor={theme.colors.error}
                        size="medium"
                        style={styles.logoutButton}
                    />
                </View>
            </ScrollView>

            {/* Модальное окно редактирования профиля */}
            <ChangeProfile
                visible={isEditModalVisible}
                onClose={closeEditModal}
                onSave={handleProfileUpdate}
                initialUsername={username}
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
    emailWrapper: {
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

