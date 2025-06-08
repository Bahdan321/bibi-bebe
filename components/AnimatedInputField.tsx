import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import TextInputField from './TextInputField';
import ReverseButton from './ReverseButton';
import { useTheme } from '@/providers/ThemeProvider';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface AnimatedInputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    isPasswordVisible?: boolean;
    onTogglePasswordVisibility?: () => void;
    visible: boolean;
    style?: any;
}

const AnimatedInputField: React.FC<AnimatedInputFieldProps> = ({
    label,
    value,
    onChangeText,
    secureTextEntry = false,
    isPasswordVisible,
    onTogglePasswordVisibility,
    visible,
    style
}) => {
    const { theme } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 30,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    if (!visible && fadeAnim._value === 0) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                },
                style
            ]}
        >
            {secureTextEntry ? (
                <View style={styles.passwordContainer}>
                    <TextInputField
                        label={label}
                        labelColor={theme.colors.text}
                        borderColor={theme.colors.text}
                        textColor={theme.colors.text}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={!isPasswordVisible}
                        style={styles.passwordInput}
                    />
                    <ReverseButton
                        isVisible={isPasswordVisible || false}
                        onPress={onTogglePasswordVisibility || (() => { })}
                        style={styles.reverseButton}
                    />
                </View>
            ) : (
                <TextInputField
                    label={label}
                    labelColor={theme.colors.text}
                    borderColor={theme.colors.text}
                    textColor={theme.colors.text}
                    value={value}
                    onChangeText={onChangeText}
                    style={styles.inputField}
                />
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: hp('2'),
    },
    inputField: {
        marginBottom: 0,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        marginBottom: 0,
    },
    reverseButton: {
        marginLeft: wp('2'),
    },
});

export default AnimatedInputField;