import { eachDayOfInterval, startOfWeek, endOfWeek, format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import i18n from '@/lib/i18n';

export const truncateDayOfWeek = (dayOfWeek: string) => {
    // Get current language from i18n
    const currentLanguage = i18n.language;
    
    // Map full day names to truncated versions using translation keys
    const dayMapping: { [key: string]: string } = {
        // Russian mappings
        'Понедельник': i18n.t('calendar.daysOfWeekTruncated.monday'),
        'Вторник': i18n.t('calendar.daysOfWeekTruncated.tuesday'),
        'Среда': i18n.t('calendar.daysOfWeekTruncated.wednesday'),
        'Четверг': i18n.t('calendar.daysOfWeekTruncated.thursday'),
        'Пятница': i18n.t('calendar.daysOfWeekTruncated.friday'),
        'Суббота': i18n.t('calendar.daysOfWeekTruncated.saturday'),
        'Воскресенье': i18n.t('calendar.daysOfWeekTruncated.sunday'),
        'понедельник': i18n.t('calendar.daysOfWeekTruncated.monday'),
        'вторник': i18n.t('calendar.daysOfWeekTruncated.tuesday'),
        'среда': i18n.t('calendar.daysOfWeekTruncated.wednesday'),
        'четверг': i18n.t('calendar.daysOfWeekTruncated.thursday'),
        'пятница': i18n.t('calendar.daysOfWeekTruncated.friday'),
        'суббота': i18n.t('calendar.daysOfWeekTruncated.saturday'),
        'воскресенье': i18n.t('calendar.daysOfWeekTruncated.sunday'),
        // English mappings
        'Monday': i18n.t('calendar.daysOfWeekTruncated.monday'),
        'Tuesday': i18n.t('calendar.daysOfWeekTruncated.tuesday'),
        'Wednesday': i18n.t('calendar.daysOfWeekTruncated.wednesday'),
        'Thursday': i18n.t('calendar.daysOfWeekTruncated.thursday'),
        'Friday': i18n.t('calendar.daysOfWeekTruncated.friday'),
        'Saturday': i18n.t('calendar.daysOfWeekTruncated.saturday'),
        'Sunday': i18n.t('calendar.daysOfWeekTruncated.sunday'),
        'monday': i18n.t('calendar.daysOfWeekTruncated.monday'),
        'tuesday': i18n.t('calendar.daysOfWeekTruncated.tuesday'),
        'wednesday': i18n.t('calendar.daysOfWeekTruncated.wednesday'),
        'thursday': i18n.t('calendar.daysOfWeekTruncated.thursday'),
        'friday': i18n.t('calendar.daysOfWeekTruncated.friday'),
        'saturday': i18n.t('calendar.daysOfWeekTruncated.saturday'),
        'sunday': i18n.t('calendar.daysOfWeekTruncated.sunday'),
    };
    
    return dayMapping[dayOfWeek] || dayOfWeek;
};

export const truncateMonth = (month: string) => {
    // Map full month names to truncated versions using translation keys
    const monthMapping: { [key: string]: string } = {
        // Russian mappings
        'Январь': i18n.t('calendar.monthsTruncated.january'),
        'Февраль': i18n.t('calendar.monthsTruncated.february'),
        'Март': i18n.t('calendar.monthsTruncated.march'),
        'Апрель': i18n.t('calendar.monthsTruncated.april'),
        'Май': i18n.t('calendar.monthsTruncated.may'),
        'Июнь': i18n.t('calendar.monthsTruncated.june'),
        'Июль': i18n.t('calendar.monthsTruncated.july'),
        'Август': i18n.t('calendar.monthsTruncated.august'),
        'Сентябрь': i18n.t('calendar.monthsTruncated.september'),
        'Октябрь': i18n.t('calendar.monthsTruncated.october'),
        'Ноябрь': i18n.t('calendar.monthsTruncated.november'),
        'Декабрь': i18n.t('calendar.monthsTruncated.december'),
        'январь': i18n.t('calendar.monthsTruncated.january'),
        'февраль': i18n.t('calendar.monthsTruncated.february'),
        'март': i18n.t('calendar.monthsTruncated.march'),
        'апрель': i18n.t('calendar.monthsTruncated.april'),
        'май': i18n.t('calendar.monthsTruncated.may'),
        'июнь': i18n.t('calendar.monthsTruncated.june'),
        'июль': i18n.t('calendar.monthsTruncated.july'),
        'август': i18n.t('calendar.monthsTruncated.august'),
        'сентябрь': i18n.t('calendar.monthsTruncated.september'),
        'октябрь': i18n.t('calendar.monthsTruncated.october'),
        'ноябрь': i18n.t('calendar.monthsTruncated.november'),
        'декабрь': i18n.t('calendar.monthsTruncated.december'),
        // English mappings
        'January': i18n.t('calendar.monthsTruncated.january'),
        'February': i18n.t('calendar.monthsTruncated.february'),
        'March': i18n.t('calendar.monthsTruncated.march'),
        'April': i18n.t('calendar.monthsTruncated.april'),
        'May': i18n.t('calendar.monthsTruncated.may'),
        'June': i18n.t('calendar.monthsTruncated.june'),
        'July': i18n.t('calendar.monthsTruncated.july'),
        'August': i18n.t('calendar.monthsTruncated.august'),
        'September': i18n.t('calendar.monthsTruncated.september'),
        'October': i18n.t('calendar.monthsTruncated.october'),
        'November': i18n.t('calendar.monthsTruncated.november'),
        'December': i18n.t('calendar.monthsTruncated.december'),
        'january': i18n.t('calendar.monthsTruncated.january'),
        'february': i18n.t('calendar.monthsTruncated.february'),
        'march': i18n.t('calendar.monthsTruncated.march'),
        'april': i18n.t('calendar.monthsTruncated.april'),
        'may': i18n.t('calendar.monthsTruncated.may'),
        'june': i18n.t('calendar.monthsTruncated.june'),
        'july': i18n.t('calendar.monthsTruncated.july'),
        'august': i18n.t('calendar.monthsTruncated.august'),
        'september': i18n.t('calendar.monthsTruncated.september'),
        'october': i18n.t('calendar.monthsTruncated.october'),
        'november': i18n.t('calendar.monthsTruncated.november'),
        'december': i18n.t('calendar.monthsTruncated.december'),
    };
    
    return monthMapping[month] || month;
};

// Helper function to get the current locale for date-fns
const getCurrentLocale = () => {
    const currentLanguage = i18n.language;
    return currentLanguage === 'ru' ? ru : enUS;
};

const returnFormatedDate = (date: string) => {
    return `${date[0].toUpperCase()}${date.slice(1)}`;
};

export const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    return days.map(day => ({
        date: format(day, 'yyyy-MM-dd'),
        dayOfWeek: format(day, 'EEEE', { locale: getCurrentLocale() })
    }));
};

export const getFormatedDate = (date: Date) => {
    const formatedData = format(date, 'LLLL d', { locale: getCurrentLocale() });
    return `${formatedData[0].toUpperCase()}${formatedData.slice(1)}`;
}

export const getFormatedDateOfYear = (date: Date) => {
    const formatedData = format(date, 'EEEE, d LLLL yyyy', { locale: getCurrentLocale() });
    let dayOfWeek = formatedData.split(',')[0];
    let dayOfMonth = formatedData.split(',')[1].split(' ')[1];
    let month = formatedData.split(',')[1].split(' ')[2];
    let year = formatedData.split(',')[1].split(' ')[3];
    dayOfWeek = truncateDayOfWeek(dayOfWeek);
    month = month.charAt(0).toUpperCase() + month.slice(1);
    month = truncateMonth(month);
    dayOfMonth = dayOfMonth.charAt(0).toUpperCase() + dayOfMonth.slice(1);
    year = year.charAt(0).toUpperCase() + year.slice(1);
    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
}

export const ShowCurrentMonth = (date: Date) => {
    const formatedData = format(date, 'LLLL yyyy', { locale: getCurrentLocale() });
    return `${formatedData[0].toUpperCase()}${formatedData.slice(1)}`;
};

export const ShowCurrentYear = (date: Date) => {
    return format(date, 'yyyy', { locale: getCurrentLocale() });
};
