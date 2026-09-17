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
        // Show the welcome screen immediately.
        this.showScreen(1);

        // Optional setup should never prevent the main button from working.
        try {
            if (typeof CONFIG !== 'undefined' && CONFIG.campObjects.mailbox) {
                CONFIG.campObjects.mailbox.message = CONFIG.friendshipMessage;
            }
            
            if (typeof CONFIG !== 'undefined') {
                document.getElementById('friend-name-display').textContent = CONFIG.friendName;
                document.getElementById('cert-friend-name').textContent = CONFIG.friendName;
                document.getElementById('cert-my-name').textContent = CONFIG.myName;
                document.getElementById('final-message-text').textContent = CONFIG.finalMessage;
            }
        } catch (error) {
            console.error("Configuration setup failed:", error);
        }

        // Bind events independently.
        try {
            this.bindEvents();
        } catch (error) {
            console.error("Some game events failed to bind:", error);
        }

        // Critical fallback: always wire Start Mission directly.
        const startButton = document.getElementById("btn-start-mission");
        if (startButton) {
            startButton.onclick = () => {
                this.goToScreen(2);
            };
        }
    }

    bindEvents() {
        // Screen 1: Start mission
        const startButton = document.getElementById('btn-start-mission');
        if (startButton) {
            startButton.addEventListener('click', () => this.goToScreen(2));
        }

        // Screen 2: Quiz
        this.setupQuizScreen();

        // Screen 3: Camp interactions
        this.setupCampScreen();

        // Screen 5: Final buttons
        if (document.getElementById('btn-play-again')) {
            document.getElementById('btn-play-again').addEventListener('click', () => this.resetAndStart());
        }
        if (document.getElementById('btn-close-mission')) {
            document.getElementById('btn-close-mission').addEventListener('click', () => this.showFinalClosure());
        }

        // Easter egg close
        if (document.getElementById('btn-close-egg')) {
            document.getElementById('btn-close-egg').addEventListener('click', () => {
                document.getElementById('easter-egg-popup').style.display = 'none';
            });
        }
    }

    setupQuizScreen() {
        // Will be populated when screen is shown
    }

    setupCampScreen() {
        // Close popup button
        const popupClose = document.getElementById('popup-close');
        if (popupClose) {
            popupClose.addEventListener('click', () => {
                this.closeCampPopup();
            });
        }

        // Camp objects
        document.querySelectorAll('.camp-object').forEach(obj => {
            obj.addEventListener('click', (e) => this.campObjectClicked(e.currentTarget));
        });

        // Moon tap for easter egg
        const moon = document.querySelector('.moon');
        if (moon) {
            moon.addEventListener('click', () => {
                if (typeof moonTapCount !== 'undefined') {
                    moonTapCount++;
                    if (moonTapCount >= MOON_TAPS_FOR_EGG && !this.easterEggFound) {
                        this.easterEggFound = true;
                        this.showEasterEgg();
                    }
                }
            });
        }
    }

    showScreen(screenNumber) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Show selected screen
        if (screenNumber === 1) {
            const s1 = document.getElementById('screen-arrival');
            if (s1) s1.classList.add('active');
        }
        else if (screenNumber === 2) {
            const s2 = document.getElementById('screen-quiz');
            if (s2) s2.classList.add('active');
            this.showQuizQuestion();
        }
        else if (screenNumber === 3) {
            const s3 = document.getElementById('screen-camp');
            if (s3) s3.classList.add('active');
        }
        else if (screenNumber === 4) {
            const s4 = document.getElementById('screen-certificate');
            if (s4) s4.classList.add('active');
        }
        else if (screenNumber === 5) {
            const s5 = document.getElementById('screen-final');
            if (s5) s5.classList.add('active');
        }

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
        try {
            if (typeof CONFIG === 'undefined' || !CONFIG.quizQuestions) {
                console.error("CONFIG not loaded yet");
                return;
            }

            const question = CONFIG.quizQuestions[this.currentQuestion];
            const container = document.getElementById('question-container');
            const feedback = document.getElementById('quiz-feedback');
            const counter = document.getElementById('quiz-counter');
            const total = document.getElementById('quiz-total');

            if (!container) return;

            if (counter) counter.textContent = this.currentQuestion + 1;
            if (total) total.textContent = CONFIG.quizQuestions.length;

            if (feedback) feedback.style.display = 'none';

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
        } catch (error) {
            console.error("Error showing quiz question:", error);
        }
    }

    answerQuestion(optionBtn) {
        try {
            if (typeof CONFIG === 'undefined') return;
            
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
            if (feedback) {
                feedback.textContent = isCorrect ? question.feedback : `Not quite. The correct answer is ${String.fromCharCode(65 + question.correct)}.`;
                feedback.style.display = 'block';
            }

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
        } catch (error) {
            console.error("Error answering question:", error);
        }
    }

    // ========================================================================
    // CAMP LOGIC
    // ========================================================================

    campObjectClicked(objElement) {
        try {
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
            if (typeof CONFIG !== 'undefined' && objectType in CONFIG.campObjects) {
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
        } catch (error) {
            console.error("Error clicking camp object:", error);
        }
    }

    showCampPopup(title, message) {
        try {
            const popup = document.getElementById('camp-popup');
            const content = document.getElementById('popup-content');
            
            if (!popup || !content) return;
            
            content.innerHTML = `
                <div class="popup-title">${title}</div>
                <div class="popup-message">${message}</div>
            `;
            
            popup.style.display = 'flex';
        } catch (error) {
            console.error("Error showing popup:", error);
        }
    }

    closeCampPopup() {
        const popup = document.getElementById('camp-popup');
        if (popup) popup.style.display = 'none';
    }

    updateCoinsDisplay() {
        const coinsEl = document.getElementById('coins-collected');
        if (coinsEl) {
            coinsEl.textContent = this.coinsCollected;
        }
        
        // Unlock chest if enough coins
        if (this.coinsCollected >= 5) {
            const chest = document.querySelector('.mystery-chest');
            if (chest) chest.classList.add('unlocked');
        }
    }

    showCoinCollected() {
        const counter = document.querySelector('.coins-counter');
        if (!counter) return;
        
        counter.style.animation = 'none';
        setTimeout(() => {
            counter.style.animation = 'slideIn 0.4s ease-out';
        }, 10);
    }

    openChest() {
        this.closeCampPopup();
        
        // Animate chest opening
        const chestElement = document.querySelector('.mystery-chest');
        if (!chestElement) return;
        
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
        if (popup) popup.style.display = 'flex';
    }

    // ========================================================================
    // FINAL SCREEN
    // ========================================================================

    resetAndStart() {
        this.currentQuestion = 0;
        this.coinsCollected = 0;
        this.questionsAnswered = 0;
        this.campObjectsViewed.clear();
        if (typeof moonTapCount !== 'undefined') {
            moonTapCount = 0;
        }
        this.showScreen(1);
    }

    showFinalClosure() {
        const friendName = (typeof CONFIG !== 'undefined') ? CONFIG.friendName : 'friend';
        alert(`Thank you for playing! See you soon, ${friendName}. 👋`);
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
