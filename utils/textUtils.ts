/**
 * Утилиты для работы с текстом
 */

/**
 * Определяет размер текста в зависимости от его длины
 * @param text - текст для анализа
 * @param type - тип текста (username, title, email)
 * @returns размер текста для CustomText компонента
 */
export const getAdaptiveTextSize = (
  text: string | undefined | null,
  type: 'username' | 'title' | 'email'
): 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl' => {
  if (!text) {
    // Возвращаем размер по умолчанию для каждого типа
    switch (type) {
      case 'username':
        return 'xxxl';
      case 'title':
        return 'lg';
      case 'email':
        return 'md';
      default:
        return 'md';
    }
  }

  const textLength = text.length;

  switch (type) {
    case 'username':
      if (textLength <= 8) return 'xxl';
      if (textLength <= 12) return 'xl';
      if (textLength <= 16) return 'md';
      if (textLength <= 20) return 'sm';
      return 'md';

    case 'title':
      if (textLength <= 15) return 'md';
      if (textLength <= 25) return 'sm';
      return 'sm';

    case 'email':
      if (textLength <= 20) return 'md';
      if (textLength <= 30) return 'sm';
      return 'sm';

    default:
      return 'md';
  }
};

/**
 * Обрезает текст до указанной длины с добавлением многоточия
 * @param text - исходный текст
 * @param maxLength - максимальная длина
 * @returns обрезанный текст с многоточием
 */
export const truncateText = (text: string | undefined | null, maxLength: number): string => {
  if (!text) return '';

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Проверяет, является ли текст слишком длинным для отображения
 * @param text - текст для проверки
 * @param type - тип текста
 * @returns true, если текст слишком длинный
 */
export const isTextTooLong = (
  text: string | undefined | null,
  type: 'username' | 'title' | 'email'
): boolean => {
  if (!text) return false;

  const limits = {
    username: 25,
    title: 40,
    email: 35
  };

  return text.length > limits[type];
};