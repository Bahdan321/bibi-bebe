import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import Gigabar from './Gigabar'; // Импортируем Gigabar
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomText from './base/CustomText';
import CustomTouchable from './base/CustomTouchable';

type MenuItem = {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    onPress: () => void;
    color?: string; // Добавляем color для совместимости с eisenhowermatrixitems
};

type DropdownMenuProps = {
    items: MenuItem[];
    visible: boolean;
    onClose: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    closeOnSelect?: boolean;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, visible, onClose, containerStyle, closeOnSelect = true }) => {
    const { theme } = useTheme();
    const animValue = useRef(new Animated.Value(0)).current; // Значение анимации от 0 (скрыто) до 1 (видимо)
    const [shouldRender, setShouldRender] = useState(visible); // Задержка unmount для анимации закрытия

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
        }
    }, [visible]);

    useEffect(() => {
        if (visible && shouldRender) {
            // Анимация появления: spring для лёгкого отскока
            animValue.setValue(0); // Сброс для повторного запуска
            Animated.spring(animValue, {
                toValue: 1,
                friction: 8, // Жёсткость пружины (меньше — больше отскок)
                tension: 40, // Скорость (больше — быстрее)
                useNativeDriver: true, // Для лучшей производительности
            }).start();
        } else if (!visible && shouldRender) {
            // Анимация скрытия: fade-out + slide-down
            Animated.timing(animValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                // setShouldRender(false); // Unmount после анимации
            });
        }
    }, [visible, shouldRender, animValue]);

    if (!shouldRender) return null;

    const animatedStyle = {
        opacity: animValue, // Плавное появление/исчезновение
        transform: [
            {
                translateY: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0], // Скольжение вверх (при появлении — из снизу вверх, при закрытии — сверху вниз)
                }),
            },
            {
                scaleY: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1], // Лёгкое разворачивание/сворачивание
                }),
            },
        ],
    };

    return (
        <Animated.View
            style={[
                styles.overlay,
                containerStyle,
                { backgroundColor: theme.colors.primary, borderColor: theme.colors.button },
                animatedStyle,
            ]}
        >
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <CustomTouchable
                        style={styles.menuItem}
                        onPress={() => {
                            item.onPress();
                            if (closeOnSelect) onClose();
                        }}
                    >
                        <CustomText
                            content={item.text}
                            size="sm"
                            color={item.color || theme.colors.text} // Поддержка color из item
                            style={styles.menuTextContainer}
                        />
                        <Ionicons name={item.icon} size={20} color={item.color || theme.colors.text} style={styles.icon} />
                    </CustomTouchable>
                    {index < items.length - 1 && (
                        <Gigabar color={theme.colors.button || 'grey'} size={1} marginHorizontal={10} />
                    )}
                </React.Fragment>
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        borderRadius: 8,
        borderWidth: 1,
        elevation: 5, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        paddingVertical: 5,
        minWidth: 200, // Minimum width for the menu
        zIndex: 1000, // Ensure it's above other elements
    },
    menuItem: {
        flexDirection: 'row', // Оставляем row
        justifyContent: 'space-between', // Распределяем элементы по краям
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    icon: {
        marginLeft: 10, // Добавляем отступ слева у иконки
    },
    menuTextContainer: {
        flex: 1, // Позволяем тексту занимать доступное пространство
    },
});

export default DropdownMenu;