// Константи для кольорів
export const COLORS = {
    GREEN: '#03C03C',
    YELLOW: '#FFD700',
    GREY: '#BEBEBE',
    ORANGE: '#FFA500',
    LIME: '#BFFF00'
};

// Стан гри (чисті дані)
export function createInitialState() {
    return {
        secretCode: [],
        codeLength: 4,
        attemptsLeft: 4,
        attemptsLimit: 4,
        allowDuplicates: false,
        timerSeconds: 0,
        timerRunning: false,
        gameStarted: false,
        guessesResults: []
    };
}

// Генерація секретного коду
export function generateSecretCode(length, allowDuplicates) {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    if (!allowDuplicates) {
        if (length > 10) length = 10;
        const shuffled = [...digits].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, length);
    } else {
        const code = [];
        for (let i = 0; i < length; i++) {
            code.push(digits[Math.floor(Math.random() * 10)]);
        }
        return code;
    }
}

// Перевірка припущення
export function checkGuess(secretCode, guess) {
    if (!Array.isArray(secretCode) || !Array.isArray(guess) || 
        secretCode.length !== guess.length) {
        return Array(guess?.length || 0).fill(COLORS.GREY);
    }

    const n = secretCode.length;
    const finalColors = Array(n).fill(COLORS.GREY);
    const secretCopy = [...secretCode];
    const guessCopy = [...guess];

    // Точні збіги (зелені)
    for (let i = 0; i < n; i++) {
        if (guessCopy[i] === secretCopy[i]) {
            finalColors[i] = COLORS.GREEN;
            secretCopy[i] = null;
            guessCopy[i] = null;
        }
    }

    // Неправильні позиції (жовті)
    for (let i = 0; i < n; i++) {
        if (guessCopy[i] !== null) {
            const index = secretCopy.indexOf(guessCopy[i]);
            if (index !== -1) {
                finalColors[i] = COLORS.YELLOW;
                secretCopy[index] = null;
            }
        }
    }

    return finalColors;
}

// Перевірка перемоги
export function isWin(colors) {
    return colors.every(color => color === COLORS.GREEN);
}

// Валідація введення
export function validateInput(input, expectedLength) {
    const digitsOnly = input.replace(/[^\d]/g, '');
    return digitsOnly.length === expectedLength ? digitsOnly : null;
}

// Оновлення стану після спроби
export function processGuess(state, guessArray) {
    const colors = checkGuess(state.secretCode, guessArray);
    
    const newState = {
        ...state,
        attemptsLeft: state.attemptsLeft - 1,
        guessesResults: [...state.guessesResults, { guess: guessArray, colors }]
    };
    
    const win = isWin(colors);
    const gameOver = newState.attemptsLeft === 0 || win;
    
    return {
        newState,
        colors,
        win,
        gameOver
    };
}

// Форматування часу
export function formatTime(seconds) {
    return String(seconds).padStart(3, '0');
}