import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface CustomViewProps {
  variant?: 'card' | 'container' | 'row' | 'column' | 'center' | 'flex';
  padding?: number | 'small' | 'medium' | 'large' | 'none';
  margin?: number | 'small' | 'medium' | 'large' | 'none';
  backgroundColor?: string;
  borderRadius?: number | 'small' | 'medium' | 'large';
  borderWidth?: number;
  borderColor?: string;
  shadowEnabled?: boolean;
  flex?: number;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  style?: ViewStyle;
  children: React.ReactNode;
}

const CustomView: React.FC<CustomViewProps> = ({
  variant = 'container',
  padding = 'medium',
  margin = 'none',
  backgroundColor,
  borderRadius = 'medium',
  borderWidth = 0,
  borderColor,
  shadowEnabled = false,
  flex,
  alignItems,
  justifyContent,
  flexDirection,
  style,
  children,
}) => {
  const { theme } = useTheme();
  
  // Функция для получения числового значения отступов
  const getSpacingValue = (spacing: number | string): number => {
    if (typeof spacing === 'number') return spacing;
    
    switch (spacing) {
      case 'small': return theme.spacing.sm;
      case 'medium': return theme.spacing.md;
      case 'large': return theme.spacing.lg;
      case 'none': return 0;
      default: return theme.spacing.md;
    }
  };

  // Функция для получения значения border radius
  const getBorderRadiusValue = (radius: number | string): number => {
    if (typeof radius === 'number') return radius;
    
    switch (radius) {
      case 'small': return theme.borderRadius.sm;
      case 'medium': return theme.borderRadius.md;
      case 'large': return theme.borderRadius.lg;
      default: return theme.borderRadius.md;
    }
  };

  // Определяем базовые стили в зависимости от варианта
  const getVariantStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      padding: getSpacingValue(padding),
      margin: getSpacingValue(margin),
      borderRadius: getBorderRadiusValue(borderRadius),
      borderWidth,
      borderColor,
      backgroundColor,
    };

    switch (variant) {
      case 'card':
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || '#FFFFFF',
          borderRadius: getBorderRadiusValue(borderRadius),
          ...shadowEnabled && styles.shadow,
        };
      
      case 'container':
        return {
          ...baseStyles,
          flex: flex || 1,
        };
      
      case 'row':
        return {
          ...baseStyles,
          flexDirection: 'row',
          alignItems: alignItems || 'center',
        };
      
      case 'column':
        return {
          ...baseStyles,
          flexDirection: 'column',
        };
      
      case 'center':
        return {
          ...baseStyles,
          alignItems: 'center',
          justifyContent: 'center',
        };
      
      case 'flex':
        return {
          ...baseStyles,
          flex: flex || 1,
          flexDirection: flexDirection || 'column',
          alignItems,
          justifyContent,
        };
      
      default:
        return baseStyles;
    }
  };

  const variantStyles = getVariantStyles();

  // Объединяем все стили
  const finalStyles: ViewStyle = {
    ...variantStyles,
    // Переопределяем специфичные свойства если они переданы напрямую
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(flexDirection && { flexDirection }),
    ...(flex !== undefined && { flex }),
  };

  return (
    <View style={[finalStyles, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default CustomView;