import React, { useRef, useState } from "react";
import { LayoutAnimation, Platform, UIManager, View } from "react-native";
import Gigabar from "./Gigabar";
import { useTheme } from '@/providers/ThemeProvider';
import CustomTextInput from './base/CustomTextInput';
import { useTranslation } from 'react-i18next';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'; // Добавь import Reanimated

// Включи LayoutAnimation для Android
if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NewTaskInput: React.FC<{ onAddTask: (text: string) => void }> = ({ onAddTask }) => {
    const [inputValue, setInputValue] = useState('');
    const { theme } = useTheme();
    const { t } = useTranslation();
    const inputRef = useRef<any>(null);

    // Анимация для опускания поля вниз
    const translateY = useSharedValue(0); // Начальное положение

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const handleSubmit = () => {
        console.log('NewTaskInput:', t('console.addingTask'), inputValue);
        if (inputValue.trim() !== '') {
            try {
                // Анимация layout для всего списка
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

                // Анимация опускания input (с bouncy эффектом)
                translateY.value = withSpring(15, { damping: 10, stiffness: 100 }); // 50px вниз (адаптируй под высоту TaskItem)
                // Сразу после анимации вернём в 0 (после добавления, чтобы не накапливалось)
                setTimeout(() => {
                    translateY.value = withSpring(0); // Сброс для следующего добавления
                }, 300); // Длительность анимации

                onAddTask(inputValue.trim());
                setInputValue('');
                setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                }, 100);
            } catch (error) {
                console.error('NewTaskInput:', t('console.addingTaskError'), error);
            }
        }
    };

    return (
        <Animated.View style={animatedStyle}>
            <View>
                <CustomTextInput
                    ref={inputRef}
                    variant="default"
                    style={{ fontWeight: '700', color: theme.colors.text, paddingVertical: 10, paddingLeft: 10 }}
                    value={inputValue}
                    onChangeText={setInputValue}
                    onSubmitEditing={handleSubmit}
                    placeholderTextColor={theme.colors.background}
                    underlineColorAndroid="transparent"
                    returnKeyType="done"
                    blurOnSubmit={false}
                />
                <Gigabar color={theme.colors.background} size={1} marginHorizontal={6} />
            </View>
        </Animated.View>
    );
};

export default NewTaskInput;