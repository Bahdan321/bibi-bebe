import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface CustomTextInputProps extends TextInputProps {
  variant?: 'default' | 'title' | 'description';
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  variant = 'default',
  style,
  placeholderTextColor,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'title':
        return {
          fontSize: theme.fontSize.xl,
          fontWeight: 'bold' as const,
          marginRight: theme.spacing.sm,
        };
      case 'description':
        return {
          fontSize: theme.fontSize.md,
          textAlignVertical: 'top' as const,
          minHeight: 100,
          lineHeight: 20,
        };
      default:
        return {
          fontSize: theme.fontSize.md,
        };
    }
  };

  return (
    <TextInput
      style={[
        styles.base,
        {
          color: theme.colors.text,
          borderColor: theme.colors.secondary,
        },
        getVariantStyles(),
        style,
      ]}
      placeholderTextColor={placeholderTextColor || theme.colors.secondary}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 0,
    padding: 0,
  },
});

export default CustomTextInput;