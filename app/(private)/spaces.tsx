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

interface Space {
    id: string;
    name: string;
    image: number; // React Native static image resource
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

const SpacesScreen = () => {
    const { theme } = useTheme();

    const handleSelect = (space: Space) => {
        console.log(`Selected space: ${space.name}`);
    };

    return (
        <ImageBackground
            source={require('../../assets/images/gradients/GreenYellowGradient.png')}
            style={{ flex: 1, backgroundColor: theme.colors.settingsBackground }}
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
                        <Pressable
                            key={space.id}
                            style={[styles.cardBase, isFullWidth ? styles.cardFull : styles.cardHalf, { backgroundColor: theme.colors.primary }]}
                            onPress={() => handleSelect(space)}
                        >
                            <View
                                style={[styles.image, { backgroundColor: theme.colors.background }]}
                            >
                                <View style={styles.titleWrapper}>
                                    <Text style={[styles.title, { color: theme.colors.text }]}>
                                        {space.name}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
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
        // gap: 16, // Removed to allow flexible spacing for cardHalf items and rely on marginBottom for vertical spacing
        padding: 16,
    },
    cardBase: {
        borderRadius: 16,
        overflow: 'hidden',
        height: CARD_HEIGHT,
        marginBottom: 16, // Added for vertical spacing between rows, replacing container gap for this axis
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

export default SpacesScreen;
