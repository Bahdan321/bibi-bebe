import React from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Progress } from '~/components/ui/progress';

interface MiniTaskCardProps {
    themeText: string;
    height: number;
    width: number;
    gradient: string[];

}

export const MiniTaskCard: React.FC<MiniTaskCardProps> = ({ themeText, height, width, gradient, }) => {
    return (
        <View className='' style={{ padding: wp('1'), }}>
            <LinearGradient
                colors={gradient}
                className='justify-center'
                style={{
                    height: height, width: width,
                    borderTopLeftRadius: 60,
                    borderTopRightRadius: 60,
                    borderBottomLeftRadius: 60,
                    borderBottomRightRadius: 60,

                }}
            >
                <Text className='text-white font-extrabold text-center' style={{ fontSize: wp('6') }}>{themeText}</Text>
            </LinearGradient>
        </View >
    );
};
