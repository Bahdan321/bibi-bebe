import React from 'react';
import { View, StyleSheet } from 'react-native';

type GigabarProps = {
    color: string;
    size: number;
    marginHorizontal?: number
}

const Gigabar: React.FC<GigabarProps> = ({ color, size, marginHorizontal = 0 }) => {
    return <View style={{ backgroundColor: color, height: size, marginBottom: 12, marginHorizontal: marginHorizontal }} />;
};

export default Gigabar;