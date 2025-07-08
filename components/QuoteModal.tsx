import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, Animated, StatusBar } from 'react-native';
import { quotes } from '@/constants/quotes';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/types';
import CustomButton from './base/CustomButton';
import CustomText from './base/CustomText';

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
            StatusBar.setBackgroundColor(theme.colors.third, true);
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
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <Animated.View style={[styles.modalView, { opacity: fadeAnim }]}>
                    <CustomButton
                        variant='round'
                        icon='close'
                        onPress={onClose}
                        style={styles.closeIcon}
                        buttonColor="transparent"
                        iconColor={theme.colors.text}
                    />
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <CustomText
                            content='Ежедневная цитата'
                            size={26}
                            weight='bold'
                            color={theme.colors.text}
                            style={{ marginBottom: 20 }}
                            textCenter={true}
                        />
                    </Animated.View>
                    <Animated.View style={{ opacity: quoteAnim }}>
                        <CustomText
                            content={getRandomQuote()}
                            size={20}
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
                </Animated.View>
            </View>
        </Modal>
    );
};

const createStyles = (theme: Theme) => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.third, // Полупрозрачный фон
    },
    modalView: {
        width: '100%',
        maxHeight: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.colors.third,
        borderRadius: 20,
        position: 'relative',
    },

    closeButton: {
        backgroundColor: theme.colors.button,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },

    closeIcon: {
        position: 'absolute',
        top: -40,
        right: 10,
    },
});

export default QuoteModal;