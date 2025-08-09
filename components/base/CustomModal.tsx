import React, { ReactNode } from 'react';
import { Modal, View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Theme } from '@/theme/types';
import CustomButton from './CustomButton';
import CustomTouchable from './CustomTouchable';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
    animationType?: 'none' | 'slide' | 'fade';
    transparent?: boolean;
    statusBarTranslucent?: boolean;
    statusBarStyle?: 'auto' | 'inverted' | 'light' | 'dark';
    statusBarBackgroundColor?: string;
    showCloseButton?: boolean;
    closeButtonPosition?: 'top-right' | 'top-left' | 'absolute-top-right';
    closeButtonStyle?: ViewStyle;
    containerStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    overlayColor?: string;
    width?: DimensionValue;
    maxWidth?: DimensionValue;
    height?: DimensionValue;
    maxHeight?: DimensionValue;
    borderRadius?: number;
    padding?: number;
    centered?: boolean;
    onRequestClose?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    onClose,
    children,
    animationType = 'fade',
    transparent = true,
    statusBarTranslucent = true,
    statusBarStyle = 'light',
    statusBarBackgroundColor,
    showCloseButton = true,
    closeButtonPosition = 'top-right',
    closeButtonStyle,
    containerStyle,
    contentStyle,
    overlayColor,
    width = '90%',
    maxWidth,
    height,
    maxHeight = '100%',
    borderRadius = 20,
    padding = 20,
    centered = true,
    onRequestClose,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme, {
        overlayColor: overlayColor || 'rgba(0, 0, 0, 0.5)',
        width,
        maxWidth,
        height,
        maxHeight,
        borderRadius,
        padding,
        centered,
    });

    const handleRequestClose = () => {
        if (onRequestClose) {
            onRequestClose();
        } else {
            onClose();
        }
    };

    const renderCloseButton = () => {
        if (!showCloseButton) return null;

        const buttonStyle = [
            closeButtonPosition === 'absolute-top-right' ? styles.closeButtonAbsolute : styles.closeButton,
            closeButtonStyle,
        ];

        if (closeButtonPosition === 'absolute-top-right') {
            return (
                <CustomTouchable
                    style={buttonStyle}
                    onPress={onClose}
                >
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </CustomTouchable>
            );
        }

        return (
            <View style={styles.closeButtonContainer}>
                <CustomTouchable
                    style={buttonStyle}
                    onPress={onClose}
                >
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </CustomTouchable>
            </View>
        );
    };

    return (
        <>
            <StatusBar
                translucent={statusBarTranslucent}
                backgroundColor={statusBarBackgroundColor || 'transparent'}
                style={statusBarStyle}
            />
            <Modal
                visible={visible}
                transparent={transparent}
                animationType={animationType}
                statusBarTranslucent={statusBarTranslucent}
                onRequestClose={handleRequestClose}
            >
                <View style={[styles.modalContainer, containerStyle]}>
                    <View style={[styles.modalContent, contentStyle]}>
                        {closeButtonPosition !== 'absolute-top-right' && renderCloseButton()}
                        {children}
                        {closeButtonPosition === 'absolute-top-right' && renderCloseButton()}
                    </View>
                </View>
            </Modal>
        </>
    );
};

interface StyleParams {
    overlayColor: string;
    width: DimensionValue;
    maxWidth?: DimensionValue;
    height?: DimensionValue;
    maxHeight: DimensionValue;
    borderRadius: number;
    padding: number;
    centered: boolean;
}

const createStyles = (theme: Theme, params: StyleParams) =>
    StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: params.centered ? 'center' : 'flex-start',
            alignItems: 'center',
            backgroundColor: params.overlayColor,
            paddingTop: params.centered ? 0 : 50,
        },
        modalContent: {
            backgroundColor: theme.colors.primary,
            borderRadius: params.borderRadius,
            padding: params.padding,
            width: params.width,
            maxWidth: params.maxWidth,
            height: params.height,
            maxHeight: params.maxHeight,
            position: 'relative',
        },
        closeButtonContainer: {
            alignItems: 'flex-end',
            marginBottom: theme.spacing?.sm || 10,
        },
        closeButton: {
            padding: 5,
        },
        closeButtonAbsolute: {
            position: 'absolute',
            top: theme.spacing?.sm || 10,
            right: theme.spacing?.sm || 10,
            padding: 5,
            zIndex: 1,
        },
    });

export default CustomModal;