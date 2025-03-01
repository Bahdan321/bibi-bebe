import React from "react";
import { TouchableOpacity, ViewStyle, StyleSheet,Text } from "react-native";

type TextProps = {
    title: string;
    titleColor: string;
    onPress: () => void;
    style?: ViewStyle; 
}

const ClickableText: React.FC<TextProps> = ({title,titleColor,onPress,style}) => {
    return(
        <TouchableOpacity
            onPress={onPress}
        >
            <Text style={[styles.text,{color:titleColor}]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text:{
        fontSize: 14,
    }
}) 
export default ClickableText


