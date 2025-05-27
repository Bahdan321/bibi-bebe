import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    Dimensions,
} from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
} from 'react-native-reanimated';
import RoundButton from '@/components/RoundButton';
import CustomText from '@/components/CustomText';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '@/providers/ThemeProvider';
import { NavigatePanelProps } from '@/types/types';
import { ShowCurrentMonth } from '@/utils/DateUtils';
import { observer } from '@legendapp/state/react';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NavigatePanel: React.FC<NavigatePanelProps> = observer(
    ({ currentDate, goToNextWeek, goToPreviousWeek }) => {
        const { theme } = useTheme();
        const translateX = useSharedValue(0);

        const slideLeft = () => {
            console.log("321")
            translateX.value = withTiming(-SCREEN_WIDTH, { duration: 400 });
        };

        const slideRight = () => {
            console.log("123")
            translateX.value = withTiming(0, { duration: 400 });
        };

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ translateX: translateX.value }],
        }));
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'position' : 'height'}
                keyboardVerticalOffset={0}
            >
                <View style={[styles.panel, { backgroundColor: theme.colors.primary }]}>
                    <Animated.View
                        style={[
                            styles.sliderContainer,
                            { width: SCREEN_WIDTH * 2 },
                            animatedStyle,
                        ]}
                    >
                        {/* PAGE 1 — default set */}
                        <View style={[styles.buttonsPage, { width: SCREEN_WIDTH }]}>
                            <View style={styles.leftContainer}>
                                <CustomText
                                    content={ShowCurrentMonth(currentDate)}
                                    size={Platform.OS === 'ios' ? hp('2') : hp('2.8')}
                                    color={theme.colors.text}
                                    weight="700"
                                />
                            </View>
                            <RoundButton
                                iconName="chevron-back-outline"
                                iconColor={theme.colors.icon}
                                buttonColor={theme.colors.button}
                                onPress={goToPreviousWeek}
                                size={hp('6')}
                                borderWidth={0}
                            />
                            <RoundButton
                                iconName="chevron-forward-outline"
                                iconColor={theme.colors.icon}
                                buttonColor={theme.colors.button}
                                onPress={goToNextWeek}
                                size={hp('6')}
                                borderWidth={0}
                            />
                            <RoundButton
                                iconName="grid"
                                iconColor={theme.colors.icon}
                                buttonColor={theme.colors.button}
                                onPress={slideLeft}
                                size={hp('6')}
                                borderWidth={0}
                            />
                        </View>

                        {/* PAGE 2 — alternative set */}
                        <View style={[styles.buttonsPage, { width: SCREEN_WIDTH }]}>
                            <RoundButton
                                iconName="ellipse-sharp"
                                iconColor={theme.colors.icon}
                                buttonColor={theme.colors.button}
                                onPress={() => { router.push("/(private)/settings") }}
                                size={hp('6')}
                                borderWidth={0}
                            />
                            <RoundButton
                                iconName="copy-outline"
                                iconColor={theme.colors.icon}
                                buttonColor={theme.colors.button}
                                onPress={() => { router.push("/(private)/kakoetoMenu") }}
                                size={hp('6')}
                                borderWidth={0}
                            />
                            <RoundButton
                                iconName="calendar-clear"
                                iconColor={theme.colors.icon}
                                buttonColor={theme.colors.button}
                                onPress={() => { router.push("/(private)/goals") }}
                                size={hp('6')}
                                borderWidth={0}
                            />
                            <RoundButton
                                iconName="browsers-outline"
                                iconColor={theme.colors.icon}
                                buttonColor={theme.colors.button}
                                onPress={() => { router.push("/(private)/spaces") }}
                                size={hp('6')}
                                borderWidth={0}
                            />
                            <RoundButton
                                iconName="person"
                                iconColor={theme.colors.icon}
                                buttonColor={theme.colors.button}
                                onPress={() => { router.push("/(private)/profile") }}
                                size={hp('6')}
                                borderWidth={0}
                            />
                            <RoundButton
                                iconName="arrow-back"
                                iconColor={theme.colors.icon}
                                buttonColor={theme.colors.button}
                                onPress={slideRight}
                                size={hp('6')}
                                borderWidth={0}
                            />
                        </View>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        );
    },
);

const styles = StyleSheet.create({
    /* Root panel */
    panel: {
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden', // hide sliding content
    },

    /* Month label */
    leftContainer: {
        position: 'absolute',
        left: 0,
        justifyContent: 'center',
        alignContent: 'center',
        paddingLeft: 20,
    },

    /* Slider wrapper */
    sliderContainer: {
        position: 'absolute',
        left: 0,
        flexDirection: 'row',
    },

    /* Individual page */
    buttonsPage: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 20,
    },
});

export default NavigatePanel;
