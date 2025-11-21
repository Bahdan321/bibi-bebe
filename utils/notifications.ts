import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import i18n from '@/lib/i18n';

export async function requestNotificationPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  let granted = !!current.granted || (Platform.OS === 'ios' && (current.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED));
  if (!granted) {
    const res = await Notifications.requestPermissionsAsync();
    granted = !!res.granted || (Platform.OS === 'ios' && (res.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED));
  }
  return granted;
}

export async function scheduleTaskReminder(title: string, dateISO: string | null | undefined, hours: number, minutes: number, taskId?: string): Promise<string> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    throw new Error('permission_denied');
  }

  let baseDate = dateISO ? new Date(dateISO) : new Date();
  if (isNaN(baseDate.getTime())) baseDate = new Date();

  const triggerDate = new Date(baseDate);
  triggerDate.setHours(hours, minutes, 0, 0);

  if (triggerDate.getTime() <= Date.now()) {
    throw new Error('past_time');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notifications.reminderTitle'),
      body: i18n.t('notifications.reminderBody', { title }),
      sound: true,
      priority: Notifications.AndroidNotificationPriority.DEFAULT,
      categoryIdentifier: 'task_reminder',
      data: { taskId, dateISO, hours, minutes, title },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate, channelId: Platform.OS === 'android' ? 'reminders' : undefined },
  });
  return id;
}

export async function registerTaskReminderCategory() {
  await Notifications.setNotificationCategoryAsync('task_reminder', [
    {
      identifier: 'SNOOZE_1H',
      buttonTitle: 'Отложить на 1 час',
      options: { opensAppToForeground: true },
    },
    {
      identifier: 'OPEN_TASK',
      buttonTitle: 'Выполнить',
      options: { opensAppToForeground: true },
    },
  ]);
}