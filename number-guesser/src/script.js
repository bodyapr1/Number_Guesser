let secretCode = [];
let attemptsLeft = 4;
let codeLength = 4;
let allowDuplicates = false;
let timer = 0;
let timerInterval = null;

const statusEl = document.getElementById('envStatus')
if (statusEl) {
  statusEl.textContent = 'Mode: ' + import.meta.env.VITE_APP_STATUS
  statusEl.style.cssText = 'display:inline-block;padding:2px 10px;border:1px solid #333;border-radius:4px'
}


function generateSecretCode(length = codeLength, duplicates = allowDuplicates) {
    let digits = [...Array(10).keys()].map(String);

    if (!duplicates) {
        digits.sort(() => Math.random() - 0.5);
        return digits.slice(0, length);
    } else {
        let code = [];
        for (let i = 0; i < length; i++) {
            code.push(digits[Math.floor(Math.random() * 10)]);
        }
        return code;
    }
}

function restartGame() {
    codeLength = parseInt(document.getElementById("lengthInput").value);
    attemptsLeft = parseInt(document.getElementById("attemptsInput").value);
    allowDuplicates = document.getElementById("duplicatesInput").checked;

    secretCode = generateSecretCode();
    document.getElementById("results").innerHTML = "";
    document.getElementById("attemptsDisplay").innerText = attemptsLeft;
    document.getElementById("digitsDisplay").innerText = codeLength;
    document.getElementById("timer").innerText = "000";
    timer = 0;

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
}

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        timer++;
        if (timer <= 999)
            document.getElementById("timer").innerText = timer.toString().padStart(3, "0");
    }, 1000);
}

function makeGuess() {
    let input = document.getElementById("guessInput");
    let guess = input.value;
    input.value = "";

    if (guess.length !== codeLength || !/^\d+$/.test(guess)) {
        alert("Enter correct digits!");
        return;
    }

    if (!timerInterval) startTimer();

    let colors = checkGuess(secretCode, guess.split(""));
    displayResult(guess, colors);

    attemptsLeft--;
    document.getElementById("attemptsDisplay").innerText = attemptsLeft;

    if (colors.every(c => c === "green")) {
        clearInterval(timerInterval);
        alert("Victory! Secret: " + secretCode.join(""));
    } else if (attemptsLeft === 0) {
        clearInterval(timerInterval);
        alert("Loss! Secret: " + secretCode.join(""));
    }
}

function checkGuess(secret, guess, length = codeLength) {
    let result = new Array(length).fill("grey");
    let secretCopy = [...secret];

    // GREEN
    for (let i = 0; i < length; i++) {
        if (guess[i] === secret[i]) {
            result[i] = "green";
            secretCopy[i] = null;
        }
    }

    // YELLOW
    for (let i = 0; i < length; i++) {
        if (result[i] === "grey") {
            let index = secretCopy.indexOf(guess[i]);
            if (index !== -1) {
                result[i] = "yellow";
                secretCopy[index] = null;
            }
        }
    }

    return result;
}

function displayResult(guess, colors) {
    let row = document.createElement("div");
    row.className = "row";

    for (let i = 0; i < guess.length; i++) {
        let cell = document.createElement("div");
        cell.className = "cell " + colors[i];
        cell.innerText = guess[i];
        row.appendChild(cell);
    }

    document.getElementById("results").appendChild(row);
}

function toggleTheme() {
    let body = document.body;
    body.classList.toggle("dark");
    body.classList.toggle("light");
}

function openSettings() {
    document.getElementById("settingsModal").classList.remove("hidden");
}

function closeSettings() {
    document.getElementById("settingsModal").classList.add("hidden");
}

function applySettings() {
    closeSettings();
    restartGame();
}

// Запускаємо гру тільки в браузері
if (typeof document !== 'undefined') {
    restartGame();
}

export { generateSecretCode, checkGuess }