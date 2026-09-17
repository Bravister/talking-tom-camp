// ============================================================================
// MAIN APPLICATION
// ============================================================================

class MiniGameApp {
    constructor() {
        this.currentScreen = 1;
        this.currentQuestion = 0;
        this.coinsCollected = 0;
        this.questionsAnswered = 0;
        this.easterEggFound = false;
        this.campObjectsViewed = new Set();
        
        this.init();
    }

    init() {
        // Populate configuration
        this.setupConfig();
        
        // Bind events
        this.bindEvents();
        
        // Show initial screen
        this.showScreen(1);
    }

    setupConfig() {
        // Set the mailbox message from config
        if (CONFIG.campObjects.mailbox) {
            CONFIG.campObjects.mailbox.message = CONFIG.friendshipMessage;
        }

        // Display friend's name
        document.getElementById('friend-name-display').textContent = CONFIG.friendName;
        document.getElementById('cert-friend-name').textContent = CONFIG.friendName;
        document.getElementById('cert-my-name').textContent = CONFIG.myName;
        document.getElementById('final-message-text').textContent = CONFIG.finalMessage;
    }

    bindEvents() {
        // Screen 1: Start mission
        document.getElementById('btn-start-mission').addEventListener('click', () => this.goToScreen(2));

        // Screen 2: Quiz
        this.setupQuizScreen();

        // Screen 3: Camp interactions
        this.setupCampScreen();

        // Screen 5: Final buttons
        document.getElementById('btn-play-again').addEventListener('click', () => this.resetAndStart());
        document.getElementById('btn-close-mission').addEventListener('click', () => this.showFinalClosure());

        // Easter egg close
        document.getElementById('btn-close-egg').addEventListener('click', () => {
            document.getElementById('easter-egg-popup').style.display = 'none';
        });
    }

    setupQuizScreen() {
        // Will be populated when screen is shown
    }

    setupCampScreen() {
        // Close popup button
        document.getElementById('popup-close').addEventListener('click', () => {
            this.closeCampPopup();
        });

        // Camp objects
        document.querySelectorAll('.camp-object').forEach(obj => {
            obj.addEventListener('click', (e) => this.campObjectClicked(e.currentTarget));
        });

        // Moon tap for easter egg
        document.querySelector('.moon').addEventListener('click', () => {
            moonTapCount++;
            if (moonTapCount >= MOON_TAPS_FOR_EGG && !this.easterEggFound) {
                this.easterEggFound = true;
                this.showEasterEgg();
            }
        });
    }

    showScreen(screenNumber) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Show selected screen
        const screen = document.getElementById(`screen-arrival`);
        if (screenNumber === 1) document.getElementById('screen-arrival').classList.add('active');
        else if (screenNumber === 2) {
            document.getElementById('screen-quiz').classList.add('active');
            this.showQuizQuestion();
        }
        else if (screenNumber === 3) document.getElementById('screen-camp').classList.add('active');
        else if (screenNumber === 4) document.getElementById('screen-certificate').classList.add('active');
        else if (screenNumber === 5) document.getElementById('screen-final').classList.add('active');

        this.currentScreen = screenNumber;
        
        // Reset scroll
        window.scrollTo(0, 0);
    }

    goToScreen(screenNumber) {
        this.showScreen(screenNumber);
    }

    // ========================================================================
    // QUIZ LOGIC
    // ========================================================================

    showQuizQuestion() {
        const question = CONFIG.quizQuestions[this.currentQuestion];
        const container = document.getElementById('question-container');
        const feedback = document.getElementById('quiz-feedback');
        const counter = document.getElementById('quiz-counter');
        const total = document.getElementById('quiz-total');

        counter.textContent = this.currentQuestion + 1;
        total.textContent = CONFIG.quizQuestions.length;

        feedback.style.display = 'none';

        container.innerHTML = `
            <h3>${question.question}</h3>
            <div class="options-grid">
                ${question.options.map((option, index) => `
                    <button class="option" data-index="${index}">
                        ${String.fromCharCode(65 + index)}. ${option}
                    </button>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.option').forEach(btn => {
            btn.addEventListener('click', (e) => this.answerQuestion(e.target.closest('.option')));
        });
    }

    answerQuestion(optionBtn) {
        const question = CONFIG.quizQuestions[this.currentQuestion];
        const selectedIndex = parseInt(optionBtn.dataset.index);
        const isCorrect = selectedIndex === question.correct;

        // Disable all options
        document.querySelectorAll('.option').forEach(btn => btn.classList.add('disabled'));

        // Show result
        if (isCorrect) {
            optionBtn.classList.add('correct');
            this.coinsCollected++;
            this.questionsAnswered++;
        } else {
            optionBtn.classList.add('incorrect');
            document.querySelectorAll('.option')[question.correct].classList.add('correct');
            this.questionsAnswered++;
        }

        // Show feedback
        const feedback = document.getElementById('quiz-feedback');
        feedback.textContent = isCorrect ? question.feedback : `Not quite. The correct answer is ${String.fromCharCode(65 + question.correct)}.`;
        feedback.style.display = 'block';

        // Next question or proceed
        setTimeout(() => {
            if (this.currentQuestion < CONFIG.quizQuestions.length - 1) {
                this.currentQuestion++;
                this.showQuizQuestion();
            } else {
                // Move to camp
                setTimeout(() => this.goToScreen(3), 500);
            }
        }, 2000);
    }

    // ========================================================================
    // CAMP LOGIC
    // ========================================================================

    campObjectClicked(objElement) {
        const objectType = objElement.dataset.object;
        
        if (objectType === 'mystery-chest') {
            if (this.coinsCollected >= 5) {
                this.openChest();
            } else {
                this.showCampPopup(
                    'Locked 🔒',
                    `Requires ${5 - this.coinsCollected} more friendship coin(s).\n\nTap the other objects to collect coins.`
                );
            }
            return;
        }

        // Regular object
        if (objectType in CONFIG.campObjects) {
            const objData = CONFIG.campObjects[objectType];
            if (objData.message) {
                this.showCampPopup(objData.title, objData.message);
                
                // Award coin if not already collected
                if (!this.campObjectsViewed.has(objectType)) {
                    this.campObjectsViewed.add(objectType);
                    this.coinsCollected++;
                    this.updateCoinsDisplay();
                    this.showCoinCollected();
                }
            }
        }
    }

    showCampPopup(title, message) {
        const popup = document.getElementById('camp-popup');
        const content = document.getElementById('popup-content');
        
        content.innerHTML = `
            <div class="popup-title">${title}</div>
            <div class="popup-message">${message}</div>
        `;
        
        popup.style.display = 'flex';
    }

    closeCampPopup() {
        document.getElementById('camp-popup').style.display = 'none';
    }

    updateCoinsDisplay() {
        document.getElementById('coins-collected').textContent = this.coinsCollected;
        
        // Unlock chest if enough coins
        if (this.coinsCollected >= 5) {
            document.querySelector('.mystery-chest').classList.add('unlocked');
        }
    }

    showCoinCollected() {
        const counter = document.querySelector('.coins-counter');
        counter.style.animation = 'none';
        setTimeout(() => {
            counter.style.animation = 'slideIn 0.4s ease-out';
        }, 10);
    }

    openChest() {
        this.closeCampPopup();
        
        // Animate chest opening
        const chestElement = document.querySelector('.mystery-chest');
        chestElement.style.animation = 'none';
        
        setTimeout(() => {
            chestElement.style.animation = 'slideIn 0.6s ease-out';
            
            // Move to certificate screen
            setTimeout(() => this.goToScreen(4), 1000);
        }, 10);
    }

    // ========================================================================
    // EASTER EGG
    // ========================================================================

    showEasterEgg() {
        const popup = document.getElementById('easter-egg-popup');
        popup.style.display = 'flex';
    }

    // ========================================================================
    // FINAL SCREEN
    // ========================================================================

    resetAndStart() {
        this.currentQuestion = 0;
        this.coinsCollected = 0;
        this.questionsAnswered = 0;
        this.campObjectsViewed.clear();
        moonTapCount = 0;
        this.showScreen(1);
    }

    showFinalClosure() {
        // Could show a goodbye message or just reset
        alert(`Thank you for playing! See you soon, ${CONFIG.friendName}. 👋`);
        this.resetAndStart();
    }
}

// ============================================================================
// INITIALIZE APP
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    window.app = new MiniGameApp();
});

// Prevent default browser behaviors that interfere with the game
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.camp-scene')) {
        e.preventDefault();
    }
}, { passive: false });
