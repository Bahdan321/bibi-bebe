import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import RoundButton from '@/components/RoundButton';
import CustomText from '@/components/CustomText';
import { format } from 'date-fns'
import { ru } from 'date-fns/locale';


const ShowCurrentDate = () => {
    const formatedData = format(new Date(), 'LLLL yyyy', { locale: ru });
    return `${formatedData[0].toUpperCase()}${formatedData.slice(1,)}`
}

export default function NavigatePanel() {
    return (
        <View style={styles.panel}>
            <View style={styles.leftContainer}>
                <CustomText content={ShowCurrentDate()} size={21} color='white' weight='700' />
            </View>
            <View style={styles.rightContainer}>
                <RoundButton
                    iconName="person"
                    iconColor="black"
                    buttonColor="white"
                    onPress={() => { }}
                    size={50}
                />
                <RoundButton
                    iconName="chevron-back-outline"
                    iconColor="black"
                    buttonColor="white"
                    onPress={() => { }}
                    size={50}
                />
                <RoundButton
                    iconName="chevron-forward-outline"
                    iconColor="black"
                    buttonColor="white"
                    onPress={() => { }}
                    size={50}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    panel: {
        backgroundColor: 'black',
        // position: 'absolute',
        bottom: 0,
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