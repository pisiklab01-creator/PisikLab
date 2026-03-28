import { auth } from "../firebase-config.js";
import { LESSONS } from "./lesson-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getUserData, updateUserData } from "../Game System/user-service.js";

const backToDashboardBtn = document.getElementById("backToDashboardBtn");
const lessonTabs = document.querySelectorAll(".lesson-tab");
const lessonTitle = document.getElementById("lessonTitle");
const lessonStepLabel = document.getElementById("lessonStepLabel");
const prevStepBtn = document.getElementById("prevStepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");
const lessonSessionScore = document.getElementById("lessonSessionScore");

const LESSON_SESSION_SCORE_KEY = "pisiklab_lesson_session_score";
const LESSON_CURRENT_STEP_KEY = "pisiklab_lesson_current_step";

const stepOrder = ["motivation", "diagnostic", "content", "video", "lab", "assessment"];
const quizSteps = ["diagnostic", "lab", "assessment"];

let lessonResultState = {
  motivation: { awarded: false, points: 0 },
  diagnostic: { awarded: false, points: 0 },
  content: { awarded: false, points: 0 },
  video: {
    awarded: false,
    points: 0,
    watchedVideoIds: [],
    completedVideoIds: []
  },
  lab: { awarded: false, points: 0 },
  assessment: {
    awarded: false,
    points: 0,
    bonusPoints: 0,
    badge: null,
    percent: 0,
    correctCount: 0,
    totalQuestions: 0
  },
  totalPoints: 0,
  completed: false,
  completedAt: null
};

let quizTimerInterval = null;
let quizRenderTick = 0;

let currentLessonId = "lesson1";
let currentStepIndex = 0;
let currentUserData = null;
let isAdmin = false;

let lessonState = {
  currentStep: "motivation",
  completedSteps: []
};

let lessonQuizState = {
  diagnostic: null,
  lab: null,
  assessment: null
};

const PRAISE_LINES = [
  "Thermorrific!",
  "Labsolutely!",
  "Sparktastic!",
  "Heatcredible!",
  "Tempressive!",
  "Entromendous!",
  "Heatastic!",
  "Temperfect!",
  "Energified!",
  "Thermanificent!"
];

const BADGE_META = {
  spark: {
    label: "Spark Badge",
    className: "quiz-badge--spark"
  },
  charge: {
    label: "Charge Badge",
    className: "quiz-badge--charge"
  },
  ignition: {
    label: "Ignition Badge",
    className: "quiz-badge--ignition"
  },
  burst: {
    label: "Burst Badge",
    className: "quiz-badge--burst"
  }
};

function getOrCreateQuizReviewModal() {
  let modal = document.getElementById("quizReviewModal");

  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "quizReviewModal";
  modal.className = "quiz-review-modal hidden";

  modal.innerHTML = `
    <div class="quiz-review-modal__backdrop"></div>
    <div class="quiz-review-modal__card">
      <div class="quiz-review-modal__header">
        <div class="quiz-review-modal__heading">
          <h3 class="quiz-review-modal__title">Quiz Review</h3>
          <p class="quiz-review-modal__subtitle"></p>
        </div>
        <button type="button" class="quiz-review-modal__close" aria-label="Close review">×</button>
      </div>

      <div class="quiz-review-modal__body"></div>

      <div class="quiz-review-modal__footer">
        <button type="button" class="quiz-review-modal__done">Done</button>
      </div>
    </div>
  `;

  modal.querySelector(".quiz-review-modal__close")
    ?.addEventListener("click", closeQuizReviewModal);

  modal.querySelector(".quiz-review-modal__done")
    ?.addEventListener("click", closeQuizReviewModal);

  modal.querySelector(".quiz-review-modal__backdrop")
    ?.addEventListener("click", closeQuizReviewModal);

  document.body.appendChild(modal);
  return modal;
}

function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "lesson1";
}

function getSessionScoreKey(lessonId) {
  return `${LESSON_SESSION_SCORE_KEY}_${lessonId}`;
}

function getCurrentStepKey(lessonId) {
  return `${LESSON_CURRENT_STEP_KEY}_${lessonId}`;
}

function getLessonData() {
  return LESSONS[currentLessonId] || LESSONS.lesson1;
}

function getSection(stepId) {
  return getLessonData()?.sections?.[stepId] || null;
}

function getSessionScore() {
  const key = getSessionScoreKey(currentLessonId);
  return Number(sessionStorage.getItem(key) || "0");
}

function setSessionScore(value) {
  const key = getSessionScoreKey(currentLessonId);
  sessionStorage.setItem(key, String(value));

  if (lessonSessionScore) {
    lessonSessionScore.textContent = value;
  }
}

function addToSessionScore(amount) {
  const current = getSessionScore();
  setSessionScore(current + amount);
}

function clearSessionScore() {
  const key = getSessionScoreKey(currentLessonId);
  sessionStorage.removeItem(key);

  if (lessonSessionScore) {
    lessonSessionScore.textContent = "0";
  }
}

function getSavedStep() {
  const key = getCurrentStepKey(currentLessonId);
  return sessionStorage.getItem(key) || "motivation";
}

function loadLessonMeta() {
  const lesson = getLessonData();
  lessonTitle.textContent = lesson.title;
}

function updateStepButtons() {
  prevStepBtn.disabled = currentStepIndex <= 0;
  nextStepBtn.disabled = currentStepIndex >= stepOrder.length - 1;
}

function setActiveStep(stepId) {
stopQuizTimer();

  document.querySelectorAll(".lesson-step").forEach((section) => {
    section.classList.remove("active-step");
    section.classList.add("hidden-step");
  });

  document.querySelectorAll(".lesson-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  const targetStep = document.getElementById(`step-${stepId}`);
  const targetTab = document.querySelector(`.lesson-tab[data-step="${stepId}"]`);

  if (targetStep) {
    targetStep.classList.remove("hidden-step");
    targetStep.classList.add("active-step");
  }

  if (targetTab) {
    targetTab.classList.add("active");
  }

  sessionStorage.setItem(getCurrentStepKey(currentLessonId), stepId);

  lessonStepLabel.textContent = targetTab ? targetTab.textContent : stepId;
  currentStepIndex = stepOrder.indexOf(stepId);

  updateStepButtons();
  renderCurrentStep();
queueMicrotask(async () => {
  if (stepId === "motivation") {
    await awardFlatStepPointsOnce("motivation", LESSON_PART_POINTS.motivation);
  }

  if (stepId === "content") {
    await awardFlatStepPointsOnce("content", LESSON_PART_POINTS.content);
  }

  if (stepId === "video") {
    await awardFlatStepPointsOnce("video", LESSON_PART_POINTS.video);
  }
});
}

function applyStepAccess() {
  const unlockedSteps = new Set([
    ...lessonState.completedSteps,
    lessonState.currentStep
  ]);

  lessonTabs.forEach((tab) => {
    const stepId = tab.dataset.step;

    if (isAdmin || unlockedSteps.has(stepId)) {
      tab.disabled = false;
      tab.classList.remove("lesson-tab--locked");
    } else {
      tab.disabled = true;
      tab.classList.add("lesson-tab--locked");
    }
  });
}

function isQuizStep(stepId) {
  const section = getSection(stepId);
  return Boolean(section?.quiz);
}

function createDefaultQuizState(stepId) {
  const section = getSection(stepId);
  const questions = section?.quiz?.questions || [];

  if (!section?.quiz) return null;

  return {
    started: false,
    completed: false,
    currentQuestionIndex: 0,
    answers: [],
    correctCount: 0,
    totalQuestions: questions.length,

    timerMode: getQuizTimerMode(stepId),
    currentQuestionStartedAt: null,
    currentQuestionElapsedMs: 0,
    currentQuestionDeadlineAt: null,
    currentQuestionExpired: false,
    elapsedMsByQuestion: {},

    shuffledQuestions: []
  };
}

function ensureQuizState(stepId) {
  if (!quizSteps.includes(stepId)) return null;

  if (!lessonQuizState[stepId]) {
    lessonQuizState[stepId] = createDefaultQuizState(stepId);
  }

  return lessonQuizState[stepId];
}

function getQuizState(stepId) {
  return ensureQuizState(stepId);
}

function getQuizTimerMode(stepId) {
  if (stepId === "lab") return "speed_only";
  if (stepId === "assessment") return "speed_with_limit";
  return "none";
}

function getQuizTimeLimitMs(stepId) {
  if (stepId === "assessment") return 90 * 1000; // 1 minute 30 seconds
  return null;
}

function getQuizTimerLabel(stepId) {
  if (stepId === "lab") return "Response Time";
  if (stepId === "assessment") return "Time Remaining";
  return "";
}

function formatMsAsClock(ms) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.ceil(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatElapsedMs(ms) {
  const seconds = Math.max(0, ms) / 1000;
  return `${seconds.toFixed(1)}s`;
}

function isCurrentStepQuizComplete() {
  const stepId = stepOrder[currentStepIndex];

  if (!isQuizStep(stepId)) return true;
  if (isAdmin) return true;

  const state = getQuizState(stepId);
  return Boolean(state?.completed);
}

async function saveLessonState() {
  const user = auth.currentUser;
  if (!user) return;

  await updateUserData(user.uid, {
    [`progress.lessonState.${currentLessonId}`]: lessonState,
    [`progress.lessonQuizState.${currentLessonId}`]: lessonQuizState
  });
}

async function loadUserLessonState(userId) {
  const userData = await getUserData(userId);

  currentUserData = userData || {};
  isAdmin = userData?.admin === true;

  const savedQuizState = userData?.progress?.lessonQuizState?.[currentLessonId];
  const savedLessonState = userData?.progress?.lessonState?.[currentLessonId];
  const savedLessonResultState = userData?.progress?.lessonResults?.[currentLessonId];

  if (savedLessonState) {
    lessonState = {
      currentStep: savedLessonState.currentStep || "motivation",
      completedSteps: Array.isArray(savedLessonState.completedSteps)
        ? savedLessonState.completedSteps
        : []
    };
  } else {
    lessonState = {
      currentStep: getSavedStep(),
      completedSteps: []
    };
  }

  lessonQuizState = {
    diagnostic: savedQuizState?.diagnostic || null,
    lab: savedQuizState?.lab || null,
    assessment: savedQuizState?.assessment || null
  };

  lessonResultState = savedLessonResultState || createDefaultLessonResultState();

  resetIncompleteQuizzes();

  await updateUserData(userId, {
    [`progress.lessonState.${currentLessonId}`]: lessonState,
    [`progress.lessonQuizState.${currentLessonId}`]: lessonQuizState,
    [`progress.lessonResults.${currentLessonId}`]: lessonResultState
  });
}

function renderCurrentStep() {
  const stepId = stepOrder[currentStepIndex];
  renderStepContent(stepId);
}

function renderStepContent(stepId) {
  const section = getSection(stepId);
  const stepElement = document.getElementById(`step-${stepId}`);

  if (!section || !stepElement) return;

  stepElement.innerHTML = "";

  const contentWrap = document.createElement("div");
  contentWrap.className = "lesson-dynamic-content";

  if (Array.isArray(section.content)) {
    section.content.forEach((block) => {
      const el = renderContentBlock(block);
      if (el) contentWrap.appendChild(el);
    });
  }

  stepElement.appendChild(contentWrap);

  if (Array.isArray(section.videos) && section.videos.length) {
    const videosUI = renderVideosBlock(section.videos);
    stepElement.appendChild(videosUI);
  }

  if (section.quiz) {
    const quizUI = renderQuizBlock(stepId, section.quiz);
    stepElement.appendChild(quizUI);
  }
}

function renderContentBlock(block) {
  if (!block || !block.type) return null;

  switch (block.type) {
    case "heading": {
      const el = document.createElement("h3");
      el.className = "lesson-content-heading";
      el.textContent = block.text || "";
      return el;
    }

    case "subheading": {
      const el = document.createElement("h4");
      el.className = "lesson-content-subheading";
      el.textContent = block.text || "";
      return el;
    }

    case "paragraph": {
      const el = document.createElement("p");
      el.className = "lesson-content-paragraph";
      el.textContent = block.text || "";
      return el;
    }

    case "image": {
      const wrap = document.createElement("figure");
      wrap.className = "lesson-content-figure";

      if (block.align) {
        wrap.classList.add(`lesson-content-figure--${block.align}`);
      }

      if (block.size) {
        wrap.classList.add(`lesson-content-figure--${block.size}`);
      }

      const img = document.createElement("img");
      img.className = "lesson-content-image";
      img.src = block.src || "";
      img.alt = block.alt || "";

      wrap.appendChild(img);

      if (block.caption) {
        const caption = document.createElement("figcaption");
        caption.className = "lesson-content-caption";
        caption.textContent = block.caption;
        wrap.appendChild(caption);
      }

      return wrap;
    }

    case "list": {
      const ul = document.createElement("ul");
      ul.className = "lesson-content-list";

      (block.items || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
      });

      return ul;
    }

    default:
      return null;
  }
}

function renderVideoDescription(description) {
  if (!description) return "";

  if (typeof description === "string") {
    return `<p class="lesson-video-card__description">${description}</p>`;
  }

  const objectives = Array.isArray(description.objectives) && description.objectives.length
    ? `
      <div class="lesson-video-card__section">
        <h5 class="lesson-video-card__section-title">Objectives</h5>
        <ul class="lesson-video-card__list">
          ${description.objectives.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `
    : "";

  const materials = Array.isArray(description.materials) && description.materials.length
    ? `
      <div class="lesson-video-card__section">
        <h5 class="lesson-video-card__section-title">Materials</h5>
        <ul class="lesson-video-card__list">
          ${description.materials.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `
    : "";

  const procedure = Array.isArray(description.procedure) && description.procedure.length
    ? `
      <div class="lesson-video-card__section">
        <h5 class="lesson-video-card__section-title">Procedure</h5>
        <ol class="lesson-video-card__list lesson-video-card__list--ordered">
          ${description.procedure.map(item => `<li>${item}</li>`).join("")}
        </ol>
      </div>
    `
    : "";

  return `
    <div class="lesson-video-card__description-block">
      ${objectives}
      ${materials}
      ${procedure}
    </div>
  `;
}

function renderVideosBlock(videos) {
  const wrap = document.createElement("div");
  wrap.className = "lesson-videos-block";

  videos.forEach((videoItem, index) => {
    const card = document.createElement("article");
    card.className = "lesson-video-card";

    card.innerHTML = `
      <div class="lesson-video-card__meta">
        <span class="lesson-video-card__eyebrow">Demo ${index + 1}</span>
        <h4 class="lesson-video-card__title">${videoItem.title || `Video ${index + 1}`}</h4>
        ${renderVideoDescription(videoItem.description)}
      </div>

<div class="lesson-video-card__player">
  <div class="lesson-video-embed">
    <iframe
      class="lesson-video-player"
      src="${videoItem.embedUrl || ""}"
      title="${videoItem.title || `Video ${index + 1}`}"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>
  </div>
</div>
    `;

    wrap.appendChild(card);
  });

  return wrap;
}

function renderQuizBlock(stepId, quiz) {
  const state = getQuizState(stepId);

  const wrap = document.createElement("div");
  wrap.className = "quiz-block";

  if (!state) {
    wrap.innerHTML = `
      <div class="quiz-start-card">
        <h3>Quiz unavailable</h3>
        <p>This quiz could not be loaded.</p>
      </div>
    `;
    return wrap;
  }

  if (!state.started) {
    wrap.innerHTML = `
      <div class="quiz-start-card">
        <h3>${quiz.title || sectionLabelFromStep(stepId)}</h3>
        <p>${quiz.description || "Click the button below to begin the quiz."}</p>
        <button class="quiz-start-btn" type="button">
          ${quiz.startButtonText || "Start Quiz"}
        </button>
      </div>
    `;

    wrap.querySelector(".quiz-start-btn")?.addEventListener("click", async () => {
      state.started = true;
      state.completed = false;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.correctCount = 0;

      const originalQuestions = Array.isArray(quiz.questions) ? quiz.questions : [];
      state.shuffledQuestions =
        quiz.shuffleQuestions === false
        ? originalQuestions.map((q) => ({
            ...q,
            choices: [...q.choices]
          }))
    : buildShuffledQuizQuestions(originalQuestions);
      state.totalQuestions = state.shuffledQuestions.length;

      state.elapsedMsByQuestion = {};
      state.currentQuestionStartedAt = null;
      state.currentQuestionElapsedMs = 0;
      state.currentQuestionDeadlineAt = null;
      state.currentQuestionExpired = false;
      state.totalPoints = 0;
      state.badge = null;

      await saveLessonState();
      renderCurrentStep();
    });

    return wrap;
  }

if (state.completed) {
  const isAssessment = stepId === "assessment";
  const badgeMarkup = isAssessment && state.badge
    ? renderAssessmentBadge(state.badge, state.totalPoints || 0)
    : "";

  wrap.innerHTML = `
    <div class="quiz-complete-card">
      <h3>Quiz Complete</h3>
      <p>You answered ${state.correctCount} out of ${state.totalQuestions} correctly.</p>

${isAssessment ? `
  <div class="quiz-complete-summary">
    <div class="quiz-complete-summary__points">
      <span class="quiz-complete-summary__label">Assessment Points</span>
      <strong>${state.totalPoints || 0}</strong>
    </div>
    ${badgeMarkup}
  </div>

  <div class="quiz-complete-actions">
    <button class="quiz-review-btn" type="button">Review Quiz</button>
    <button class="quiz-end-btn" type="button">End Lesson</button>
  </div>
` : `
  <button class="quiz-review-btn" type="button">Review Quiz</button>
`}
    </div>
  `;

// Review button (ALL quizzes)
wrap.querySelector(".quiz-review-btn")?.addEventListener("click", () => {
  openQuizReviewModal(stepId);
});

// End lesson button (ASSESSMENT only)
if (isAssessment) {
wrap.querySelector(".quiz-end-btn")?.addEventListener("click", async () => {
  await finalizeLessonRun();
  window.location.href = getResultsPageUrl();
});
}

  return wrap;
}

const activeQuestions =
  state.shuffledQuestions?.length ? state.shuffledQuestions : (quiz.questions || []);

const question = activeQuestions[state.currentQuestionIndex];

if (!question) {
  wrap.innerHTML = `
    <div class="quiz-start-card">
      <h3>Quiz unavailable</h3>
      <p>No questions were found for this quiz.</p>
    </div>
  `;
  return wrap;
}

const previousQuestion = activeQuestions[state.currentQuestionIndex - 1];
const showSectionTitle =
  stepId === "lab" &&
  question?.sectionTitle &&
  question.sectionTitle !== previousQuestion?.sectionTitle;

wrap.innerHTML = `
  <div class="quiz-card quiz-card--animated">
    <div class="quiz-card__top">
      <span class="quiz-progress">
        Question ${state.currentQuestionIndex + 1} of ${activeQuestions.length}
      </span>

      ${getQuizTimerMode(stepId) !== "none" ? `
        <div class="quiz-timer ${stepId === "assessment" ? "quiz-timer--countdown" : "quiz-timer--stopwatch"}">
          <span class="quiz-timer__label">${getQuizTimerLabel(stepId)}</span>
          <span class="quiz-timer__value">00:00</span>
        </div>
      ` : ""}
    </div>

    ${getQuizTimerMode(stepId) !== "none" ? `
      <div class="quiz-timer__bar">
        <div class="quiz-timer__bar-fill"></div>
      </div>
    ` : ""}

    ${showSectionTitle ? `
      <div class="quiz-section-label">${question.sectionTitle}</div>
    ` : ""}

    <h3 class="quiz-question">${question.question || ""}</h3>

    ${question.image ? `
      <div class="quiz-question-media">
        <img
          src="${question.image.src || ""}"
          alt="${question.image.alt || ""}"
          class="quiz-question-image"
        >
      </div>
    ` : ""}

    <div class="quiz-choices"></div>
  </div>
`;

  const choicesWrap = wrap.querySelector(".quiz-choices");

  (question.choices || []).forEach((choiceText, choiceIndex) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-choice-btn";
    btn.textContent = choiceText;

    btn.addEventListener("click", async () => {
      await handleQuizAnswer(stepId, choiceIndex);
    });

    choicesWrap.appendChild(btn);
  });

  queueMicrotask(() => {
    const freshState = getQuizState(stepId);
    const hasAnsweredCurrent = Boolean(freshState?.answers?.[freshState.currentQuestionIndex]);

    if (!hasAnsweredCurrent && !freshState.completed) {
      startQuizTimer(stepId);
      updateLiveQuizTimer(stepId);
    }
  });

  return wrap;
}

function sectionLabelFromStep(stepId) {
  const section = getSection(stepId);
  return section?.label || stepId;
}

async function handleQuizAnswer(stepId, selectedIndex) {
  const section = getSection(stepId);
  const quiz = section?.quiz;
  const state = getQuizState(stepId);

  if (!quiz || !state || state.completed) return;

  const activeQuestions =
    state.shuffledQuestions?.length ? state.shuffledQuestions : (quiz.questions || []);

  const question = activeQuestions[state.currentQuestionIndex];
  if (!question) return;

  stopQuizTimer();

  const questionIndex = state.currentQuestionIndex;
  const questionKey = `${stepId}_${questionIndex}`;
  const elapsedMs = Date.now() - state.currentQuestionStartedAt;

  state.currentQuestionElapsedMs = elapsedMs;
  state.elapsedMsByQuestion[questionKey] = elapsedMs;

  const isCorrect = selectedIndex === question.correctIndex;

  state.answers[questionIndex] = {
    questionId: question.id || `${stepId}_${questionIndex}`,
    selectedIndex,
    correctIndex: question.correctIndex,
    isCorrect,
    timedOut: false,
    elapsedMs
  };

  state.correctCount = state.answers.filter((answer) => answer?.isCorrect).length;

  if (stepId === "assessment" && isCorrect) {
    showPraisePopup(getRandomPraise());
  }

  await saveLessonState();

  openQuizFeedbackModal({
    title: isCorrect ? "Correct!" : "Wrong!",
    message: isCorrect
      ? (quiz.correctMessage || "Nice work. Ready for the next question?")
      : (quiz.wrongMessage || "Not quite. Let’s move on to the next one."),
    isCorrect,
    onNext: async () => {
      const isLastQuestion = state.currentQuestionIndex >= activeQuestions.length - 1;

      if (isLastQuestion) {
        state.completed = true;
        if (stepId === "diagnostic") {
          await awardFlatStepPointsOnce("diagnostic", LESSON_PART_POINTS.diagnostic);
        }

        if (stepId === "lab") {
          await awardLabPointsOnce();
        }

if (stepId === "assessment") {
  const basePoints = calculateAssessmentTotalPoints(state.answers || []);
  state.totalPoints = basePoints;
  state.badge = getAssessmentBadge(basePoints);
  await awardAssessmentPointsOnce();
}
      } else {
        state.currentQuestionIndex += 1;
      }

      await saveLessonState();
      renderCurrentStep();
    }
  });
}

async function handleQuizTimeout(stepId) {
  const section = getSection(stepId);
  const quiz = section?.quiz;
  const state = getQuizState(stepId);

  if (!quiz || !state || state.completed) return;

  const activeQuestions =
    state.shuffledQuestions?.length ? state.shuffledQuestions : (quiz.questions || []);

  const question = activeQuestions[state.currentQuestionIndex];
  if (!question) return;

  state.answers[state.currentQuestionIndex] = {
    questionId: question.id || `${stepId}_${state.currentQuestionIndex}`,
    selectedIndex: null,
    correctIndex: question.correctIndex,
    isCorrect: false,
    timedOut: true,
    elapsedMs: state.currentQuestionElapsedMs
  };

  state.correctCount = state.answers.filter((answer) => answer?.isCorrect).length;

  await saveLessonState();

  openQuizFeedbackModal({
    title: "Time's up!",
    message: "This item has reached its time limit. Let’s move to the next question.",
    isCorrect: false,
    onNext: async () => {
      const isLastQuestion = state.currentQuestionIndex >= activeQuestions.length - 1;

      if (isLastQuestion) {
        state.completed = true;

if (stepId === "assessment") {
  const basePoints = calculateAssessmentTotalPoints(state.answers || []);
  state.totalPoints = basePoints;
  state.badge = getAssessmentBadge(basePoints);
  await awardAssessmentPointsOnce();
}
      } else {
        state.currentQuestionIndex += 1;
      }

      await saveLessonState();
      renderCurrentStep();
    }
  });
}

function openQuizFeedbackModal({
  title,
  message,
  isCorrect,
  onNext = null,
  hideNextButton = false
}) {
  const modal = getOrCreateQuizModal();
  const titleEl = modal.querySelector(".quiz-modal-title");
  const messageEl = modal.querySelector(".quiz-modal-message");
  const nextBtn = modal.querySelector(".quiz-modal-next-btn");
  const closeBtn = modal.querySelector(".quiz-modal-close-btn");
  const card = modal.querySelector(".quiz-modal-card");

  titleEl.textContent = title || "";
  messageEl.textContent = message || "";

  card.classList.remove("quiz-modal-correct", "quiz-modal-wrong");

  if (isCorrect === true) {
    card.classList.add("quiz-modal-correct");
  } else if (isCorrect === false) {
    card.classList.add("quiz-modal-wrong");
  }

  const advance = async () => {
    closeQuizFeedbackModal();

    if (typeof onNext === "function") {
      await onNext();
    }
  };

  if (hideNextButton) {
    nextBtn.style.display = "none";
    closeBtn.style.display = "inline-flex";
    modal._advance = null;
  } else {
    nextBtn.style.display = "inline-flex";
    closeBtn.style.display = "none";
    modal._advance = advance;
  }

  nextBtn.onclick = advance;

  modal.classList.remove("hidden");
}

function closeQuizFeedbackModal() {
  const modal = document.getElementById("quizFeedbackModal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal._advance = null;
}

function getQuizDisplayQuestions(stepId, quiz, state) {
  if (!quiz || !state) return [];
  return state.shuffledQuestions?.length
    ? state.shuffledQuestions
    : (quiz.questions || []);
}

function getChoiceLabel(index) {
  return String.fromCharCode(65 + index);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getOrCreateQuizModal() {
  let modal = document.getElementById("quizFeedbackModal");

  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "quizFeedbackModal";
  modal.className = "quiz-modal hidden";

  modal.innerHTML = `
    <div class="quiz-modal-backdrop"></div>
    <div class="quiz-modal-card">
      <button type="button" class="quiz-modal-close-btn" aria-label="Close">×</button>
      <h3 class="quiz-modal-title"></h3>
      <p class="quiz-modal-message"></p>
      <div class="quiz-modal-actions">
        <button class="quiz-modal-next-btn" type="button">Continue</button>
      </div>
    </div>
  `;

  const backdrop = modal.querySelector(".quiz-modal-backdrop");
  const closeBtn = modal.querySelector(".quiz-modal-close-btn");

  backdrop.addEventListener("click", () => {
    if (typeof modal._advance === "function") {
      modal._advance();
    } else {
      closeQuizFeedbackModal();
    }
  });

  closeBtn.addEventListener("click", () => {
    if (typeof modal._advance === "function") {
      modal._advance();
    } else {
      closeQuizFeedbackModal();
    }
  });

  document.body.appendChild(modal);
  return modal;
}

function openQuizReviewModal(stepId) {
  const section = getSection(stepId);
  const quiz = section?.quiz;
  const state = getQuizState(stepId);

  if (!quiz || !state) return;

  const questions = getQuizDisplayQuestions(stepId, quiz, state);
  const modal = getOrCreateQuizReviewModal();
  const titleEl = modal.querySelector(".quiz-review-modal__title");
  const subtitleEl = modal.querySelector(".quiz-review-modal__subtitle");
  const bodyEl = modal.querySelector(".quiz-review-modal__body");

  titleEl.textContent = `${sectionLabelFromStep(stepId)} Review`;
  subtitleEl.textContent = `You answered ${state.correctCount} out of ${state.totalQuestions} correctly.`;

  const reviewHtml = questions.map((question, index) => {
    const explanationMarkup = question.explanation
  ? `
    <div class="quiz-review-item__explanation">
      <div class="quiz-review-item__explanation-label">Explanation</div>
      <p class="quiz-review-item__explanation-text">${escapeHtml(question.explanation)}</p>
    </div>
  `
  : "";
    const answer = state.answers?.[index];
    const selectedIndex = answer?.selectedIndex;
    const correctIndex = question.correctIndex;
    const wasTimedOut = answer?.timedOut === true;
    const selectedText =
      selectedIndex === null || selectedIndex === undefined
        ? "No answer submitted"
        : question.choices?.[selectedIndex] || "No answer submitted";

    const correctText = question.choices?.[correctIndex] || "No correct answer found";
    const resultClass = answer?.isCorrect ? "is-correct" : "is-wrong";
    const resultLabel = wasTimedOut
      ? "Timed out"
      : answer?.isCorrect
        ? "Correct"
        : "Incorrect";

    const sectionBadge =
      stepId === "lab" && question.sectionTitle
        ? `<div class="quiz-review-item__section">${escapeHtml(question.sectionTitle)}</div>`
        : "";

    const imageMarkup = question.image?.src
      ? `
        <div class="quiz-review-item__image-wrap">
          <img
            src="${escapeHtml(question.image.src)}"
            alt="${escapeHtml(question.image.alt || question.question || `Question ${index + 1}`)}"
            class="quiz-review-item__image"
          >
        </div>
      `
      : "";

    const choicesMarkup = (question.choices || []).map((choice, choiceIndex) => {
      const isSelected = selectedIndex === choiceIndex;
      const isCorrectChoice = correctIndex === choiceIndex;

      let choiceClass = "quiz-review-choice";
      if (isCorrectChoice) choiceClass += " quiz-review-choice--correct";
      if (isSelected && !isCorrectChoice) choiceClass += " quiz-review-choice--selected-wrong";
      if (isSelected && isCorrectChoice) choiceClass += " quiz-review-choice--selected-correct";

      return `
        <li class="${choiceClass}">
          <span class="quiz-review-choice__label">${getChoiceLabel(choiceIndex)}.</span>
          <span class="quiz-review-choice__text">${escapeHtml(choice)}</span>
        </li>
      `;
    }).join("");

return `
  <article class="quiz-review-item ${resultClass}">
    <div class="quiz-review-item__top">
      <span class="quiz-review-item__number">Question ${index + 1}</span>
      <span class="quiz-review-item__result">${resultLabel}</span>
    </div>

    ${sectionBadge}

    <h4 class="quiz-review-item__question">${escapeHtml(question.question)}</h4>

    ${imageMarkup}

    <ol class="quiz-review-choices">
      ${choicesMarkup}
    </ol>

    <div class="quiz-review-item__answers">
      <div class="quiz-review-item__answer-row">
        <span class="quiz-review-item__answer-label">Your answer:</span>
        <span class="quiz-review-item__answer-text">${escapeHtml(selectedText)}</span>
      </div>

      <div class="quiz-review-item__answer-row">
        <span class="quiz-review-item__answer-label">Correct answer:</span>
        <span class="quiz-review-item__answer-text">${escapeHtml(correctText)}</span>
      </div>
    </div>

    ${explanationMarkup}
  </article>
`;
  }).join("");

  bodyEl.innerHTML = reviewHtml || `
    <div class="quiz-review-empty">
      <p>No review data available for this quiz yet.</p>
    </div>
  `;

  modal.classList.remove("hidden");
  document.body.classList.add("quiz-review-open");
}

function closeQuizReviewModal() {
  const modal = document.getElementById("quizReviewModal");
  if (!modal) return;

  modal.classList.add("hidden");
  document.body.classList.remove("quiz-review-open");
}

async function goToNextStep() {
  if (currentStepIndex >= stepOrder.length - 1) return;

  const currentStep = stepOrder[currentStepIndex];
  const nextStep = stepOrder[currentStepIndex + 1];

  if (!isCurrentStepQuizComplete()) {
    openQuizFeedbackModal({
      title: "Quiz not finished",
      message: "Please complete this quiz first before proceeding.",
      isCorrect: false,
      hideNextButton: true
    });
    return;
  }

  stopQuizTimer();

  if (!lessonState.completedSteps.includes(currentStep)) {
    lessonState.completedSteps.push(currentStep);
  }

  lessonState.currentStep = nextStep;

  await saveLessonState();
  setActiveStep(nextStep);
  applyStepAccess();
}

async function goToPrevStep() {
  if (currentStepIndex <= 0) return;

  stopQuizTimer();

  const prevStep = stepOrder[currentStepIndex - 1];
  setActiveStep(prevStep);
}

backToDashboardBtn.addEventListener("click", async () => {
  stopQuizTimer();
  await persistResetIncompleteQuizzes();
  clearSessionScore();
  window.location.href = "../Pages/dashboard.html";
});

lessonTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const stepId = tab.dataset.step;

    if (tab.disabled) return;

    setActiveStep(stepId);
  });
});

function stopQuizTimer() {
  if (quizTimerInterval) {
    clearInterval(quizTimerInterval);
    quizTimerInterval = null;
  }
}

function startQuizTimer(stepId) {
  stopQuizTimer();

  const state = getQuizState(stepId);
  if (!state || state.completed) return;

  const questionIndex = state.currentQuestionIndex;
  const questionKey = `${stepId}_${questionIndex}`;
  const now = Date.now();

  state.currentQuestionStartedAt = now;
  state.currentQuestionElapsedMs = 0;
  state.currentQuestionExpired = false;

  const limitMs = getQuizTimeLimitMs(stepId);
  state.currentQuestionDeadlineAt = limitMs ? now + limitMs : null;

  quizTimerInterval = setInterval(async () => {
    const activeState = getQuizState(stepId);
    if (!activeState || activeState.completed) {
      stopQuizTimer();
      return;
    }

    const elapsed = Date.now() - activeState.currentQuestionStartedAt;
    activeState.currentQuestionElapsedMs = elapsed;
    quizRenderTick += 1;

    if (activeState.currentQuestionDeadlineAt && Date.now() >= activeState.currentQuestionDeadlineAt) {
      activeState.currentQuestionExpired = true;
      activeState.elapsedMsByQuestion[questionKey] =
        activeState.currentQuestionDeadlineAt - activeState.currentQuestionStartedAt;
      stopQuizTimer();

      await handleQuizTimeout(stepId);
      return;
    }

    updateLiveQuizTimer(stepId);
  }, 100);
}

function updateLiveQuizTimer(stepId) {
  const state = getQuizState(stepId);
  if (!state) return;

  const timerValue = document.querySelector(".quiz-timer__value");
  const timerBarFill = document.querySelector(".quiz-timer__bar-fill");
  const quizCard = document.querySelector(".quiz-card");

  if (!timerValue || !timerBarFill) return;

  if (stepId === "lab") {
    timerValue.textContent = formatElapsedMs(state.currentQuestionElapsedMs);
    timerBarFill.style.width = "100%";
    timerBarFill.classList.remove("quiz-timer__bar-fill--warning", "quiz-timer__bar-fill--danger");
    if (quizCard) {
      quizCard.classList.remove("quiz-card--warning", "quiz-card--danger");
    }
    return;
  }

  if (stepId === "assessment") {
    const remainingMs = Math.max(0, state.currentQuestionDeadlineAt - Date.now());
    const totalMs = getQuizTimeLimitMs(stepId);
    const percent = totalMs ? (remainingMs / totalMs) * 100 : 100;

    timerValue.textContent = formatMsAsClock(remainingMs);
    timerBarFill.style.width = `${percent}%`;

    timerBarFill.classList.remove("quiz-timer__bar-fill--warning", "quiz-timer__bar-fill--danger");
    if (quizCard) {
      quizCard.classList.remove("quiz-card--warning", "quiz-card--danger");
    }

    if (percent <= 33) {
      timerBarFill.classList.add("quiz-timer__bar-fill--danger");
      if (quizCard) quizCard.classList.add("quiz-card--danger");
    } else if (percent <= 66) {
      timerBarFill.classList.add("quiz-timer__bar-fill--warning");
      if (quizCard) quizCard.classList.add("quiz-card--warning");
    }
  }
}

nextStepBtn.addEventListener("click", goToNextStep);
prevStepBtn.addEventListener("click", goToPrevStep);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../Pages/login.html";
    return;
  }

  currentLessonId = getLessonIdFromUrl();
  loadLessonMeta();

  try {
    await loadUserLessonState(user.uid);

    setSessionScore(getSessionScore());
    setActiveStep(lessonState.currentStep);
    applyStepAccess();
  } catch (error) {
    console.error("Lesson load error:", error);
  }
});

window.addEventListener("pagehide", () => {
  resetIncompleteQuizzes();
});

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function buildShuffledQuizQuestions(questions) {
  const shuffledQuestions = shuffleArray(questions).map((question, questionIndex) => {
    const choicesWithMeta = (question.choices || []).map((choiceText, choiceIndex) => ({
      text: choiceText,
      isCorrect: choiceIndex === question.correctIndex
    }));

    const shuffledChoices = shuffleArray(choicesWithMeta);

    return {
      ...question,
      shuffledQuestionIndex: questionIndex,
      choices: shuffledChoices.map((choice) => choice.text),
      correctIndex: shuffledChoices.findIndex((choice) => choice.isCorrect)
    };
  });

  return shuffledQuestions;
}

function getRandomPraise() {
  return PRAISE_LINES[Math.floor(Math.random() * PRAISE_LINES.length)];
}

function showPraisePopup(text) {
  const popup = document.createElement("div");
  popup.className = "quiz-praise-popup";
  popup.textContent = text;

  document.body.appendChild(popup);

  requestAnimationFrame(() => {
    popup.classList.add("show");
  });

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 350);
  }, 1500);
}

function getResultsPageUrl() {
  return `../Pages/result.html?id=${encodeURIComponent(currentLessonId)}`;
}

function createFreshQuizState(stepId) {
  return createDefaultQuizState(stepId);
}

function resetQuizState(stepId) {
  if (!quizSteps.includes(stepId)) return;

  lessonQuizState[stepId] = createFreshQuizState(stepId);
}

function resetIncompleteQuizzes() {
  let changed = false;

  quizSteps.forEach((stepId) => {
    const state = lessonQuizState[stepId];
    if (state?.started && !state?.completed) {
      lessonQuizState[stepId] = createFreshQuizState(stepId);
      changed = true;
    }
  });

  return changed;
}

async function persistResetIncompleteQuizzes() {
  const changed = resetIncompleteQuizzes();
  if (!changed) return;

  stopQuizTimer();
  await saveLessonState();
}

function renderAssessmentBadge(badgeKey, totalPoints = 0) {
  const badge = BADGE_META[badgeKey];
  if (!badge) return "";

  return `
    <div class="quiz-badge ${badge.className}">
      <span class="quiz-badge__label">${badge.label}</span>
      <span class="quiz-badge__points">${totalPoints} pts</span>
    </div>
  `;
}

function recalculateLessonTotalPoints() {
  lessonResultState.totalPoints =
    (lessonResultState.motivation.points || 0) +
    (lessonResultState.diagnostic.points || 0) +
    (lessonResultState.content.points || 0) +
    (lessonResultState.video.points || 0) +
    (lessonResultState.lab.points || 0) +
    ((lessonResultState.assessment.points || 0) + (lessonResultState.assessment.bonusPoints || 0));
}

async function awardFlatStepPointsOnce(stepId, points) {
  if (!lessonResultState[stepId] || lessonResultState[stepId].awarded) return;

  lessonResultState[stepId].awarded = true;
  lessonResultState[stepId].points = points;

  addToSessionScore(points);
  recalculateLessonTotalPoints();
  await saveLessonState();
}

async function awardLabPointsOnce() {
  if (lessonResultState.lab.awarded) return;

  const state = getQuizState("lab");
  const totalPoints = calculateLabTotalPoints(state?.answers || []);

  lessonResultState.lab.awarded = true;
  lessonResultState.lab.points = totalPoints;

  addToSessionScore(totalPoints);
  recalculateLessonTotalPoints();
  await saveLessonState();
}

async function awardAssessmentPointsOnce() {
  if (lessonResultState.assessment.awarded) return;

  const state = getQuizState("assessment");
  const answers = state?.answers || [];
  const totalQuestions = state?.totalQuestions || answers.length || 0;
  const correctCount = state?.correctCount || 0;

  const basePoints = calculateAssessmentTotalPoints(answers);
  const bonusPoints = calculateAssessmentBonus(correctCount, totalQuestions);
  const percent = totalQuestions ? (correctCount / totalQuestions) * 100 : 0;
  const totalPoints = basePoints + bonusPoints;
  const badge = getAssessmentBadge(basePoints);

  lessonResultState.assessment.awarded = true;
  lessonResultState.assessment.points = basePoints;
  lessonResultState.assessment.bonusPoints = bonusPoints;
  lessonResultState.assessment.badge = badge;
  lessonResultState.assessment.percent = percent;
  lessonResultState.assessment.correctCount = correctCount;
  lessonResultState.assessment.totalQuestions = totalQuestions;

  addToSessionScore(totalPoints);
  recalculateLessonTotalPoints();
  await saveLessonState();
}

function getAssessmentBadge(totalPoints) {
  if (totalPoints <= 20) return "spark";
  if (totalPoints <= 40) return "charge";
  if (totalPoints <= 60) return "ignition";
  return "burst";
}

const LESSON_PART_POINTS = {
  motivation: 5,
  diagnostic: 10,
  content: 15,
  video: 10
};

function createDefaultLessonResultState() {
  return {
    motivation: { awarded: false, points: 0 },
    diagnostic: { awarded: false, points: 0 },
    content: { awarded: false, points: 0 },
    video: {
      awarded: false,
      points: 0,
      watchedVideoIds: [],
      completedVideoIds: []
    },
    lab: { awarded: false, points: 0 },
    assessment: {
      awarded: false,
      points: 0,
      bonusPoints: 0,
      badge: null,
      percent: 0,
      correctCount: 0,
      totalQuestions: 0
    },
    totalPoints: 0,
    completed: false,
    completedAt: null
  };
}

function calculateLabQuestionPoints(answer) {
  if (!answer?.isCorrect) return 0;

  const elapsedSeconds = (answer.elapsedMs || 0) / 1000;

  if (elapsedSeconds <= 10) return 6;
  if (elapsedSeconds <= 30) return 5;
  return 4;
}

function calculateAssessmentQuestionPoints(answer) {
  if (!answer?.isCorrect) return 0;

  const elapsedSeconds = (answer.elapsedMs || 0) / 1000;

  if (elapsedSeconds <= 30) return 10;
  if (elapsedSeconds <= 60) return 8;
  return 6;
}

function calculateLabTotalPoints(answers = []) {
  return answers.reduce((sum, answer) => sum + calculateLabQuestionPoints(answer), 0);
}

function calculateAssessmentTotalPoints(answers = []) {
  return answers.reduce((sum, answer) => sum + calculateAssessmentQuestionPoints(answer), 0);
}

function calculateAssessmentBonus(correctCount, totalQuestions) {
  if (!totalQuestions) return 0;

  const percent = (correctCount / totalQuestions) * 100;

  if (percent === 100) return 15;
  if (percent >= 80) return 10;
  return 0;
}

async function finalizeLessonRun() {
  const user = auth.currentUser;
  if (!user) return;

  lessonResultState.completed = true;
  lessonResultState.completedAt = new Date().toISOString();
  recalculateLessonTotalPoints();

  const existingCompletedLessons = Array.isArray(currentUserData?.progress?.completedLessons)
    ? currentUserData.progress.completedLessons
    : [];

  const completedLessons = existingCompletedLessons.includes(currentLessonId)
    ? existingCompletedLessons
    : [...existingCompletedLessons, currentLessonId];

  await updateUserData(user.uid, {
    [`progress.lessonState.${currentLessonId}`]: lessonState,
    [`progress.lessonQuizState.${currentLessonId}`]: lessonQuizState,
    [`progress.lessonResults.${currentLessonId}`]: lessonResultState,
    [`progress.completedLessons`]: completedLessons
  });

  currentUserData = {
    ...currentUserData,
    progress: {
      ...(currentUserData?.progress || {}),
      completedLessons
    }
  };
}