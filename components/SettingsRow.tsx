import { View, StyleSheet } from 'react-native';
import React from 'react'
import { useTheme } from '@/providers/ThemeProvider';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomText from './base/CustomText';
import CustomTouchable from './base/CustomTouchable';

interface SettingsRowProps {
    label: string;
    value: React.ReactNode;
    leftIcon?: React.ReactNode;
    onPress: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ label, value, leftIcon, onPress }) => {
    const { theme } = useTheme();

    return (
        <CustomTouchable
            onPress={onPress}
        >
            <View style={styles.row}>

                <View style={styles.left}>
                    {leftIcon}
                    <CustomText
                        content={label}
                        size="sm"
                        color={theme.colors.background}
                        weight="bold"
                        style={styles.labelContainer}
                    />
                </View>
                {/* <CustomText
                        content={value}
                        size="sm"
                        color={theme.colors.background}
                        weight="bold"
                        style={styles.right}
                    /> */}
                <CustomTouchable style={styles.right} onPress={onPress}>
                    {value}
                </CustomTouchable>
            </View>
        </CustomTouchable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelContainer: {
        marginLeft: 10,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default SettingsRow