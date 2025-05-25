import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react'
import { useTheme } from '@/providers/ThemeProvider';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface SettingsRowProps {
    label: string;
    value: React.ReactNode;
    leftIcon?: React.ReactNode;
    onPress: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ label, value, leftIcon, onPress }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.row}>
            <View style={styles.left}>
                {leftIcon}
                <Text style={[styles.label, { color: theme.colors.background }]}>{label}</Text>
            </View>
            <TouchableOpacity style={styles.right} onPress={onPress}>
                {value}
            </TouchableOpacity>
        </View>
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
    label: {
        marginLeft: 10,
        fontSize: hp('2.2'),
        fontWeight: "bold"
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default SettingsRow