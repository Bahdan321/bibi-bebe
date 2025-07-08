import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    interpolate,
    runOnJS,
    withSequence,
} from 'react-native-reanimated';
import CustomButton from '@/components/base/CustomButton';
import CustomText from '@/components/base/CustomText';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useTheme } from '@/providers/ThemeProvider';
import { NavigatePanelProps } from '@/types/types';
import { ShowCurrentMonth, ShowCurrentYear } from '@/utils/DateUtils';
import { observer } from '@legendapp/state/react';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NavigatePanel: React.FC<NavigatePanelProps> = observer(
    ({
        currentDate,
        goToNextWeek,
        goToPreviousWeek,
        goToNextYear,
        goToPreviousYear,
        isMonthView = false,
        toggleView,
        onOpenSettings,
        onOpenProfile,
        onOpenSpaces,
        onOpenKakoetoMenu,
        onOpenGoals
    }) => {
        const { theme } = useTheme();
        const translateX = useSharedValue(0);
        const textAnimationValue = useSharedValue(isMonthView ? 1 : 0);
        const navigationAnimationValue = useSharedValue(0);
        const [isAnimating, setIsAnimating] = React.useState(false);

        // Обновляем анимацию текста при изменении isMonthView
        React.useEffect(() => {
            setIsAnimating(true);
            textAnimationValue.value = withTiming(isMonthView ? 1 : 0, {
                duration: 400
            }, () => {
                runOnJS(setIsAnimating)(false);
            });
        }, [isMonthView]);

        const slideLeft = () => {
            translateX.value = withTiming(-SCREEN_WIDTH, { duration: 400 });
        };

        const slideRight = () => {
            translateX.value = withTiming(0, { duration: 400 });
        };

        const handleTextPress = () => {
            if (toggleView && !isAnimating) {
                toggleView();
            }
        };

        const animateNavigation = (callback: () => void) => {
            navigationAnimationValue.value = withSequence(
                withTiming(1, { duration: 150 }),
                withTiming(0, { duration: 150 })
            );
            callback();
        };

        const handleNavigation = () => {
            if (isMonthView) {
                // В месячном режиме навигация по годам
                return {
                    onPrevious: () => animateNavigation(goToPreviousYear || (() => { })),
                    onNext: () => animateNavigation(goToNextYear || (() => { }))
                };
            } else {
                // В недельном режиме навигация по неделям
                return {
                    onPrevious: () => animateNavigation(goToPreviousWeek),
                    onNext: () => animateNavigation(goToNextWeek)
                };
            }
        };

        const navigation = handleNavigation();

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ translateX: translateX.value }],
        }));

        const monthAnimatedStyle = useAnimatedStyle(() => {
            const opacity = interpolate(textAnimationValue.value, [0, 1], [1, 0]);
            const translateY = interpolate(textAnimationValue.value, [0, 1], [0, -10]);
            return {
                opacity,
                transform: [{ translateY }],
            };
        });

        const yearAnimatedStyle = useAnimatedStyle(() => {
            const opacity = interpolate(textAnimationValue.value, [0, 1], [0, 1]);
            const translateY = interpolate(textAnimationValue.value, [0, 1], [10, 0]);
            return {
                opacity,
                transform: [{ translateY }],
                position: 'absolute' as const,
            };
        });

        const navigationAnimatedStyle = useAnimatedStyle(() => {
            const scale = interpolate(navigationAnimationValue.value, [0, 1], [1, 0.95]);
            const opacity = interpolate(navigationAnimationValue.value, [0, 1], [1, 0.7]);
            return {
                transform: [{ scale }],
                opacity,
            };
        });
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
                            <TouchableOpacity
                                style={[styles.leftContainer, isAnimating && styles.disabled]}
                                onPress={handleTextPress}
                                activeOpacity={isAnimating ? 1 : 0.7}
                                disabled={isAnimating}
                            >
                                <View style={styles.textContainer}>
                                    <Animated.View style={monthAnimatedStyle}>
                                        <CustomText
                                            content={ShowCurrentMonth(currentDate)}
                                            size={hp('2.8')}
                                            color={theme.colors.text}
                                            weight="700"
                                        />
                                    </Animated.View>
                                    <Animated.View style={yearAnimatedStyle}>
                                        <CustomText
                                            content={ShowCurrentYear(currentDate)}
                                            size={hp('3.8')}
                                            color={theme.colors.text}
                                            weight="700"
                                        />
                                    </Animated.View>
                                </View>
                            </TouchableOpacity>
                            <Animated.View style={navigationAnimatedStyle}>
                                <CustomButton
                                    variant="round"
                                    size="medium"
                                    icon="chevron-back-outline"
                                    iconColor={theme.colors.icon}
                                    onPress={navigation.onPrevious}
                                    style={{ backgroundColor: theme.colors.button, width: hp('6'), height: hp('6') }}
                                />
                            </Animated.View>
                            <Animated.View style={navigationAnimatedStyle}>
                                <CustomButton
                                    variant="round"
                                    size="medium"
                                    icon="chevron-forward-outline"
                                    iconColor={theme.colors.icon}
                                    onPress={navigation.onNext}
                                    style={{ backgroundColor: theme.colors.button, width: hp('6'), height: hp('6') }}
                                />
                            </Animated.View>
                            <CustomButton
                                variant="round"
                                size="medium"
                                icon="grid"
                                iconColor={theme.colors.icon}
                                onPress={slideLeft}
                                style={{ backgroundColor: theme.colors.button, width: hp('6'), height: hp('6') }}
                            />
                        </View>

                        {/* PAGE 2 — alternative set */}
                        <View style={[styles.buttonsPage, { width: SCREEN_WIDTH }]}>
                            <CustomButton
                                variant="round"
                                size="medium"
                                icon="ellipse-sharp"
                                iconColor={theme.colors.icon}
                                onPress={onOpenSettings || (() => { })}
                                style={{ backgroundColor: theme.colors.button, width: hp('6'), height: hp('6') }}
                            />
                            <CustomButton
                                variant="round"
                                size="medium"
                                icon="copy-outline"
                                iconColor={theme.colors.icon}
                                onPress={onOpenKakoetoMenu || (() => { })}
                                style={{ backgroundColor: theme.colors.button, width: hp('6'), height: hp('6') }}
                            />
                            <CustomButton
                                variant="round"
                                size="medium"
                                icon="calendar-clear"
                                iconColor={theme.colors.icon}
                                onPress={onOpenGoals || (() => { })}
                                style={{ backgroundColor: theme.colors.button, width: hp('6'), height: hp('6') }}
                            />
                            <CustomButton
                                variant="round"
                                size="medium"
                                icon="browsers-outline"
                                iconColor={theme.colors.icon}
                                onPress={onOpenSpaces || (() => { })}
                                style={{ backgroundColor: theme.colors.button, width: hp('6'), height: hp('6') }}
                            />
                            <CustomButton
                                variant="round"
                                size="medium"
                                icon="person"
                                iconColor={theme.colors.icon}
                                onPress={onOpenProfile || (() => { })}
                                style={{ backgroundColor: theme.colors.button, width: hp('6'), height: hp('6') }}
                            />
                            <CustomButton
                                variant="round"
                                size="medium"
                                icon="arrow-back"
                                iconColor={theme.colors.icon}
                                onPress={slideRight}
                                style={{ backgroundColor: theme.colors.button, width: hp('6'), height: hp('6') }}
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

    /* Text container for animations */
    textContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: hp('3.5'),
    },

    /* Disabled state */
    disabled: {
        opacity: 0.6,
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
        paddingRight: Platform.OS === "ios" ? 28 : 20,
    },
});

export default NavigatePanel;
