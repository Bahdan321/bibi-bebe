import { TouchableOpacity, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface ServiceButtonProps {
    title: string;
    titleColor: string;
    buttonColor: string;
    onPress: () => void;
    style?: object;
    icon?: string; // Имя иконки из Ionicons
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ title, titleColor, buttonColor, onPress, style, icon }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: buttonColor }, style]}
            onPress={onPress}
        >
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={24}
                            color={titleColor}
                            style={styles.icon}
                        />
                    )}
                </View>
                <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = {
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'flex-start',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    iconWrapper: {
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginHorizontal: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        flexShrink: 1,
    },
};

export default ServiceButton;