import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle, GestureResponderEvent, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../CustomText';
import { heightPercentageToDP as hpd } from 'react-native-responsive-screen';

interface CustomButtonProps {
  variant: 'primary' | 'secondary' | 'service' | 'round' | 'text' | 'reverse';
  title?: string;
  onPress: (event?: GestureResponderEvent) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  titleColor?: string;
  buttonColor?: string;
  borderColor?: string;
  borderWidth?: number;
  hitSlop?: number;
  activeOpacity?: number;
  // Специфичные пропсы для разных вариантов
  isVisible?: boolean; // для reverse варианта
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant,
  title,
  onPress,
  icon,
  iconColor,
  iconSize,
  disabled = false,
  loading = false,
  size = 'medium',
  style,
  titleColor,
  buttonColor,
  borderColor,
  borderWidth = 0,
  hitSlop = 0,
  activeOpacity = 0.7,
  isVisible,
}) => {
  // Определяем размеры в зависимости от size
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: 8,
          fontSize: 14,
          iconSize: iconSize || 16,
          roundSize: hpd('4'),
        };
      case 'large':
        return {
          padding: 16,
          fontSize: 18,
          iconSize: iconSize || 28,
          roundSize: hpd('8'),
        };
      default: // medium
        return {
          padding: 10,
          fontSize: 16,
          iconSize: iconSize || 24,
          roundSize: hpd('6'),
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Определяем стили в зависимости от варианта
  const getVariantStyles = (): { buttonStyle: ViewStyle; textStyle?: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          buttonStyle: {
            ...styles.primaryButton,
            backgroundColor: buttonColor || '#007AFF',
            borderColor: borderColor,
            borderWidth: borderWidth,
            padding: sizeStyles.padding,
          },
        };

      case 'secondary':
        return {
          buttonStyle: {
            ...styles.secondaryButton,
            backgroundColor: buttonColor || 'transparent',
            borderColor: borderColor || '#007AFF',
            borderWidth: borderWidth || 1,
            padding: sizeStyles.padding,
          },
        };

      case 'service':
        return {
          buttonStyle: {
            ...styles.serviceButton,
            backgroundColor: buttonColor || '#F0F0F0',
            borderColor: borderColor,
            borderWidth: borderWidth,
            padding: sizeStyles.padding,
          },
        };

      case 'round':
        const roundSize = sizeStyles.roundSize;
        return {
          buttonStyle: {
            ...styles.roundButton,
            backgroundColor: buttonColor || '#007AFF',
            width: roundSize,
            height: roundSize,
            borderRadius: roundSize / 2,
            borderColor: borderColor,
            borderWidth: borderWidth,
          },
        };

      case 'text':
        return {
          buttonStyle: {
            ...styles.textButton,
            padding: sizeStyles.padding,
          },
        };

      case 'reverse':
        return {
          buttonStyle: {
            ...styles.reverseButton,
            padding: sizeStyles.padding,
          },
        };

      default:
        return {
          buttonStyle: {
            ...styles.primaryButton,
            backgroundColor: buttonColor || '#007AFF',
            padding: sizeStyles.padding,
          },
        };
    }
  };

  const { buttonStyle } = getVariantStyles();

  // Определяем иконку для reverse варианта
  const getIcon = () => {
    if (variant === 'reverse') {
      return isVisible ? 'eye-off' : 'eye';
    }
    return icon;
  };

  // Определяем цвет иконки
  const getIconColor = () => {
    if (variant === 'reverse') {
      return iconColor || 'gray';
    }
    if (variant === 'round') {
      return iconColor || '#FFFFFF';
    }
    return iconColor || titleColor || '#FFFFFF';
  };

  // Определяем цвет текста
  const getTextColor = () => {
    if (variant === 'secondary') {
      return titleColor || '#007AFF';
    }
    if (variant === 'text') {
      return titleColor || '#007AFF';
    }
    if (variant === 'service') {
      return titleColor || '#000000';
    }
    return titleColor || '#FFFFFF';
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
        />
      );
    }

    const iconElement = getIcon() && (
      <Ionicons
        name={getIcon()!}
        size={sizeStyles.iconSize}
        color={getIconColor()}
        style={variant === 'service' ? styles.serviceIcon : undefined}
      />
    );

    if (variant === 'round' || variant === 'reverse') {
      return iconElement;
    }

    if (variant === 'service') {
      return (
        <>
          <View style={styles.serviceIconWrapper}>
            {iconElement}
          </View>
          {title && (
            <CustomText
              content={title}
              size={sizeStyles.fontSize}
              color={getTextColor()}
              weight="bold"
              textCenter={true}
            />
          )}
        </>
      );
    }

    return (
      <>
        {iconElement}
        {title && (
          <CustomText
            content={title}
            size={sizeStyles.fontSize}
            color={getTextColor()}
            weight="normal"
          />
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={disabled || loading ? undefined : onPress}
      activeOpacity={activeOpacity}
      disabled={disabled || loading}
      hitSlop={variant === 'round' ? {
        top: hitSlop,
        bottom: hitSlop,
        left: hitSlop,
        right: hitSlop,
      } : undefined}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  serviceButton: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIconWrapper: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: {
    marginHorizontal: 10,
  },
  roundButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    marginHorizontal: 5,
  },
  textButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reverseButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CustomButton;