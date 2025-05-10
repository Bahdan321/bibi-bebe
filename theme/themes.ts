import { Theme } from '@/theme/types';

export const lightTheme: Theme = {
  colors: {
    primary: 'white',
    secondary: 'pink',
    third: "#FAEBD7",
    background: 'gray',
    text: 'black',
    error: 'red',
    icon: 'black',
    button: 'yellow'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  eisenhowerMatrix: {
    urgentImportant: 'red',
    urgentNotImportant: 'orange',
    notUrgentImportant: 'yellow',
    notUrgentNotImportant: 'green',
  }
};

export const darkTheme: Theme = {
  colors: {
    primary: 'black',
    secondary: 'white',
    third: "#1C1C1C",
    background: 'gray',
    text: 'white',
    error: 'red',
    icon: 'black',
    button: 'white'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  eisenhowerMatrix: {
    urgentImportant: 'red',
    urgentNotImportant: 'orange',
    notUrgentImportant: 'yellow',
    notUrgentNotImportant: 'green',
  }
};