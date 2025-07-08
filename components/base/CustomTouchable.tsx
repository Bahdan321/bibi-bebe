import React from 'react';
import { TouchableOpacity, ViewStyle, GestureResponderEvent, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface CustomTouchableProps {
  onPress: (event?: GestureResponderEvent) => void;
  disabled?: boolean;
  activeOpacity?: number;
  hitSlop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  style?: ViewStyle;
  children: React.ReactNode;
  // Дополнительные опции для удобства
  padding?: number | 'small' | 'medium' | 'large' | 'none';
  margin?: number | 'small' | 'medium' | 'large' | 'none';
  borderRadius?: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  flex?: number;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
}

const CustomTouchable: React.FC<CustomTouchableProps> = ({
  onPress,
  disabled = false,
  activeOpacity = 0.7,
  hitSlop,
  style,
  children,
  padding,
  margin,
  borderRadius,
  backgroundColor,
  borderWidth,
  borderColor,
  flex,
  alignItems,
  justifyContent,
  flexDirection,
}) => {
  const { theme } = useTheme();
  
  // Функция для получения числового значения отступов
  const getSpacingValue = (spacing: number | string | undefined): number | undefined => {
    if (spacing === undefined) return undefined;
    if (typeof spacing === 'number') return spacing;
    
    switch (spacing) {
      case 'small': return theme.spacing.sm;
      case 'medium': return theme.spacing.md;
      case 'large': return theme.spacing.lg;
      case 'none': return 0;
      default: return undefined;
    }
  };

  // Создаем динамические стили
  const dynamicStyles: ViewStyle = {
    ...(padding !== undefined && { padding: getSpacingValue(padding) }),
    ...(margin !== undefined && { margin: getSpacingValue(margin) }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...(backgroundColor && { backgroundColor }),
    ...(borderWidth !== undefined && { borderWidth }),
    ...(borderColor && { borderColor }),
    ...(flex !== undefined && { flex }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(flexDirection && { flexDirection }),
  };

  return (
    <TouchableOpacity
      style={[
        dynamicStyles,
        disabled && styles.disabled,
        style,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
      hitSlop={hitSlop}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

export default CustomTouchable;