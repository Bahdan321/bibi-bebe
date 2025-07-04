import React from 'react';
import {
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import CustomText from '@/components/CustomText';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import RoundedCard from '@/components/RoundedCard';

interface Space {
    id: string;
    name: string;
    image: number;
}

const SPACES: Space[] = [
    {
        id: '1',
        name: 'Работа',
        image: require('../../assets/images/gradients/BlueSkyGradient.png'),
    },
    {
        id: '2',
        name: 'Учёба',
        image: require('../../assets/images/gradients/PinkOrangeGradient.png'),
    },
    {
        id: '3',
        name: 'Личное',
        image: require('../../assets/images/gradients/OrangeBlueGradient2.png'),
    },
    {
        id: '4',
        name: 'Проект X',
        image: require('../../assets/images/gradients/GreenYellowGradient.png'),
    },
];

export default function Spaces() {
    const { theme } = useTheme();

    const handleSelect = (space: Space) => {
        console.log(`Selected space: ${space.name}`);
    };

    return (
        <ImageBackground
            source={require('../../assets/images/gradients/GreenYellowGradient.png')}
            style={{ flex: 1, minHeight: '100%', backgroundColor: theme.colors.settingsBackground }}
            resizeMode="cover"
        >

            <ScrollView
                contentContainerStyle={styles.container}
            >
                <View style={{ padding: hp("3") }}>
                    <CustomText
                        content='Мои пространства'
                        size={32}
                        color={theme.colors.text}
                        weight='bold'
                        opacity={1}
                        borderWidth={0}
                        paddingHorizontal={0}
                        textCenter={false}
                    />
                </View>
                {SPACES.map((space, index) => {
                    const isFullWidth = index % 3 === 2;
                    return (
                        <View style={[styles.cardBase, isFullWidth ? styles.cardFull : styles.cardHalf, { backgroundColor: theme.colors.primary }]}>
                            <RoundedCard
                                key={space.id}
                                title={space.name}
                                image={require("../../assets/images/gradients/OrangeBlueGradient.png")}
                                onPress={() => handleSelect(space)}
                            />
                        </View>
                    );
                })}
            </ScrollView>
        </ImageBackground >
    );
};

const CARD_HEIGHT = 120;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',

        padding: 16,
    },
    cardBase: {
        borderRadius: 16,
        overflow: 'hidden',
        height: CARD_HEIGHT,
        marginBottom: 16,
    },
    cardHalf: {
        width: '48%',
    },
    cardFull: {
        width: '100%',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageRounded: {
        borderRadius: 16,
    },
    titleWrapper: {
        paddingHorizontal: hp("1"),
    },
    title: {
        fontSize: hp("3.6"),
        fontWeight: '900',
        textAlign: 'center',
    },
});

