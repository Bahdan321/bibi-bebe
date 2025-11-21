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
  multiline,
  ...props
}) => {
  const { theme } = useTheme();

  const isMultiline = variant === 'description' || multiline;

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
      multiline={isMultiline}
      style={[
        styles.base,
        {
          color: theme.colors.text,
          borderColor: theme.colors.secondary,
          textAlignVertical: isMultiline ? 'top' : 'center',
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