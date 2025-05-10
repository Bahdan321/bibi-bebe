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
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  eisenhowerMatrix: {
    urgentImportant: string;
    urgentNotImportant: string;
    notUrgentImportant: string;
    notUrgentNotImportant: string;
  };
}