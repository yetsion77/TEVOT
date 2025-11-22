const acronyms = [
    { q: "קשר״ג", a: "קצין קשר גדודי" },
    { q: "קשר״ח", a: "קצין קשר חטיבתי" },
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
    { q: "שדל״ן", a: "שידור לאחור נייד" },
    { q: "צק״ג", a: "צוות קרב גדודי" },
    { q: "צק״ח", a: "צוות קרב חטיבתי" },
    { q: "נוה״ק", a: "נוהל קרב" },
    { q: "ניהו״ק", a: "ניהול קרב" },
    { q: "מ״ק", a: "מכשיר קשר" },
    { q: "מקמ״ש", a: "מקלט משדר" },
    { q: "דפ״א", a: "דרך פעולה אפשרית" },
    { q: "דפ״ן", a: "דרך פעולה נבחרת" },
    { q: "צי״ד", a: "צבא יבשה דיגיטלי" },
    { q: "רמ״מ", a: "רמה ממונה" },
    { q: "נמ״ר", a: "נגמש מרכבה" },
    { q: "קרפ״ג", a: "קצין רפואה גדודי" },
    { q: "פו״ש", a: "פיקוד ושליטה" },
    { q: "שו״ב", a: "שליטה ובקרה" },
    { q: "מפל״ז", a: "מפלי בזלת" },
    { q: "קש״א", a: "קצין שיתוף ארטילרי" },
    { q: "ס״צ", a: "סלולר צבאי" },
    { q: "קק״צ", a: "קורס קצינים" },
    { q: "אול״ר", a: "אמצעי ורסטילי רשתי" },
    { q: "בצ״פ", a: "בסיס ציוד פיקודי" },
    { q: "רק״ם", a: "רכב קרב משוריין" },
    { q: "לומ״ר", a: "לוחמה מבוססת רשת" },
    { q: "תקש״ל", a: "תקשורת לוויינית" },
    { q: "רמ״ד", a: "ראש מדור" },
    { q: "רע״ן", a: "ראש ענף" },
    { q: "אט״ל", a: "אגף הטכנולוגיה והלוגיסטיקה" },
    { q: "פת״ל", a: "פלטפורמה תקשובית לתמרון" },
    { q: "יג״ע", a: "יחס גלים עומדים" },
    { q: "מרה״ס", a: "מרכז הספקה" },
    { q: "תג״מ", a: "תדר גבוה מאוד" }
];

// Game State
let currentAcronym = null;
let score = 0;
let timeLeft = 90;
let timerInterval = null;
let isGameActive = false;
let userInput = []; // Array of characters matching the answer length (excluding spaces)
let answerStructure = []; // Array of objects defining word lengths
let availableAcronyms = [];
let returnToScreen = 'start';

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const dictionaryScreen = document.getElementById('dictionary-screen');
const acronymDisplay = document.getElementById('acronym-display');
const inputContainer = document.getElementById('input-container');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score-number');
const startBtn = document.getElementById('start-btn');
const startDictBtn = document.getElementById('start-dict-btn');
const restartBtn = document.getElementById('restart-btn');
const dictBtn = document.getElementById('dict-btn');
const backBtn = document.getElementById('back-btn');
const hiddenInput = document.getElementById('hidden-input');
const dictionaryList = document.getElementById('dictionary-list');

// Event Listeners
startBtn.addEventListener('click', startGame);
startDictBtn.addEventListener('click', () => showDictionary('start'));
restartBtn.addEventListener('click', startGame);
dictBtn.addEventListener('click', () => showDictionary('end'));
backBtn.addEventListener('click', handleBack);
hiddenInput.addEventListener('input', handleInput);

// Focus management
gameScreen.addEventListener('click', (e) => {
    if (isGameActive) {
        hiddenInput.focus();
    }
});

// Keep keyboard open
hiddenInput.addEventListener('blur', () => {
    if (isGameActive) {
        setTimeout(() => hiddenInput.focus(), 10);
    }
});

function startGame() {
    score = 0;
    timeLeft = 90;
    isGameActive = true;
    availableAcronyms = [...acronyms];

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    startScreen.classList.remove('active');
    endScreen.classList.remove('active');
    dictionaryScreen.classList.remove('active');
    gameScreen.classList.add('active');

    nextAcronym();
    startTimer();

    // Focus input for mobile
    setTimeout(() => hiddenInput.focus(), 100);
}

function showDictionary(fromSource) {
    returnToScreen = fromSource;
    startScreen.classList.remove('active');
    endScreen.classList.remove('active');
    dictionaryScreen.classList.add('active');

    // Populate dictionary
    dictionaryList.innerHTML = '';
    const sortedAcronyms = [...acronyms].sort((a, b) => a.q.localeCompare(b.q));

    sortedAcronyms.forEach(item => {
        const div = document.createElement('div');
        div.className = 'dict-item';
        div.innerHTML = `
            <span class="dict-q">${item.q}</span>
            <span class="dict-a">${item.a}</span>
        `;
        dictionaryList.appendChild(div);
    });
}

function handleBack() {
    dictionaryScreen.classList.remove('active');
    if (returnToScreen === 'start') {
        startScreen.classList.add('active');
    } else {
        endScreen.classList.add('active');
    }
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
    hiddenInput.blur();
}

function nextAcronym() {
    if (availableAcronyms.length === 0) {
        availableAcronyms = [...acronyms];
    }

    const randomIndex = Math.floor(Math.random() * availableAcronyms.length);
    currentAcronym = availableAcronyms[randomIndex];
    availableAcronyms.splice(randomIndex, 1);

    acronymDisplay.textContent = currentAcronym.q;

    // Reset input
    const totalLetters = currentAcronym.a.replace(/ /g, '').length;
    userInput = new Array(totalLetters).fill('');
    hiddenInput.value = ''; // Clear hidden input

    renderInputBoxes();
    hiddenInput.focus();
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

            if (userInput[globalCharIndex]) {
                box.textContent = userInput[globalCharIndex];
                box.classList.add('filled');
            }

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

function handleInput(e) {
    if (!isGameActive) {
        hiddenInput.value = '';
        return;
    }

    const val = hiddenInput.value;
    // Filter out spaces
    if (val.includes(' ')) {
        hiddenInput.value = val.replace(/ /g, '');
        return;
    }

    const currentString = val.split('');

    // If user deleted (backspace)
    if (currentString.length < userInput.filter(c => c !== '').length) {
        // Find the last filled index and clear it
        const lastFilled = userInput.findLastIndex(c => c !== '');
        if (lastFilled !== -1) {
            userInput[lastFilled] = '';
        }
        renderInputBoxes();
        return;
    }

    // If user added a char
    if (currentString.length > userInput.filter(c => c !== '').length) {
        const char = currentString[currentString.length - 1];
        const firstEmpty = userInput.findIndex(c => c === '');

        if (firstEmpty !== -1) {
            userInput[firstEmpty] = char;
            renderInputBoxes();

            if (userInput.every(c => c !== '')) {
                checkFullAnswer();
            }
        } else {
            // Input is full but maybe extra chars typed?
            // Reset hidden input to match valid length
            hiddenInput.value = userInput.join('');
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
    isGameActive = false;
    // hiddenInput.disabled = true; // Removed to keep keyboard open

    const fullAnswerNoSpaces = currentAcronym.a.replace(/ /g, '');
    const boxes = document.querySelectorAll('.char-box');

    userInput.forEach((char, index) => {
        if (char !== fullAnswerNoSpaces[index]) {
            if (boxes[index]) boxes[index].classList.add('wrong');
        }
    });

    setTimeout(() => {
        userInput = fullAnswerNoSpaces.split('');
        renderInputBoxes();

        const newBoxes = document.querySelectorAll('.char-box');
        newBoxes.forEach(b => {
            b.classList.remove('wrong');
            b.classList.add('filled');
            b.style.borderColor = 'var(--accent-color)';
        });
    }, 500);

    setTimeout(() => {
        isGameActive = true;
        // hiddenInput.disabled = false; // Removed
        hiddenInput.focus(); // Refocus just in case
        nextAcronym();
    }, 2000);
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
