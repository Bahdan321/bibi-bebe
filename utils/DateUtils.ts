import { eachDayOfInterval, startOfWeek, endOfWeek, format } from 'date-fns';
import { ru } from 'date-fns/locale';

const returnFormatedDate = (date) => {
    return `${date[0].toUpperCase()}${date.slice(1)}`
}

export const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    return days.map(day => ({
        date: format(day, 'yyyy-MM-dd'),
        dayOfWeek: format(day, 'EEEE', { locale: ru })
    }));
};

export const getFormatedDate = (date: Date) => {
    const formatedData = format(date, 'LLLL d', { locale: ru });
    return `${formatedData[0].toUpperCase()}${formatedData.slice(1)}`;
}

export const ShowCurrentMonth = (date: Date) => {
    const formatedData = format(date, 'LLLL yyyy', { locale: ru });
    return `${formatedData[0].toUpperCase()}${formatedData.slice(1)}`;
};
