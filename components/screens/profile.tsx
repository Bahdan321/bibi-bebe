import React from "react";
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

export default function Profile() {
    const { theme } = useTheme();

    // Заглушечные данные пользователя
    const username = "Олег Мангол";
    const title = "Ценитель шашлыков";
    const email = "olegmangol@gmail.com";

    return (
        <ImageBackground
            source={require("../../assets/images/gradients/OrangeBlueGradient2.png")}
            style={{ flex: 1, minHeight: '100%', backgroundColor: theme.colors.settingsBackground, paddingBottom: 32 }}
            resizeMode="cover"
        >
            <ScrollView style={{ padding: 16 }}>
                <View style={{ padding: 24 }}>
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
            </ScrollView>
        </ImageBackground>
    );
};

const CARD_SIZE = wp("90%");

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
});

