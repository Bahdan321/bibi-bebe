import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import Gigabar from './Gigabar'; // Импортируем Gigabar
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomText from './CustomText';
import CustomTouchable from './base/CustomTouchable';

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
    closeOnSelect?: boolean;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, visible, onClose, /* position, */ containerStyle, closeOnSelect = true }) => {
    const { theme } = useTheme();

    if (!visible) return null;

    return (
        <View
            style={[
                styles.overlay,
                containerStyle,
                { backgroundColor: theme.colors.primary, borderColor: theme.colors.button },
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
                            size={hp('2')}
                            color={theme.colors.text}
                            style={styles.menuTextContainer}
                        />
                        <Ionicons name={item.icon} size={20} color={theme.colors.text} style={styles.icon} />
                    </CustomTouchable>
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
    menuTextContainer: {
        flex: 1, // Позволяем тексту занимать доступное пространство
    },
});

export default DropdownMenu;