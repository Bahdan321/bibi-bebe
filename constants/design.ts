// Константы дизайн-системы для унификации стилей

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 44,
  sm: 44,
  md: 44,
  lg: 44,
  xl: 44,
  xxl: 44,
  xxxl: 44,
} as const;

export const FONT_WEIGHTS = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

export const COLORS = {
  // Основные цвета
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',

  // Нейтральные цвета
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Фоновые цвета
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },

  // Цвета текста
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Цвета границ
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
} as const;

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
} as const;

export const BUTTON_VARIANTS = {
  primary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    textColor: COLORS.white,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: COLORS.primary,
    textColor: COLORS.primary,
  },
  success: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
    textColor: COLORS.white,
  },
  warning: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
    textColor: COLORS.white,
  },
  error: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
    textColor: COLORS.white,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textColor: COLORS.primary,
  },
} as const;

export const BUTTON_SIZES = {
  small: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    iconSize: 16,
  },
  medium: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.md,
    iconSize: 20,
  },
  large: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: FONT_SIZES.lg,
    iconSize: 24,
  },
} as const;

// Типы для TypeScript
export type SpacingKey = keyof typeof SPACING;
export type FontSizeKey = keyof typeof FONT_SIZES;
export type FontWeightKey = keyof typeof FONT_WEIGHTS;
export type BorderRadiusKey = keyof typeof BORDER_RADIUS;
export type ColorKey = keyof typeof COLORS;
export type ShadowKey = keyof typeof SHADOWS;
export type ButtonVariantKey = keyof typeof BUTTON_VARIANTS;
export type ButtonSizeKey = keyof typeof BUTTON_SIZES;