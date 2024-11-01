import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';

export default function Home() {
    const [progress, setProgress] = React.useState(78);

    function updateProgressValue() {
        setProgress(Math.floor(Math.random() * 100));
    }
    return (
        <SafeAreaView>
            <View className='absolute top-0 left-0 p-8'>
                <Text>123</Text>
            </View>
        </SafeAreaView>
    );
}
