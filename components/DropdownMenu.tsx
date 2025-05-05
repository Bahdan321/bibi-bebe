import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import Gigabar from './Gigabar'; // Импортируем Gigabar
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type MenuItem = {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    onPress: () => void;
};

type DropdownMenuProps = {
    items: MenuItem[];
    visible: boolean;
    onClose: () => void;
    // position: { x: number; y: number }; // Removed position prop
    containerStyle?: StyleProp<ViewStyle>;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, visible, onClose, /* position, */ containerStyle }) => {
    const { theme } = useTheme();

    if (!visible) return null;

    return (
        <View
            style={[
                styles.overlay,
                // Removed position styles
                containerStyle,
                { backgroundColor: theme.colors.primary, borderColor: theme.colors.button }
            ]}
        >
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            item.onPress();
                            onClose(); // Close menu after action
                        }}
                    >
                        {/* Меняем местами текст и иконку */}
                        <Text style={[styles.menuText, { color: theme.colors.text }]}>{item.text}</Text>
                        <Ionicons name={item.icon} size={20} color={theme.colors.text} style={styles.icon} />
                    </TouchableOpacity>
                    {/* Добавляем Gigabar под каждым элементом, кроме последнего */}
                    {index < items.length - 1 && (
                        <Gigabar color={theme.colors.button || 'grey'} size={1} marginHorizontal={10} />
                    )}
                </React.Fragment>
            ))}
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
        // marginRight: 10, // Убираем отступ справа у иконки
        marginLeft: 10, // Добавляем отступ слева у иконки
    },
    menuText: {
        fontSize: hp('2'),
        flex: 1, // Позволяем тексту занимать доступное пространство
    },
});

export default DropdownMenu;