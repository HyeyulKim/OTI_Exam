// File timestamp: 2026-09-10 19:20:00 +09:00; updated 2026-09-10 20:45:00 +09:00

const screens = {
  start: document.querySelector("#start-screen"),
  quiz: document.querySelector("#quiz-screen"),
  result: document.querySelector("#result-screen")
};

const elements = {
  categorySelect: document.querySelector("#category-select"),
  startButton: document.querySelector("#start-button"),
  quizCategory: document.querySelector("#quiz-category"),
  quizProgress: document.querySelector("#quiz-progress"),
  questionNumber: document.querySelector("#question-number"),
  questionTitle: document.querySelector("#question-title"),
  optionsList: document.querySelector("#options-list"),
  feedback: document.querySelector("#feedback"),
  feedbackTitle: document.querySelector("#feedback-title"),
  feedbackExplanation: document.querySelector("#feedback-explanation"),
  nextButton: document.querySelector("#next-button"),
  totalScore: document.querySelector("#total-score"),
  categoryResultsList: document.querySelector("#category-results-list"),
  recordForm: document.querySelector("#record-form"),
  nicknameInput: document.querySelector("#nickname-input"),
  recordStatus: document.querySelector("#record-status"),
  rankingCount: document.querySelector("#ranking-count"),
  rankingList: document.querySelector("#ranking-list"),
  startRankingCount: document.querySelector("#start-ranking-count"),
  startRankingList: document.querySelector("#start-ranking-list"),
  restartButton: document.querySelector("#restart-button")
};

const rankingStorageKey = "normalization-quiz-ranking";
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answerHistory = [];

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function showScreen(screenName) {
  Object.entries(screens).forEach(([name, screen]) => {
    screen.hidden = name !== screenName;
  });
}

function selectQuestionsByCategory(category) {
  return shuffle(questions.filter((question) => question.category === category)).slice(0, 10);
}

function startQuiz() {
  const selectedCategory = elements.categorySelect.value;
  const selectedQuestions = selectedCategory === "all"
    ? Object.keys(categoryLabels).flatMap(selectQuestionsByCategory)
    : selectQuestionsByCategory(selectedCategory);

  quizQuestions = shuffle(selectedQuestions);
  currentQuestionIndex = 0;
  score = 0;
  answerHistory = [];
  elements.recordStatus.textContent = "";
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  elements.quizCategory.textContent = "";
  elements.quizProgress.textContent = `${currentQuestionIndex + 1} / ${quizQuestions.length}`;
  elements.questionNumber.textContent = `QUESTION ${String(currentQuestionIndex + 1).padStart(2, "0")}`;
  elements.questionTitle.textContent = currentQuestion.question;
  elements.feedback.hidden = true;
  elements.feedback.className = "feedback";
  elements.nextButton.disabled = true;
  elements.nextButton.textContent = currentQuestionIndex === quizQuestions.length - 1 ? "결과 보기" : "다음 문제";

  const optionButtons = currentQuestion.options.map((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = `${String.fromCharCode(9312 + optionIndex)} ${option}`;
    button.addEventListener("click", () => selectAnswer(optionIndex));
    return button;
  });

  elements.optionsList.replaceChildren(...optionButtons);
}

function selectAnswer(selectedAnswer) {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.answer;
  if (isCorrect) {
    score += 1;
  }
  answerHistory.push({ category: currentQuestion.category, isCorrect });

  [...elements.optionsList.children].forEach((button, optionIndex) => {
    button.disabled = true;
    if (optionIndex === currentQuestion.answer) {
      button.classList.add("correct");
    }
    if (optionIndex === selectedAnswer && !isCorrect) {
      button.classList.add("incorrect");
    }
  });

  elements.feedback.hidden = false;
  elements.quizCategory.textContent = categoryLabels[currentQuestion.category];
  elements.feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
  elements.feedbackTitle.textContent = isCorrect ? "정답입니다." : `오답입니다. 정답: ${currentQuestion.options[currentQuestion.answer]}`;
  elements.feedbackExplanation.textContent = currentQuestion.explanation;
  elements.nextButton.disabled = false;
}

function goToNextQuestion() {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion();
    return;
  }
  showResults();
}

function showResults() {
  showScreen("result");
  elements.totalScore.textContent = `${score} / ${quizQuestions.length}`;
  renderCategoryResults();
  renderRanking();
}

function renderCategoryResults() {
  const categoryTotals = {};
  answerHistory.forEach(({ category, isCorrect }) => {
    if (!categoryTotals[category]) {
      categoryTotals[category] = { correct: 0, total: 0 };
    }
    categoryTotals[category].total += 1;
    if (isCorrect) {
      categoryTotals[category].correct += 1;
    }
  });

  const resultItems = Object.entries(categoryTotals).map(([category, result]) => {
    const item = document.createElement("div");
    item.className = "category-result-item";
    const label = document.createElement("span");
    label.textContent = categoryLabels[category];
    const scoreText = document.createElement("strong");
    scoreText.textContent = `${result.correct} / ${result.total}`;
    item.append(label, scoreText);
    return item;
  });
  elements.categoryResultsList.replaceChildren(...resultItems);
}

function loadRanking() {
  try {
    const savedRanking = JSON.parse(localStorage.getItem(rankingStorageKey) || "[]");
    return Array.isArray(savedRanking) ? savedRanking : [];
  } catch {
    return [];
  }
}

function saveRanking(nickname) {
  const ranking = loadRanking();
  ranking.push({ nickname, score, total: quizQuestions.length, createdAt: Date.now() });
  ranking.sort((first, second) => {
    const scoreDifference = second.score / second.total - first.score / first.total;
    return scoreDifference || second.score - first.score || first.createdAt - second.createdAt;
  });
  localStorage.setItem(rankingStorageKey, JSON.stringify(ranking.slice(0, 10)));
}

function renderRanking(rankingCount = elements.rankingCount, rankingList = elements.rankingList) {
  const ranking = loadRanking();
  rankingCount.textContent = `${ranking.length}명 기록`;
  if (ranking.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "ranking-empty";
    emptyItem.textContent = "아직 기록된 랭킹이 없습니다.";
    rankingList.replaceChildren(emptyItem);
    return;
  }

  const rankingItems = ranking.map((record, index) => {
    const item = document.createElement("li");
    item.className = "ranking-item";
    const rank = document.createElement("span");
    rank.className = "rank-number";
    rank.textContent = `#${index + 1}`;
    const name = document.createElement("span");
    name.className = "rank-name";
    name.textContent = record.nickname;
    const recordScore = document.createElement("strong");
    recordScore.className = "rank-score";
    recordScore.textContent = `${record.score}/${record.total}`;
    item.append(rank, name, recordScore);
    return item;
  });
  rankingList.replaceChildren(...rankingItems);
}

function renderAllRankings() {
  renderRanking();
  renderRanking(elements.startRankingCount, elements.startRankingList);
}

elements.startButton.addEventListener("click", startQuiz);
elements.nextButton.addEventListener("click", goToNextQuestion);
elements.recordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nickname = elements.nicknameInput.value.trim();
  if (!nickname) {
    elements.nicknameInput.focus();
    return;
  }
  saveRanking(nickname);
  elements.nicknameInput.value = "";
  elements.recordStatus.textContent = "랭킹에 기록했습니다.";
  renderAllRankings();
});
elements.restartButton.addEventListener("click", () => {
  showScreen("start");
  renderRanking(elements.startRankingCount, elements.startRankingList);
  elements.categorySelect.focus();
});

renderRanking(elements.startRankingCount, elements.startRankingList);
