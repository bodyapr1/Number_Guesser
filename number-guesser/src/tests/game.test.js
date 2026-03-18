import { expect, test, describe, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

const scriptPath = path.resolve(__dirname, '../script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

describe('Number Guesser Unit Tests', () => {
    
    beforeEach(() => {
        // Створюємо HTML, який очікує скрипт
        document.body.innerHTML = `
            <input id="lengthInput" value="4">
            <input id="attemptsInput" value="4">
            <input id="duplicatesInput" type="checkbox">
            <input id="guessInput">
            <div id="results"></div>
            <div id="attemptsDisplay"></div>
            <div id="digitsDisplay"></div>
            <div id="timer">000</div>
        `;

        // Вкидаємо код скрипта в DOM
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptContent;
        document.body.appendChild(scriptElement);
    });

    describe('Логіка перевірки (checkGuess)', () => {
        test('повертає green для повної відповідності', () => {
            const res = window.checkGuess(['1', '2', '3', '4'], ['1', '2', '3', '4']);
            expect(res).toEqual(['green', 'green', 'green', 'green']);
        });

        test('повертає yellow, якщо цифри не на своїх місцях', () => {
            const res = window.checkGuess(['1', '2', '3', '4'], ['4', '3', '2', '1']);
            expect(res).toEqual(['yellow', 'yellow', 'yellow', 'yellow']);
        });

        test('коректно змішує кольори (приклад з лаби)', () => {
            const res = window.checkGuess(['1', '2', '3', '4'], ['1', '5', '2', '9']);
            expect(res).toEqual(['green', 'grey', 'yellow', 'grey']);
        });
    });

    describe('Генерація коду (generateSecretCode)', () => {
        test('генерує код правильної довжини', () => {
            window.codeLength = 5;
            const code = window.generateSecretCode();
            expect(code).toHaveLength(5);
        });

        test('не створює дублікатів, якщо вони вимкнені', () => {
            window.allowDuplicates = false;
            window.codeLength = 10;
            const code = window.generateSecretCode();
            const unique = new Set(code);
            expect(unique.size).toBe(10);
        });
    });

    describe('Таймер та Інтерфейс', () => {
        test('startTimer збільшує значення на екрані', () => {
            vi.useFakeTimers();
            window.startTimer();
            vi.advanceTimersByTime(2000);
            
            expect(document.getElementById('timer').innerText).toBe('002');
            vi.useRealTimers();
        });

        test('makeGuess зменшує кількість спроб', () => {
            window.secretCode = ['1', '2', '3', '4'];
            window.attemptsLeft = 4;
            document.getElementById('guessInput').value = '1111';
            
            window.makeGuess();
            
            expect(window.attemptsLeft).toBe(3);
            expect(document.getElementById('attemptsDisplay').innerText).toBe('3');
        });

        test('валідація: помилка при некоректному вводі', () => {
            const spy = vi.spyOn(window, 'alert').mockImplementation(() => {});
            document.getElementById('guessInput').value = 'abc';
            
            window.makeGuess();
            
            expect(spy).toHaveBeenCalledWith('Enter correct digits!');
            spy.mockRestore();
        });
    });
});