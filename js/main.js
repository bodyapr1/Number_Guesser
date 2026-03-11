import {
    createInitialState,
    generateSecretCode,
    processGuess,
    validateInput,
    formatTime,
    COLORS
} from './game-logic.js';

import {
    getDOMElements,
    displayGuessResult,
    clearResults,
    updateStats,
    showMessage,
    openSettings,
    closeSettings,
    updateSettingsInputs,
    getSettingsFromInputs,
    toggleTheme,
    setInputEnabled,
    clearInput,
    setupInputValidation
} from './ui-handler.js';

// Стан гри
let gameState = createInitialState();

// Таймер
let timerInterval = null;

// Функції для глобального доступу (викликаються з HTML)
window.makeGuess = function() {
    const elements = getDOMElements();
    const guess = elements.guessInput?.value || '';
    
    const validatedGuess = validateInput(guess, gameState.codeLength);
    if (!validatedGuess) {
        showMessage(`Будь ласка, введіть ${gameState.codeLength} цифри`, true);
        return;
    }
    
    if (!gameState.gameStarted) {
        startTimer();
        gameState.gameStarted = true;
    }
    
    const guessArray = validatedGuess.split('');
    const { newState, colors, win, gameOver } = processGuess(gameState, guessArray);
    
    // Оновлюємо стан
    gameState = newState;
    
    // Відображаємо результат
    displayGuessResult(guessArray, colors);
    
    // Оновлюємо статистику
    updateStats(gameState.attemptsLeft, gameState.codeLength, gameState.timerSeconds);
    
    // Очищаємо введення
    clearInput();
    
    // Перевіряємо кінець гри
    if (win) {
        stopTimer();
        showMessage(`Вітаю! Ви вгадали число ${gameState.secretCode.join('')}! Час: ${gameState.timerSeconds} секунд`);
        setInputEnabled(false);
    } else if (gameState.attemptsLeft === 0) {
        stopTimer();
        showMessage(`На жаль, ви не вгадали. Загадане число: ${gameState.secretCode.join('')}. Час: ${gameState.timerSeconds} секунд`);
        setInputEnabled(false);
    }
};

window.openSettings = function() {
    updateSettingsInputs(gameState);
    openSettings();
};

window.closeSettings = function() {
    closeSettings();
};

window.applySettings = function() {
    const settings = getSettingsFromInputs();
    
    gameState.codeLength = settings.codeLength;
    gameState.attemptsLimit = settings.attemptsLimit;
    gameState.allowDuplicates = settings.allowDuplicates;
    
    closeSettings();
    restartGame();
};

window.toggleTheme = function() {
    toggleTheme();
};

window.restartGame = function() {
    restartGame();
};

// Функції таймера
function startTimer() {
    if (timerInterval) stopTimer();
    
    gameState.timerRunning = true;
    gameState.timerSeconds = 0;
    
    timerInterval = setInterval(() => {
        if (gameState.timerRunning && gameState.timerSeconds < 999) {
            gameState.timerSeconds++;
            updateStats(gameState.attemptsLeft, gameState.codeLength, gameState.timerSeconds);
            
            if (gameState.timerSeconds >= 999) {
                stopTimer();
                showMessage(`Час вийшов! Загадане число: ${gameState.secretCode.join('')}`);
                setInputEnabled(false);
            }
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    gameState.timerRunning = false;
}

// Перезапуск гри
function restartGame() {
    stopTimer();
    
    gameState.secretCode = generateSecretCode(gameState.codeLength, gameState.allowDuplicates);
    gameState.attemptsLeft = gameState.attemptsLimit;
    gameState.gameStarted = false;
    gameState.guessesResults = [];
    gameState.timerSeconds = 0;
    gameState.timerRunning = false;
    
    clearResults();
    clearInput();
    setInputEnabled(true);
    updateStats(gameState.attemptsLeft, gameState.codeLength, gameState.timerSeconds);
    
    // Для розробника
    console.log('Секретний код:', gameState.secretCode.join(''));
    
    // Для E2E тестів
    if (typeof window !== 'undefined') {
        window.__testSecretCode = gameState.secretCode;
    }
}

// Ініціалізація
document.addEventListener('DOMContentLoaded', () => {
    restartGame();
    setupInputValidation();
    
    // Додаткове налаштування для модального вікна
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('settingsModal');
        if (event.target === modal) {
            closeSettings();
        }
    });
});

// Експорт для тестування
export { gameState, restartGame, startTimer, stopTimer };