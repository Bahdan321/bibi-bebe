import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Confetti = ({ visible, onComplete }) => {
    const handleAnimationFinish = () => {
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <View style={styles.container}>
            {visible && (
                <LottieView
                    source={require('@/assets/lottie/Confettie.json')}
                    autoPlay
                    loop={false}
                    onAnimationFinish={handleAnimationFinish}
                    style={styles.lottie}
                />
            )}
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
        width: 300,
        height: 300,
    },
});

export default Confetti;