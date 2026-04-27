[![CI/CD Pipeline](https://github.com/bodyapr1/Number_Guesser/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/bodyapr1/Number_Guesser/actions/workflows/ci-cd.yml)

# Number Guesser

Проста браузерна гра, у якій потрібно вгадати секретний код із цифр за обмежену кількість спроб. Проєкт побудований на Vite, а для перевірки логіки та сценаріїв використані Vitest і Playwright.

## Можливості

- Налаштування довжини коду.
- Налаштування кількості спроб.
- Режим з повторами або без повторів цифр.
- Таймер часу гри.
- Темна та світла тема.
- Візуальна підказка для кожної цифри: правильна, частково правильна або неправильна.

## Технології

- Vite
- JavaScript (ES modules)
- Vitest
- Playwright

## Запуск проєкту

1. Встановіть залежності:

```bash
npm install
```

2. Запустіть локальний dev-сервер Vite:

```bash
npx vite
```

3. Відкрийте сторінку в браузері за адресою, яку покаже Vite.

## Доступні скрипти

```bash
npm run build
npm run test:unit
npm run test:unit:coverage
npm run test:e2e
npm test
```

## Структура проєкту

```text
index.html
src/
  script.js
  script.test.js
  style.css
e2e/
  game.spec.js
```

## Примітка

У `src/script.js` логіка гри експортується окремо, щоб її було зручно тестувати. Інтеграційні сценарії описані в `e2e/game.spec.js`.


