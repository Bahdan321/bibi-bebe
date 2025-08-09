// Экспорт всех базовых компонентов для удобного импорта

export { default as CustomButton } from './CustomButton';
export { default as CustomText } from './CustomText';
export { default as CustomTextInput } from './CustomTextInput';
export { default as CustomTouchable } from './CustomTouchable';
export { default as CustomView } from './CustomView';
export { default as CustomModal } from './CustomModal';

// Реэкспорт типов из types.ts
export type { CustomButtonProps, CustomViewProps, CustomTouchableProps } from '../../types/types';
export type { CustomModalProps } from './CustomModal';