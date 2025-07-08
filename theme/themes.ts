import { Theme } from '@/theme/types';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, COLORS } from '@/constants/design';

export const lightTheme: Theme = {
  colors: {
    primary: 'white',
    secondary: 'pink',
    third: "#FAEBD7",
    background: 'gray',
    text: 'black',
    error: 'red',
    icon: '#FAEBD7',
    button: 'black',
    settingsBackground: "white",
  },
  spacing: SPACING,
  fontSize: FONT_SIZES,
  fontWeight: FONT_WEIGHTS,
  borderRadius: BORDER_RADIUS,
  designColors: COLORS,
  eisenhowerMatrix: {
    urgentImportant: 'red',
    urgentNotImportant: 'orange',
    notUrgentImportant: 'yellow',
    notUrgentNotImportant: 'green',
  }
};

export const darkTheme: Theme = {
  colors: {
    primary: '#1C2526',
    secondary: 'white',
    third: "#1C1C1C",
    background: 'gray',
    text: 'white',
    error: 'red',
    icon: 'black',
    button: 'white',
    settingsBackground: "#1C2526",
  },
  spacing: SPACING,
  fontSize: FONT_SIZES,
  fontWeight: FONT_WEIGHTS,
  borderRadius: BORDER_RADIUS,
  designColors: COLORS,
  eisenhowerMatrix: {
    urgentImportant: 'red',
    urgentNotImportant: 'orange',
    notUrgentImportant: 'yellow',
    notUrgentNotImportant: 'green',
  }
};

export { Theme };
