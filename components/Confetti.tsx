import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Confetti = () => {

    return (
        <View style={styles.container}>
            <LottieView
                source={require('@/assets/lottie/confettie.json')}
                autoPlay
                loop={false}
                style={styles.lottie}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    lottie: {
        width: 500,
        height: 500,
    },
});

export default Confetti;