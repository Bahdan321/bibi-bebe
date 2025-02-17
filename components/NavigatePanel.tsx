import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import RoundButton from '@/components/RoundButton';
import CustomText from '@/components/CustomText';
import { format } from 'date-fns'
import { ru } from 'date-fns/locale';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '@/providers/ThemeProvider';

const ShowCurrentDate = () => {
    const formatedData = format(new Date(), 'LLLL yyyy', { locale: ru });
    return `${formatedData[0].toUpperCase()}${formatedData.slice(1,)}`
}

export default function NavigatePanel() {
    const { theme, toggleTheme } = useTheme();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "position" : "position"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <View style={[styles.panel, { backgroundColor: theme.colors.primary }]}>
                <View style={styles.leftContainer}>
                    <CustomText content={ShowCurrentDate()} size={Platform.OS == "ios" ? hp("2") : hp("2.8")} color={theme.colors.text} weight='700' />
                </View>
                <View style={styles.rightContainer}>
                    <RoundButton
                        iconName="person"
                        iconColor={theme.colors.icon}
                        buttonColor={theme.colors.button}
                        onPress={() => { toggleTheme() }}
                        size={hp("6")}
                        borderWidth={0}
                    />
                    <RoundButton
                        iconName="chevron-back-outline"
                        iconColor={theme.colors.icon}
                        buttonColor={theme.colors.button}
                        onPress={() => { }}
                        size={hp("6")}
                        borderWidth={0}
                    />
                    <RoundButton
                        iconName="chevron-forward-outline"
                        iconColor={theme.colors.icon}
                        buttonColor={theme.colors.button}
                        onPress={() => { }}
                        size={hp("6")}
                        borderWidth={0}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    panel: {
        bottom: 0,
        // position: 'absolute',
        left: 0,
        right: 0,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContainer: {
        position: 'absolute',
        left: 0,
        justifyContent: 'center',
        alignContent: 'center',
        paddingLeft: 20,
    },
    rightContainer: {
        position: 'absolute',
        right: 0,
        justifyContent: 'space-between',
        alignContent: 'center',
        paddingRight: 20,
        flexDirection: "row",
    }
});