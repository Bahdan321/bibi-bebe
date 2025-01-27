import { View, Text } from 'react-native'
import React from 'react'
import RoundButton from '@/components/RoundButton';
import NavigatePanel from '@/components/NavigatePanel';

export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <NavigatePanel />
        </View>
    )
}