import { eachDayOfInterval, startOfWeek, endOfWeek, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const truncateDayOfWeek = (dayOfWeek: string) => {
    const dayMap: { [key: string]: string } = {
        'Понедельник': "Пн",
        'Вторник': "Вт",
        'Среда': "Ср",
        'Четверг': "Чт",
        'Пятница': "Пт",
        'Суббота': "Сб",
        'Воскресенье': "Вс",
        'понедельник': "Пн",
        'вторник': "Вт",
        'среда': "Ср",
        'четверг': "Чт",
        'пятница': "Пт",
        'суббота': "Сб",
        'воскресенье': "Вс",
    }
    return dayMap[dayOfWeek] || dayOfWeek;
}

export const truncateMonth = (month: string) => {
    const monthsMap: { [key: string]: string } = {
        'Январь': "Янв",
        'Февраль': "Фев",
        'Март': "Мар",
        'Апрель': "Апр",
        'Май': "Май",
        'Июнь': "Июн",
        'Июль': "Июл",
        'Август': "Авг",
        'Сентябрь': "Сен",
        'Октябрь': "Окт",
        'Ноябрь': "Ноя",
        'Декабрь': "Дек",
        'январь': "Янв",
        'февраль': "Фев",
        'март': "Мар",
        'апрель': "Апр",
        'май': "Май",
        'июнь': "Июн",
        'июль': "Июл",
        'август': "Авг",
        'сентябрь': "Сен",
        'октябрь': "Окт",
        'ноябрь': "Ноя",
        'декабрь': "Дек",
    }
    return monthsMap[month] || month;
}

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

export const getFormatedDateOfYear = (date: Date) => {

    const formatedData = format(date, 'EEEE, d LLLL yyyy', { locale: ru });
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
    // return `${formatedData[0].toUpperCase()}${formatedData.slice(1)}`;
}

export const ShowCurrentMonth = (date: Date) => {
    const formatedData = format(date, 'LLLL yyyy', { locale: ru });
    return `${formatedData[0].toUpperCase()}${formatedData.slice(1)}`;
};
