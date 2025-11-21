import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { LocalizationProvider } from '@/providers/LocalizationProvider';
import { LayoutProvider } from '@/providers/LayoutProvider';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    }, []);

    return (
        <AuthProvider>
            <LocalizationProvider>
                <ThemeProvider>
                    <LayoutProvider>
                        {children}
                    </LayoutProvider>
                </ThemeProvider>
            </LocalizationProvider>
        </AuthProvider>
    );
};