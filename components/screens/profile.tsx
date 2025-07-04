import React from "react";
import {
    ImageBackground,
    ScrollView,
    View,
    StyleSheet,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTheme } from "@/providers/ThemeProvider";
import CustomText from "@/components/CustomText";

export default function Profile() {
    const { theme } = useTheme();

    // Заглушечные данные пользователя
    const username = "Олег Мангол";
    const title = "Ценитель шашлыков";
    const email = "olegmangol@gmail.com";

    return (
        <ImageBackground
            source={require("../../assets/images/gradients/OrangeBlueGradient2.png")}
            style={{ flex: 1, backgroundColor: theme.colors.settingsBackground, paddingBottom: hp('4') }}
            resizeMode="cover"
        >
            <ScrollView style={{ padding: hp("2") }}>
                <View style={{ padding: hp("3") }}>
                    <CustomText
                        content="Профиль"
                        size={32}
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
                                size={28}
                                color={theme.colors.text}
                                weight="bold"
                                opacity={1}
                                borderWidth={0}
                                paddingHorizontal={0}
                                textCenter={false}
                            />
                            <CustomText
                                content={title}
                                size={18}
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
                                    padding: hp("6"),
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
                            alignItems: "left",
                        },
                    ]}
                >
                    <View style={styles.emailWrapper}>
                        <CustomText
                            content={`Email: ${email}`}
                            size={18}
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
        padding: hp("1"),
        marginBottom: 24,
    },
    emailWrapper: {
        marginTop: 8,
    },
});

