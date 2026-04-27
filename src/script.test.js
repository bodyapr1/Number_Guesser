const { generateSecretCode, checkGuess } = require('./script.js');

describe('generateSecretCode', () => {

    test('генерує код правильної довжини', () => {
        const code = generateSecretCode(4, false);
        expect(code).toHaveLength(4);
    });

    test('без дублікатів — всі цифри унікальні', () => {
        const code = generateSecretCode(4, false);
        const unique = new Set(code);
        expect(unique.size).toBe(4);
    });

    test('з дублікатами — довжина все одно правильна', () => {
        const code = generateSecretCode(4, true);
        expect(code).toHaveLength(4);
    });

    test('всі елементи є рядками цифр', () => {
        const code = generateSecretCode(4, false);
        code.forEach(d => expect(d).toMatch(/^\d$/));
    });

});

describe('checkGuess', () => {

    test('повністю правильна відповідь — всі green', () => {
        const result = checkGuess(['1','2','3','4'], ['1','2','3','4'], 4);
        expect(result).toEqual(['green','green','green','green']);
    });

    test('повністю неправильна відповідь — всі grey', () => {
        const result = checkGuess(['1','2','3','4'], ['5','6','7','8'], 4);
        expect(result).toEqual(['grey','grey','grey','grey']);
    });

    test('правильна цифра не на своєму місці — yellow', () => {
        const result = checkGuess(['1','2','3','4'], ['2','1','4','3'], 4);
        expect(result).toEqual(['yellow','yellow','yellow','yellow']);
    });

    test('змішаний результат', () => {
        const result = checkGuess(['1','2','3','4'], ['1','5','3','8'], 4);
        expect(result).toEqual(['green','grey','green','grey']);
    });

});