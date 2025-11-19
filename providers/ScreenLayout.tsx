import React from 'react';
import { ViewStyle } from 'react-native';
import { ScreenFrame } from '@/components/base/ScreenFrame';

interface ScreenLayoutProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children, style, contentContainerStyle }) => {
    return (
        <ScreenFrame style={style} contentContainerStyle={contentContainerStyle}>
            {children}
        </ScreenFrame>
    );
};