import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface SocialButtonProps {
    type: 'google' | 'apple';
    onPress: () => void;
    style?: any;
}

const SocialButton: React.FC<SocialButtonProps> = ({ type, onPress, style }) => {
    const { theme } = useTheme();

    const getButtonConfig = () => {
        switch (type) {
            case 'google':
                return {
                    icon: 'logo-google',
                    text: 'Войти через Google',
                    backgroundColor: '#fff',
                    textColor: '#000',
                    iconColor: '#4285F4'
                };
            case 'apple':
                return {
                    icon: 'logo-apple',
                    text: 'Войти через Apple',
                    backgroundColor: '#000',
                    textColor: '#fff',
                    iconColor: '#fff'
                };
            default:
                return {
                    icon: 'logo-google',
                    text: 'Войти',
                    backgroundColor: '#fff',
                    textColor: '#000',
                    iconColor: '#4285F4'
                };
        }
    };

    const config = getButtonConfig();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: config.backgroundColor },
                style
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                <Ionicons
                    name={config.icon as any}
                    size={hp('2.5')}
                    color={config.iconColor}
                    style={styles.icon}
                />
                <Text style={[styles.text, { color: config.textColor }]}>
                    {config.text}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: hp('1.8'),
        paddingHorizontal: wp('5'),
        borderRadius: 12,
        marginVertical: hp('0.8'),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: wp('3'),
    },
    text: {
        fontSize: hp('2'),
        fontWeight: '600',
    },
});

export default SocialButton;