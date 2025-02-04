import React from 'react';
import { TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


type RoundButtonProps = {
    iconName: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    buttonColor: string;
    borderColor?: string;
    borderWidth: number;
    onPress: (event: GestureResponderEvent) => void;
    size?: number;
};

const RoundButton: React.FC<RoundButtonProps> = ({
    iconName,
    iconColor,
    buttonColor,
    borderColor,
    borderWidth,
    onPress,
    size = 50,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: buttonColor,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderColor: borderColor,
                    borderWidth: borderWidth,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <Ionicons name={iconName} size={size * 0.5} color={iconColor} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        marginHorizontal: 5
    },
});

export default RoundButton;
