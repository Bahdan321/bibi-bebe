import { TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface CustomButtonProps {
    title: string
    onPress: () => void
}

export const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className='bg-black rounded-full w-full py-6'
        >
            <Text className='text-white text-center font-extrabold'
                style={{ fontSize: wp('5') }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}