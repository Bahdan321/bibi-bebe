import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { quotes } from '@/constants/quotes';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/types';
import { Ionicons } from '@expo/vector-icons'; // Для иконки крестика

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
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <Animated.View style={[styles.modalView, { opacity: fadeAnim }]}>
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.titleText}>Ежедневная цитата</Text>
                    <Animated.Text style={[styles.modalText, { opacity: quoteAnim }]}>
                        {getRandomQuote()}
                    </Animated.Text>
                    <Animated.View style={{ opacity: buttonAnim }}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Закрыть</Text>
                        </TouchableOpacity>
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
    titleText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 20,
    },
    modalText: {
        textAlign: 'center',
        fontSize: 20,
        color: theme.colors.text,
        marginBottom: 40,
    },
    closeButton: {
        backgroundColor: theme.colors.button,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: theme.colors.primary,
    },
    closeIcon: {
        position: 'absolute',
        top: -250,
        right: 10,
    },
});

export default QuoteModal;