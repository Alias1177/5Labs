# 5 Labs Agency — Landing

Лендинг агентства 5 Labs: Vite + React + Tailwind CSS, мультиязычность UA / EN / RU.

## Стек

- **Vite** — дев-сервер и сборка
- **React 18** — UI
- **Tailwind CSS 3** — стили (тёмная тема, палитра Black / Violet `#7D39EB` / Lime `#C6FF33` / White)
- Встроенный **i18n** на React Context (без сторонних зависимостей)

## Старт

```bash
npm install
npm run dev
```

Откроется на `http://localhost:5173`.

## Сборка

```bash
npm run build
npm run preview
```

## Структура

```
src/
├── App.jsx
├── main.jsx
├── index.css            # Tailwind + глобальные стили
├── i18n/
│   ├── I18nContext.jsx  # провайдер, хук useI18n()
│   └── translations.js  # словари UA/EN/RU — тексты менять здесь
└── components/
    ├── Header.jsx       # навигация + дропдауны + бургер
    ├── Logo.jsx
    ├── LangSwitcher.jsx # UA / EN / RU
    ├── Hero.jsx
    ├── About.jsx
    ├── Services.jsx     # Partnership + Premium
    ├── Education.jsx    # Seminars + Individual
    ├── Stats.jsx
    ├── Contact.jsx      # форма
    └── Footer.jsx
```

## Мультиязычность

- Выбранный язык сохраняется в `localStorage` (`5labs-lang`).
- По умолчанию берётся язык браузера, fallback — `ru`.
- Все тексты в `src/i18n/translations.js` — просто замените содержимое, структура одинакова для всех языков.

## Палитра

| Цвет   | Hex       | Использование                        |
| ------ | --------- | ------------------------------------ |
| Black  | `#000000` | Фон                                  |
| Violet | `#7D39EB` | Акцент 1 (Partnership, Seminars)     |
| Lime   | `#C6FF33` | Акцент 2 (CTA, Premium, Individual)  |
| White  | `#FFFFFF` | Основной текст                       |

## Тексты-заглушки

Весь контент — placeholder в духе агентства. Замените тексты в `src/i18n/translations.js`.
