import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import NavigatePanel from '@/components/NavigatePanel';
import MainComponent from '@/components/MainComponent';

export default function Index() {
    return (
        <View style={{ flex: 1 }}>
            <MainComponent />
            <NavigatePanel />
        </View>
    )
}