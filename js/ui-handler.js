import { COLORS, formatTime } from './game-logic.js';

// UI стан
let currentTheme = 'light';

// Отримання DOM елементів
export function getDOMElements() {
    return {
        guessInput: document.getElementById('guessInput'),
        guessBtn: document.querySelector('button[onclick="makeGuess()"]'),
        resultsDiv: document.getElementById('results'),
        timerSpan: document.getElementById('timer'),
        attemptsSpan: document.getElementById('attemptsDisplay'),
        digitsSpan: document.getElementById('digitsDisplay'),
        settingsModal: document.getElementById('settingsModal'),
        lengthInput: document.getElementById('lengthInput'),
        attemptsInput: document.getElementById('attemptsInput'),
        duplicatesInput: document.getElementById('duplicatesInput')
    };
}

// Відображення результатів спроби
export function displayGuessResult(guess, colors) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;
    
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

// Очищення результатів
export function clearResults() {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
    }
}

// Оновлення статистики
export function updateStats(attemptsLeft, codeLength, timerSeconds) {
    const attemptsSpan = document.getElementById('attemptsDisplay');
    const digitsSpan = document.getElementById('digitsDisplay');
    const timerSpan = document.getElementById('timer');
    
    if (attemptsSpan) attemptsSpan.textContent = attemptsLeft;
    if (digitsSpan) digitsSpan.textContent = codeLength;
    if (timerSpan) timerSpan.textContent = formatTime(timerSeconds);
}

// Показати повідомлення
export function showMessage(message, isError = false) {
    if (isError) {
        alert(`Помилка: ${message}`);
    } else {
        alert(message);
    }
}

// Управління модальним вікном
export function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

export function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Оновлення полів налаштувань
export function updateSettingsInputs(state) {
    const lengthInput = document.getElementById('lengthInput');
    const attemptsInput = document.getElementById('attemptsInput');
    const duplicatesInput = document.getElementById('duplicatesInput');
    
    if (lengthInput) lengthInput.value = state.codeLength;
    if (attemptsInput) attemptsInput.value = state.attemptsLimit;
    if (duplicatesInput) duplicatesInput.checked = state.allowDuplicates;
}

// Отримання значень з налаштувань
export function getSettingsFromInputs() {
    const lengthInput = document.getElementById('lengthInput');
    const attemptsInput = document.getElementById('attemptsInput');
    const duplicatesInput = document.getElementById('duplicatesInput');
    
    return {
        codeLength: lengthInput ? parseInt(lengthInput.value) || 4 : 4,
        attemptsLimit: attemptsInput ? parseInt(attemptsInput.value) || 4 : 4,
        allowDuplicates: duplicatesInput ? duplicatesInput.checked : false
    };
}

// Перемикання теми
export function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('light')) {
        body.classList.remove('light');
        body.classList.add('dark');
        currentTheme = 'dark';
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
        currentTheme = 'light';
    }
}

// Блокування/розблокування введення
export function setInputEnabled(enabled) {
    const guessInput = document.getElementById('guessInput');
    const guessBtn = document.querySelector('button[onclick="makeGuess()"]');
    
    if (guessInput) guessInput.disabled = !enabled;
    if (guessBtn) guessBtn.disabled = !enabled;
}

// Очищення поля введення
export function clearInput() {
    const guessInput = document.getElementById('guessInput');
    if (guessInput) {
        guessInput.value = '';
    }
}

// Встановлення обробників подій для введення
export function setupInputValidation(onValidate) {
    const guessInput = document.getElementById('guessInput');
    if (!guessInput) return;
    
    guessInput.addEventListener('input', function(e) {
        let value = e.target.value;
        value = value.replace(/[^\d]/g, '');
        
        const maxLength = parseInt(document.getElementById('digitsDisplay')?.textContent || '4');
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
        }
        
        e.target.value = value;
        
        if (onValidate) {
            onValidate(value);
        }
    });
    
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const btn = document.querySelector('button[onclick="makeGuess()"]');
            if (btn && !btn.disabled) {
                btn.click();
            }
        }
    });
}