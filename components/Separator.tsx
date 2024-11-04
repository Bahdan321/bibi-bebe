import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SeparatorProps {
    thickness?: number;
    color?: string;
    leftMargin?: number;
    rightMargin?: number;
}

const Separator: React.FC<SeparatorProps> = ({
    thickness = 1,
    color = 'lightgray',
    leftMargin = 10,
    rightMargin = 10,
}) => {
    return (
        <View
            style={[
                styles.separator,
                {
                    height: thickness,
                    backgroundColor: color,
                    marginLeft: leftMargin,
                    marginRight: rightMargin,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    separator: {
        width: '100%',
    },
});

export default Separator;
