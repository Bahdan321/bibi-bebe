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
import CustomText from "@/components/base/CustomText";
import RoundedCard from "@/components/RoundedCard";

const YEARS: number[] = [2025, 2026,];

export default function Goals() {
    const { theme } = useTheme();

    const handleSelect = (year: number) => {
        console.log("Selected year:", year);
    };

    return (
        <ImageBackground
            source={require("../../assets/images/gradients/PinkVioletGradient.png")}
            style={{ flex: 1, minHeight: '100%', backgroundColor: theme.colors.settingsBackground }}
            resizeMode="cover"
        >
            <ScrollView style={{ padding: hp("2") }}>
                <View style={{ padding: hp("3") }}>
                    <CustomText
                        content="Цели"
                        size={32}
                        color={theme.colors.text}
                        weight="bold"
                        opacity={1}
                        borderWidth={0}
                        paddingHorizontal={0}
                        textCenter={true}
                    />
                </View>
                {YEARS.map((year) => (
                    <RoundedCard
                        key={year}
                        title={String(year)}
                        image={require("../../assets/images/gradients/OrangeBlueGradient.png")}
                        onPress={() => handleSelect(year)}
                    />
                ))}
            </ScrollView>
        </ImageBackground>
    );
};
