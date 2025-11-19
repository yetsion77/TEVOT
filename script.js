const acronyms = [
    { q: "קשר״ג", a: "קשר גדודי" },
    { q: "קשר״ח", a: "קשר חטיבתי" },
    { q: "קפ״ק", a: "קבוצת פקודות" },
    { q: "ת״ג", a: "תדר גבוה" },
    { q: "קשר״ר", a: "קצין קשר ראשי" },
    { q: "מאו״ג", a: "מפקד אוגדה" },
    { q: "קמב״צ", a: "קצין מבצעים" },
    { q: "קמ״ן", a: "קצין מודיעין" },
    { q: "קשפ״ל", a: "קשר פלוגתי" },
    { q: "מש״מ", a: "משחקי מלחמה" },
    { q: "שנ״מ", a: "שינוי משימה" },
    { q: "פקמ״ב", a: "פקודת מבצע" },
    { q: "שדל״ן", a: "שידור לאחור נייד" }
];

// Game State
let currentAcronym = null;
let score = 0;
let timeLeft = 60;
let timerInterval = null;
let isGameActive = false;
let userInput = []; // Array of characters matching the answer length (excluding spaces)
let answerStructure = []; // Array of objects defining word lengths

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const acronymDisplay = document.getElementById('acronym-display');
const inputContainer = document.getElementById('input-container');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score-number');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyPress);

function startGame() {
    score = 0;
    timeLeft = 60;
    isGameActive = true;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    startScreen.classList.remove('active');
    endScreen.classList.remove('active');
    gameScreen.classList.add('active');

    nextAcronym();
    startTimer();
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    isGameActive = false;
    clearInterval(timerInterval);
    gameScreen.classList.remove('active');
    endScreen.classList.add('active');
    finalScoreDisplay.textContent = score;
}

function nextAcronym() {
    // Pick a random acronym
    const randomIndex = Math.floor(Math.random() * acronyms.length);
    currentAcronym = acronyms[randomIndex];

    acronymDisplay.textContent = currentAcronym.q;

    // Prepare input structure
    const words = currentAcronym.a.split(' ');
    answerStructure = words.map(w => w.length);

    // Reset user input
    const totalLetters = currentAcronym.a.replace(/ /g, '').length;
    userInput = new Array(totalLetters).fill('');

    renderInputBoxes();
}

function renderInputBoxes() {
    inputContainer.innerHTML = '';
    let globalCharIndex = 0;

    const words = currentAcronym.a.split(' ');

    words.forEach((word) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word-group';

        for (let i = 0; i < word.length; i++) {
            const box = document.createElement('div');
            box.className = 'char-box';

            // If we have a letter at this index, show it
            if (userInput[globalCharIndex]) {
                box.textContent = userInput[globalCharIndex];
                box.classList.add('filled');
            }

            // Highlight the next empty box
            const firstEmptyIndex = userInput.findIndex(c => c === '');
            if (globalCharIndex === firstEmptyIndex) {
                box.classList.add('active');
            }

            wordDiv.appendChild(box);
            globalCharIndex++;
        }

        inputContainer.appendChild(wordDiv);
    });
}

function handleKeyPress(e) {
    if (!isGameActive) return;

    // Handle Backspace
    if (e.key === 'Backspace') {
        const lastFilledIndex = userInput.findLastIndex(c => c !== '');
        if (lastFilledIndex !== -1) {
            userInput[lastFilledIndex] = '';
            renderInputBoxes();
            // Remove any error states if they exist
            const boxes = document.querySelectorAll('.char-box');
            boxes.forEach(b => b.classList.remove('wrong'));
        }
        return;
    }

    if (e.key.length === 1) {
        const firstEmptyIndex = userInput.findIndex(c => c === '');
        if (firstEmptyIndex !== -1) {
            userInput[firstEmptyIndex] = e.key;
            renderInputBoxes();

            // Check if word is complete
            if (userInput.every(c => c !== '')) {
                checkFullAnswer();
            }
        }
    }
}

function checkFullAnswer() {
    const fullAnswerNoSpaces = currentAcronym.a.replace(/ /g, '');
    const userAnswer = userInput.join('');

    if (userAnswer === fullAnswerNoSpaces) {
        handleSuccess();
    } else {
        handleMistake();
    }
}

function handleSuccess() {
    score++;
    scoreDisplay.textContent = score;

    const boxes = document.querySelectorAll('.char-box');
    boxes.forEach(b => b.classList.add('correct'));

    setTimeout(() => {
        nextAcronym();
    }, 200);
}

function handleMistake() {
    // Lock game temporarily
    isGameActive = false;

    const fullAnswerNoSpaces = currentAcronym.a.replace(/ /g, '');
    const boxes = document.querySelectorAll('.char-box');

    // 1. Mark errors
    userInput.forEach((char, index) => {
        if (char !== fullAnswerNoSpaces[index]) {
            if (boxes[index]) boxes[index].classList.add('wrong');
        }
    });

    // 2. Reveal correct answer after a short delay
    setTimeout(() => {
        // Fill with correct answer
        userInput = fullAnswerNoSpaces.split('');
        renderInputBoxes();

        // Mark all as filled/revealed
        const newBoxes = document.querySelectorAll('.char-box');
        newBoxes.forEach(b => {
            b.classList.remove('wrong'); // Remove red
            b.classList.add('filled');
            b.style.borderColor = 'var(--accent-color)';
        });
    }, 500); // 0.5s to see your mistake

    // 3. Move on
    setTimeout(() => {
        isGameActive = true;
        nextAcronym();
    }, 2000); // 1.5s to read the correct answer
}

// Polyfill for findLastIndex if needed (older browsers)
if (!Array.prototype.findLastIndex) {
    Array.prototype.findLastIndex = function (callback, thisArg) {
        for (let i = this.length - 1; i >= 0; i--) {
            if (callback.call(thisArg, this[i], i, this)) {
                return i;
            }
        }
        return -1;
    };
}
