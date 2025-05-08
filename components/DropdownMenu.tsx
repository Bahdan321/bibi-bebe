import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import Gigabar from './Gigabar'; // Импортируем Gigabar
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type MenuItem = {
    icon?: keyof typeof Ionicons.glyphMap; // Сделаем иконку необязательной
    text: string;
    onPress: () => void;
    color?: string; // Добавляем необязательное поле для цвета фона
};

type Layout = 'vertical' | 'horizontal' | 'eisenhower'; // Добавляем тип для layout Eisenhower

type DropdownMenuProps = {
    items: MenuItem[];
    visible: boolean;
    onClose: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    layout?: Layout; // Добавляем проп layout
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, visible, onClose, containerStyle, layout = 'vertical' }) => {
    const { theme } = useTheme();

    if (!visible) return null;

    const isVertical = layout === 'vertical';
    const isHorizontal = layout === 'horizontal';
    const isEisenhower = layout === 'eisenhower';

    return (
        <View
            style={[
                styles.overlay,
                isVertical && styles.overlayVertical,
                isHorizontal && styles.overlayHorizontal,
                isEisenhower && styles.overlayEisenhower, // Применяем стили для Eisenhower
                containerStyle,
                { backgroundColor: theme.colors.primary, borderColor: theme.colors.button }
            ]}
        >
            {isEisenhower ? (
                <View style={styles.eisenhowerGrid}>
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.eisenhowerItem,
                                { backgroundColor: item.color || theme.colors.secondary }, // Используем цвет из item или дефолтный
                            ]}
                            onPress={() => {
                                item.onPress();
                                onClose();
                            }}
                        >
                            <Text style={[styles.eisenhowerText, { color: theme.colors.textOnPrimary || theme.colors.text }]}>{item.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                items.map((item, index) => (
                    <React.Fragment key={index}>
                        <TouchableOpacity
                            style={[
                                styles.menuItem,
                                isHorizontal && styles.menuItemHorizontal,
                            ]}
                            onPress={() => {
                                item.onPress();
                                onClose();
                            }}
                        >
                            <Text style={[styles.menuText, { color: theme.colors.text }, isHorizontal && styles.menuTextHorizontal]}>{item.text}</Text>
                            {item.icon && <Ionicons name={item.icon} size={20} color={item.color || theme.colors.text} style={styles.icon} />}
                        </TouchableOpacity>
                        {isVertical && index < items.length - 1 && (
                            <Gigabar color={theme.colors.button || 'grey'} size={1} marginHorizontal={10} />
                        )}
                        {isHorizontal && index < items.length - 1 && (
                            <Gigabar color={theme.colors.button || 'grey'} size={hp('3%')} width={1} marginHorizontal={5} />
                        )}
                    </React.Fragment>
                ))
            )}
        </View>
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
        zIndex: 1000, // Ensure it's above other elements
    },
    overlayVertical: {
        flexDirection: 'column',
        paddingVertical: 5,
        minWidth: 200, // Minimum width for the menu
    },
    overlayHorizontal: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center', // Выравниваем элементы по центру вертикально
        width: '100%', // Занимаем всю ширину
        justifyContent: 'space-around', // Распределяем элементы
    },
    overlayEisenhower: {
        padding: 10,
        width: hp('25%'), // Примерная ширина для 2x2
        aspectRatio: 1, // Делаем контейнер квадратным
    },
    menuItem: {
        flexDirection: 'row', // Оставляем row
        justifyContent: 'space-between', // Распределяем элементы по краям
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    menuItemHorizontal: {
        paddingVertical: 5, // Уменьшаем вертикальный padding для горизонтального layout
        paddingHorizontal: 10, // Уменьшаем горизонтальный padding
        flexShrink: 1, // Позволяем элементу сжиматься
    },
    icon: {
        // marginRight: 10, // Убираем отступ справа у иконки
        marginLeft: 10, // Добавляем отступ слева у иконки
    },
    menuText: {
        fontSize: hp('1.8'), // Уменьшим размер текста для компактности
        flexShrink: 1, // Позволяем тексту сжиматься, если не хватает места в горизонтальном layout
    },
    menuTextHorizontal: {
        textAlign: 'center',
    },
    verticalSeparator: {
        width: 1,
        height: '60%', // Высота разделителя
        alignSelf: 'center',
    },
    eisenhowerGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignContent: 'space-between',
    },
    eisenhowerItem: {
        width: '48%', // Примерно половина ширины с небольшим отступом
        aspectRatio: 1, // Делаем элементы квадратными
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5, // Небольшой внутренний отступ
    },
    eisenhowerText: {
        fontSize: hp('1.8'),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DropdownMenu;