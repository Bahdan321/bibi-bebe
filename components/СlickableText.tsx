import React from "react";
import { ViewStyle, StyleSheet } from "react-native";
import CustomButton from "./base/CustomButton";

type TextProps = {
    title: string;
    titleColor: string;
    onPress: () => void;
    style?: ViewStyle;
}

const ClickableText: React.FC<TextProps> = ({ title, titleColor, onPress, style }) => {
    return (
        <CustomButton
            variant="text"
            title={title}
            titleColor={titleColor}
            onPress={onPress}
            size="small"
            style={style ? { ...styles.button, ...style } : styles.button}
        />
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 0, // Убираем дефолтный padding CustomButton
    }
})
export default ClickableText


