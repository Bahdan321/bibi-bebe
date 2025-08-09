import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { quotes } from '@/constants/quotes';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/types';
import CustomButton from '../base/CustomButton';
import CustomText from '../base/CustomText';
import CustomModal from '../base/CustomModal';

interface QuoteModalProps {
    visible: boolean;
    onClose: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ visible, onClose }) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [quoteAnim] = useState(new Animated.Value(0));
    const [buttonAnim] = useState(new Animated.Value(0));
    const { theme } = useTheme();
    const styles = createStyles(theme);

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                Animated.timing(quoteAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }).start(() => {
                    Animated.timing(buttonAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                });
            });
        } else {
            fadeAnim.setValue(0);
            quoteAnim.setValue(0);
            buttonAnim.setValue(0);
        }
    }, [visible]);

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    };

    return (
        <CustomModal
            visible={visible}
            onClose={onClose}
            animationType="none"
            statusBarBackgroundColor={theme.colors.third}
            overlayColor={theme.colors.third}
            width="100%"
            maxHeight="100%"
            borderRadius={20}
            centered={true}
            closeButtonPosition="absolute-top-right"
            closeButtonStyle={styles.closeIcon}
        >
            <View style={styles.content}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <CustomText
                        content='Ежедневная цитата'
                        size="xxl"
                        weight='bold'
                        color={theme.colors.text}
                        style={{ marginBottom: 20 }}
                        textCenter={true}
                    />
                </Animated.View>
                <Animated.View style={{ opacity: quoteAnim }}>
                    <CustomText
                        content={getRandomQuote()}
                        size="xl"
                        color={theme.colors.text}
                        textCenter
                        style={{ marginBottom: 40 }}
                        textCenter={true}
                    />
                </Animated.View>
                <Animated.View style={{ opacity: buttonAnim }}>
                    <CustomButton
                        variant='primary'
                        title='Закрыть'
                        onPress={onClose}
                        style={styles.closeButton}
                        buttonColor={theme.colors.button}
                        titleColor={theme.colors.primary}
                    />
                </Animated.View>
            </View>
        </CustomModal>
    );
};

const createStyles = (theme: Theme) => StyleSheet.create({
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: theme.colors.button,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    closeIcon: {
        top: -40,
        right: 10,
    },
});

export default QuoteModal;