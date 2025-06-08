/**
 * Helper utilities for working with Expo notifications.
 *
 * Usage:
 *   const id = await scheduleReminder(date, 'My task', 'Don\\'t forget to do it');
 *   // id can be stored if you need to cancel the notification later
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Requests the user for notification permissions, if we do not yet have them.
 * Returns TRUE if we can send notifications, otherwise FALSE.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted) {
        return true;
    }

    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
}

/**
 * Ensures Android notification channel exists (required on Android 8+).
 */
async function ensureAndroidChannel() {
    if (Platform.OS !== 'android') return;

    const defaultChannel = await Notifications.getNotificationChannelAsync('reminders');
    if (!defaultChannel) {
        await Notifications.setNotificationChannelAsync('reminders', {
            name: 'Reminders',
            importance: Notifications.AndroidImportance.DEFAULT,
            sound: 'default',
        });
    }
}

/**
 * Schedules a local notification at the given date/time.
 *
 * @param date   Exact fire date
 * @param title  Notification title
 * @param body   Notification body text
 * @returns      The scheduled notification identifier, or null if permissions denied
 */
export async function scheduleReminder(
    date: Date,
    title: string,
    body: string,
): Promise<string | null> {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
        console.warn('Notification permissions not granted');
        return null;
    }

    await ensureAndroidChannel();

    const identifier = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: 'default',
        },
        trigger: date as unknown as Notifications.NotificationTriggerInput,
    });

    return identifier;
}
