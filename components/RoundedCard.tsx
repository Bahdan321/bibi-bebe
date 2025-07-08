import React from 'react';
import {
    Pressable,
    StyleSheet,
    View,
    ImageBackground,
    GestureResponderEvent,
} from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import CustomText from './base/CustomText';

interface RoundedCardProps {
    title: string;
    image?: number;
    color?: string;
    onPress?: (e: GestureResponderEvent) => void;
    fullWidth?: boolean;
}

const CARD_HEIGHT = 120;

const RoundedCard: React.FC<RoundedCardProps> = ({
    title,
    image,
    color,
    onPress,
    fullWidth = true,
}) => {
    const { theme } = useTheme();

    const Container: React.ElementType = onPress ? Pressable : View;

    return (
        <Container
            style={[
                styles.cardBase,
                fullWidth ? styles.cardFull : styles.cardHalf,
                { backgroundColor: theme.colors.primary },
            ]}
            onPress={onPress as any}
        >
            {image ? (
                <ImageBackground
                    source={image}
                    style={styles.image}
                    resizeMode="cover"
                >
                    <View style={styles.titleWrapper}>
                        <CustomText
                            content={title}
                            size="xxxl"
                            color={theme.colors.text}
                            weight="bold"
                            textCenter={true}
                        />
                    </View>
                </ImageBackground>
            ) : (
                <View style={styles.image}>
                    <View style={styles.titleWrapper}>
                        <CustomText
                            content={title}
                            size="xxxl"
                            color={theme.colors.text}
                            weight="bold"
                            textCenter={true}
                        />
                    </View>
                </View>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: 'transparent',
    },
    titleWrapper: {
        paddingHorizontal: 8,
    },

});

export default RoundedCard;
