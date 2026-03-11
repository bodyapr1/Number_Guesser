// Константи для кольорів
const COLORS = {
    GREEN: '#03C03C',
    YELLOW: '#FFD700',
    GREY: '#BEBEBE',
    ORANGE: '#FFA500',
    LIME: '#BFFF00'
};

// Стан гри
let gameState = {
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

// DOM елементи
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const resultsDiv = document.getElementById('results');
const timerSpan = document.getElementById('timer');
const attemptsSpan = document.getElementById('attempts');
const codeLengthSpan = document.getElementById('code-length');

// Функція генерації секретного коду
function generateSecretCode(length, allowDuplicates) {
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

// Функція перевірки припущення (адаптована з твого Python коду)
function checkGuess(secretCode, guess) {
    if (secretCode.length !== guess.length) {
        return Array(guess.length).fill(COLORS.GREY);
    }

    const n = secretCode.length;
    const finalColors = Array(n).fill(COLORS.GREY);
    const secretOriginal = [...secretCode];
    const guessOriginal = [...guess];

    // Рахуємо входження цифр в секретному коді
    const secretCounts = {};
    secretOriginal.forEach(digit => {
        secretCounts[digit] = (secretCounts[digit] || 0) + 1;
    });

    const neededColors = {};
    const exactMatchesCount = {};
    const misplacedPresentCount = {};

    const secretTempForMisplaced = [...secretOriginal];

    // Перший прохід: точні збіги
    for (let i = 0; i < n; i++) {
        if (guessOriginal[i] === secretOriginal[i]) {
            const digit = guessOriginal[i];
            exactMatchesCount[digit] = (exactMatchesCount[digit] || 0) + 1;
            secretTempForMisplaced[i] = null;
        }
    }

    // Другий прохід: цифри на неправильних позиціях
    for (let i = 0; i < n; i++) {
        if (guessOriginal[i] !== secretOriginal[i]) {
            const digit = guessOriginal[i];
            const secretIdx = secretTempForMisplaced.indexOf(digit);
            if (secretIdx !== -1) {
                misplacedPresentCount[digit] = (misplacedPresentCount[digit] || 0) + 1;
                secretTempForMisplaced[secretIdx] = null;
            }
        }
    }

    // Визначення кольорів (спрощена логіка для JS)
    for (let i = 0; i < n; i++) {
        const digit = guessOriginal[i];
        
        if (guessOriginal[i] === secretOriginal[i]) {
            finalColors[i] = COLORS.GREEN;
        } else if (secretOriginal.includes(digit)) {
            finalColors[i] = COLORS.YELLOW;
        } else {
            finalColors[i] = COLORS.GREY;
        }
    }

    return finalColors;
}

// Функція відображення результатів
function displayGuessResult(guess, colors) {
    const guessRow = document.createElement('div');
    guessRow.className = 'guess-row';
    
    for (let i = 0; i < guess.length; i++) {
        const digitBox = document.createElement('div');
        digitBox.className = 'digit-box';
        digitBox.textContent = guess[i];
        
        // Додаємо відповідний клас кольору
        if (colors[i] === COLORS.GREEN) digitBox.classList.add('green');
        else if (colors[i] === COLORS.YELLOW) digitBox.classList.add('yellow');
        else if (colors[i] === COLORS.ORANGE) digitBox.classList.add('orange');
        else if (colors[i] === COLORS.LIME) digitBox.classList.add('lime');
        else digitBox.classList.add('gray');
        
        guessRow.appendChild(digitBox);
    }
    
    resultsDiv.prepend(guessRow);
}

// Функція очищення результатів
function clearResults() {
    resultsDiv.innerHTML = '';
}

// Валідація введення
guessInput.addEventListener('input', function(e) {
    let value = e.target.value;
    // Залишаємо тільки цифри
    value = value.replace(/[^\d]/g, '');
    // Обмежуємо довжину
    if (value.length > gameState.codeLength) {
        value = value.slice(0, gameState.codeLength);
    }
    e.target.value = value;
});

// Обробка спроби
function handleGuess() {
    const guess = guessInput.value;
    
    if (guess.length !== gameState.codeLength) {
        alert(`Будь ласка, введіть ${gameState.codeLength} цифри`);
        return;
    }
    
    if (!gameState.gameStarted) {
        startTimer();
        gameState.gameStarted = true;
    }
    
    const guessArray = guess.split('');
    const colors = checkGuess(gameState.secretCode, guessArray);
    
    gameState.guessesResults.push({ guess: guessArray, colors });
    displayGuessResult(guessArray, colors);
    
    gameState.attemptsLeft--;
    attemptsSpan.textContent = gameState.attemptsLeft;
    guessInput.value = '';
    
    // Перевірка перемоги
    if (colors.every(color => color === COLORS.GREEN)) {
        stopTimer();
        alert(`Вітаю! Ви вгадали число ${gameState.secretCode.join('')}! Час: ${gameState.timerSeconds} секунд`);
        guessBtn.disabled = true;
        guessInput.disabled = true;
    }
    // Перевірка поразки
    else if (gameState.attemptsLeft === 0) {
        stopTimer();
        alert(`На жаль, ви не вгадали. Загадане число: ${gameState.secretCode.join('')}. Час: ${gameState.timerSeconds} секунд`);
        guessBtn.disabled = true;
        guessInput.disabled = true;
    }
}

// Таймер
function startTimer() {
    gameState.timerRunning = true;
    gameState.timerSeconds = 0;
    updateTimer();
}

function stopTimer() {
    gameState.timerRunning = false;
}

function updateTimer() {
    if (!gameState.timerRunning) return;
    
    timerSpan.textContent = String(gameState.timerSeconds).padStart(3, '0');
    
    if (gameState.timerSeconds < 999) {
        gameState.timerSeconds++;
        setTimeout(updateTimer, 1000);
    } else {
        stopTimer();
        alert(`Час вийшов! Загадане число: ${gameState.secretCode.join('')}`);
        guessBtn.disabled = true;
        guessInput.disabled = true;
    }
}

// Нова гра
function newGame() {
    stopTimer();
    gameState.secretCode = generateSecretCode(gameState.codeLength, gameState.allowDuplicates);
    gameState.attemptsLeft = gameState.attemptsLimit;
    gameState.gameStarted = false;
    gameState.guessesResults = [];
    gameState.timerSeconds = 0;
    
    clearResults();
    guessInput.value = '';
    guessInput.disabled = false;
    guessBtn.disabled = false;
    attemptsSpan.textContent = gameState.attemptsLeft;
    timerSpan.textContent = '000';
    
    console.log('Секретний код (для розробника):', gameState.secretCode.join(''));
}

// Ініціалізація гри
function initGame() {
    newGame();
    guessBtn.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleGuess();
    });
}

// Запуск гри після завантаження сторінки
document.addEventListener('DOMContentLoaded', initGame);