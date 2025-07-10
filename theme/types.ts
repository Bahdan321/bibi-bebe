import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, COLORS } from '@/constants/design';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    third: string;
    background: string;
    text: string;
    error: string;
    icon: string;
    button: string;
    finishedTask: string;
    unfinishedTask: string;
    currentDay: string;
    settingsBackground: string;
  };
  spacing: typeof SPACING;
  fontSize: typeof FONT_SIZES;
  fontWeight: typeof FONT_WEIGHTS;
  borderRadius: typeof BORDER_RADIUS;
  designColors: typeof COLORS;
  eisenhowerMatrix: {
    urgentImportant: string;
    urgentNotImportant: string;
    notUrgentImportant: string;
    notUrgentNotImportant: string;
  };
}