import React from 'react';
import { View, StyleSheet } from 'react-native';

type GigabarProps = {
    color: string;
    size: number;
}

const Gigabar: React.FC<GigabarProps> = ({ color, size }) => {
    return <View style={{ backgroundColor: color, height: size, marginBottom: 12, }} />;
};

export default Gigabar;