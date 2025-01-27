import React from 'react';
import { View, StyleSheet } from 'react-native';

const Gigabar: React.FC = () => {
    return <View style={styles.line} />;
};

const styles = StyleSheet.create({
    line: {
        height: 3,
        backgroundColor: 'gray',
        marginBottom: 8,
    },
});

export default Gigabar;