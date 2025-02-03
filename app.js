// app.js
(async function() {
  try {
    const response = await fetch('quiz-data.json');
    if (!response.ok) throw new Error('Failed to load questions');
    const quizData = await response.json();
    
    const state = {
      currentQuestion: 0,
      score: 0,
      total: quizData.length
    };
    
    const elements = {
      question: document.getElementById('question'),
      options: document.getElementById('options'),
      score: document.getElementById('score'),
      total: document.getElementById('total'),
      restartBtn: document.getElementById('restart')
    };
  
    function init() {
      if (quizData.length === 0) {
        showError('No questions available');
        return;
      }
      
      elements.total.textContent = state.total;
      addEventListeners();
      displayQuestion();
    }
  
    function addEventListeners() {
      elements.restartBtn.addEventListener('click', restartQuiz);
      elements.options.addEventListener('click', handleAnswer);
    }
  
    function displayQuestion() {
      const question = quizData[state.currentQuestion];
      elements.question.textContent = question.question;
      
      elements.options.innerHTML = question.options
        .map((option, idx) => `
          <button class="option-btn" data-index="${idx}">
            ${escapeHTML(option)}
          </button>
        `).join('');
    }
  
    function handleAnswer(e) {
      const btn = e.target.closest('.option-btn');
      if (!btn) return;
  
      const selectedOption = parseInt(btn.dataset.index);
      const correctOption = quizData[state.currentQuestion].correct;
      
      // Visual feedback
      btn.classList.add(selectedOption === correctOption ? 'correct' : 'incorrect');
      
      // Update score
      if (selectedOption === correctOption) {
        state.score++;
        elements.score.textContent = state.score;
      }
  
      setTimeout(() => {
        state.currentQuestion++;
        if (state.currentQuestion < state.total) {
          displayQuestion();
        } else {
          showFinalScreen();
        }
      }, 1000);
    }
  
    function showFinalScreen() {
      elements.question.innerHTML = `
        <p>Quiz ended. Final score: ${state.score}/${state.total}</p>
      `;
      elements.options.innerHTML = '';
    }
  
    function restartQuiz() {
      state.currentQuestion = 0;
      state.score = 0;
      elements.score.textContent = state.score;
      displayQuestion();
    }
  
    function escapeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  
    function showError(message) {
      elements.question.textContent = message;
    }
    
    init();
    
  } catch (error) {
    console.error('Error loading quiz data:', error);
    showError('Failed to load questions. Please try again later.');
  }
})();