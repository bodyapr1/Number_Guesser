const { test, expect } = require('@playwright/test');

const PATH = 'file:///D:/Bohdan/University/6%20semester/%D0%A3%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D1%96%D0%BD%D0%BD%D1%8F%20IT-%D0%BF%D1%80%D0%BE%D1%94%D0%BA%D1%82%D0%B0%D0%BC%D0%B8/%D0%9B%D0%B0%D0%B1%D0%BE%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BD%D1%96/Number_Guesser/number-guesser/index.html';

test('сторінка завантажується і показує заголовок', async ({ page }) => {
    await page.goto(PATH);
    await expect(page.locator('h1')).toHaveText('Guess the Number');
});

test('гравець вводить неправильну довжину — зявляється alert', async ({ page }) => {
    await page.goto(PATH);

    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Enter correct digits!');
        await dialog.accept();
    });

    await page.fill('#guessInput', '12');
    await page.click('button:has-text("Try")');
});