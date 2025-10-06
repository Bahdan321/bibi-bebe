# Настройка Apple Sign-In в Apple Developer Console

Ошибка "The authorization attempt failed for an unknown reason" обычно возникает из-за неправильной настройки Apple Sign-In в Apple Developer Console. Следуйте этим инструкциям для правильной настройки:

## 1. Настройка App ID

### Шаг 1: Войдите в Apple Developer Console
1. Перейдите на [developer.apple.com](https://developer.apple.com)
2. Войдите в свой аккаунт разработчика
3. Перейдите в раздел "Certificates, Identifiers & Profiles"

### Шаг 2: Найдите или создайте App ID
1. В левом меню выберите "Identifiers"
2. Найдите App ID с Bundle ID: `com.shulikotwo.bibibebe`
3. Если App ID не существует, создайте новый:
   - Нажмите "+" для создания нового идентификатора
   - Выберите "App IDs"
   - Выберите "App"
   - Введите описание: "BibiBebe App"
   - Bundle ID: `com.shulikotwo.bibibebe`

### Шаг 3: Включите Sign in with Apple
1. Откройте ваш App ID
2. В разделе "Capabilities" найдите "Sign in with Apple"
3. Поставьте галочку напротив "Sign in with Apple"
4. Нажмите "Configure" рядом с "Sign in with Apple"
5. Выберите "Enable as a primary App ID"
6. Нажмите "Save"
7. Нажмите "Continue" и затем "Register"

## 2. Настройка Services ID (для веб-аутентификации)

### Шаг 1: Создайте Services ID
1. В разделе "Identifiers" нажмите "+"
2. Выберите "Services IDs"
3. Введите:
   - Description: "BibiBebe Web Service"
   - Identifier: `com.shulikotwo.bibibebe.service` (должен отличаться от App ID)
4. Поставьте галочку "Sign in with Apple"
5. Нажмите "Configure"

### Шаг 2: Настройте домены и URL
1. В настройках Services ID:
   - Primary App ID: выберите ваш App ID (`com.shulikotwo.bibibebe`)
   - Domains and Subdomains: добавьте домены Supabase:
     - `your-project.supabase.co` (замените на ваш проект)
     - `supabase.co`
   - Return URLs: добавьте:
     - `https://your-project.supabase.co/auth/v1/callback` (замените на ваш проект)
2. Нажмите "Save", затем "Continue" и "Register"

## 3. Создание ключа для Sign in with Apple

### Шаг 1: Создайте новый ключ
1. В левом меню выберите "Keys"
2. Нажмите "+" для создания нового ключа
3. Введите имя ключа: "BibiBebe Apple Sign In Key"
4. Поставьте галочку "Sign in with Apple"
5. Нажмите "Configure" рядом с "Sign in with Apple"
6. Выберите ваш Primary App ID: `com.shulikotwo.bibibebe`
7. Нажмите "Save"
8. Нажмите "Continue" и затем "Register"

### Шаг 2: Скачайте ключ
1. **ВАЖНО**: Скачайте файл ключа (.p8) - его можно скачать только один раз!
2. Сохраните Key ID (10-символьный идентификатор)
3. Запомните Team ID (можно найти в правом верхнем углу консоли)

## 4. Настройка Supabase

### Шаг 1: Настройте Apple Provider в Supabase
1. Войдите в Supabase Dashboard
2. Перейдите в "Authentication" → "Providers"
3. Найдите "Apple" и включите его
4. Заполните поля:
   - **Services ID**: `com.shulikotwo.bibibebe.service`
   - **Team ID**: ваш Team ID из Apple Developer Console
   - **Key ID**: Key ID созданного ключа
   - **Private Key**: содержимое скачанного .p8 файла

### Шаг 2: Проверьте настройки
1. Убедитесь, что все поля заполнены корректно
2. Сохраните настройки

## 5. Проверка настроек в коде

Убедитесь, что в вашем `app.json` есть правильные настройки:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.shulikotwo.bibibebe",
      "usesAppleSignIn": true
    }
  }
}
```

## 6. Тестирование

### Важные моменты:
1. **Apple Sign-In работает только на физических устройствах iOS** - не работает в симуляторе
2. Устройство должно быть залогинено в Apple ID
3. В настройках устройства должен быть включен "Sign in with Apple"

### Шаги для тестирования:
1. Соберите приложение для физического устройства iOS
2. Установите на устройство
3. Попробуйте войти через Apple Sign-In

## Возможные проблемы и решения

### Ошибка "authorization attempt failed for an unknown reason"
- Проверьте, что Bundle ID в коде совпадает с App ID в Apple Developer Console
- Убедитесь, что Sign in with Apple включен для App ID
- Проверьте настройки Services ID
- Убедитесь, что тестируете на физическом устройстве

### Ошибка "invalid_client"
- Проверьте Services ID в настройках Supabase
- Убедитесь, что домены правильно настроены в Services ID

### Ошибка с ключом
- Проверьте, что Private Key правильно скопирован в Supabase
- Убедитесь, что Key ID и Team ID корректны

## Дополнительные ресурсы

- [Документация Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Документация Supabase Apple Auth](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Apple Developer Documentation](https://developer.apple.com/documentation/sign_in_with_apple)

---

**Примечание**: После внесения изменений в Apple Developer Console может потребоваться до 24 часов для полного применения настроек.