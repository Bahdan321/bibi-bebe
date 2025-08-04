import { Theme } from '@/theme/types';
import { SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, COLORS } from '@/constants/design';

export const lightTheme: Theme = {
  colors: {
    primary: 'white',
    secondary: '#C8A2C8',
    third: "#FAEBD7",
    background: 'gray',
    text: '#7FD8BE',
    error: 'red',
    icon: '#FAEBD7',
    button: '#7FD8BE',
    finishedTask: '#C8A2C8',
    unfinishedTask: '#7FD8BE',
    currentDay: '#4169E1',
    profileButton: "#7FD8BE",
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
    finishedTask: 'white',
    unfinishedTask: 'white',
    currentDay: '#008080',
    profileButton: "#1C2526",
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
