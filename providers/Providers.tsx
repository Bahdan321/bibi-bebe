import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { scheduleTaskReminder, registerTaskReminderCategory } from '@/utils/notifications';
import { tasks$ } from '@/Supabase/utils/SupaLegend';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { LocalizationProvider } from '@/providers/LocalizationProvider';
import { LayoutProvider } from '@/providers/LayoutProvider';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowBanner: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });

        registerTaskReminderCategory();

        const sub = Notifications.addNotificationResponseReceivedListener(async (response) => {
            const action = response.actionIdentifier;
            const data: any = response.notification.request.content.data || {};
            const taskId: string | undefined = data.taskId;
            const title: string = data.title || '';
            const dateISO: string | undefined = data.dateISO || undefined;
            const hours: number | undefined = typeof data.hours === 'number' ? data.hours : undefined;
            const minutes: number | undefined = typeof data.minutes === 'number' ? data.minutes : undefined;

            if (action === 'SNOOZE_1H') {
                const base = new Date();
                const snooze = new Date(base.getTime() + 60 * 60 * 1000);
                const h = snooze.getHours();
                const m = snooze.getMinutes();
                await scheduleTaskReminder(title, snooze.toISOString(), h, m, taskId);
                return;
            }

            const id = taskId;
            if (id) {
                const task = (tasks$ as any)[id]?.get?.() || null;
                const params: any = { task: task ? JSON.stringify(task) : JSON.stringify({ id, title, description: '' }), date: dateISO };
                router.push({ pathname: '/(private)/taskMenu', params });
            }
        });

        return () => {
            sub.remove();
        };
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