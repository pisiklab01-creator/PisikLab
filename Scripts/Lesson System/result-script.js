import { auth } from "../firebase-config.js";
import { LESSONS } from "./lesson-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getUserData, updateUserData } from "../Game System/user-service.js";
import { getCurrentBadge } from "../Game System/points-system.js";

const resultsLessonTitle = document.getElementById("resultsLessonTitle");
const resultsBreakdown = document.getElementById("resultsBreakdown");
const resultsBonuses = document.getElementById("resultsBonuses");
const resultsFinalTotal = document.getElementById("resultsFinalTotal");
const claimResultsBtn = document.getElementById("claimResultsBtn");

const resultsBadgeIcon = document.getElementById("resultsBadgeIcon");
const resultsBadgeLabel = document.getElementById("resultsBadgeLabel");
const resultsBadgeDesc = document.getElementById("resultsBadgeDesc");

const BADGE_UI = {
  spark: {
    label: "Spark Badge",
    description: "A solid start. Your energy is building.",
    icon: "../Assets/Badges/spark.svg"
  },
  charge: {
    label: "Charge Badge",
    description: "Strong momentum. You are picking up power.",
    icon: "../Assets/Badges/charge.svg"
  },
  ignition: {
    label: "Ignition Badge",
    description: "You are heating up. Great assessment performance.",
    icon: "../Assets/Badges/ignition.svg"
  },
  burst: {
    label: "Burst Badge",
    description: "Maximum impact. Outstanding assessment run.",
    icon: "../Assets/Badges/burst.svg"
  }
};

let currentLessonId = "lesson1";
let currentUserData = null;
let currentLessonResult = null;

const LESSON_SESSION_SCORE_KEY = "pisiklab_lesson_session_score";

function getSessionScoreKey(lessonId) {
  return `${LESSON_SESSION_SCORE_KEY}_${lessonId}`;
}

function clearLessonSessionScore(lessonId) {
  sessionStorage.removeItem(getSessionScoreKey(lessonId));
}

function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "lesson1";
}

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

function createDefaultLessonState() {
  return {
    currentStep: "motivation",
    completedSteps: []
  };
}

function createDefaultQuizState() {
  return {
    diagnostic: null,
    lab: null,
    assessment: null
  };
}

function getSafePointsBreakdown(data) {
  return {
    lessons: Number(data?.pointsBreakdown?.lessons || 0),
    diagnostics: Number(data?.pointsBreakdown?.diagnostics || 0),
    videos: Number(data?.pointsBreakdown?.videos || 0),
    labDiscussion: Number(data?.pointsBreakdown?.labDiscussion || 0),
    assessment: Number(data?.pointsBreakdown?.assessment || 0),
    bonuses: Number(data?.pointsBreakdown?.bonuses || 0)
  };
}

function getSafeBonuses(data) {
  return {
    consecutiveLessons: Number(data?.bonuses?.consecutiveLessons || 0),
    totalBonusPoints: Number(data?.bonuses?.totalBonusPoints || 0),
    lastLoginDate: data?.bonuses?.lastLoginDate || null,
    loginStreak: Number(data?.bonuses?.loginStreak || 0)
  };
}

function getSafeProgress(data) {
  return {
    completedLessons: Array.isArray(data?.progress?.completedLessons)
      ? data.progress.completedLessons
      : [],
    completedVideos: Array.isArray(data?.progress?.completedVideos)
      ? data.progress.completedVideos
      : [],
    currentLessonId: data?.progress?.currentLessonId || null,
    lessonsCompleted: Number(data?.progress?.lessonsCompleted || 0),
    videosWatched: Number(data?.progress?.videosWatched || 0)
  };
}

function getSafeUnlockedBadges(data) {
  if (Array.isArray(data?.badges?.unlocked)) {
    return [...data.badges.unlocked];
  }

  if (data?.badges?.unlocked && typeof data.badges.unlocked === "object") {
    return Object.keys(data.badges.unlocked).filter((key) => data.badges.unlocked[key]);
  }

  return [];
}

function getAssessmentDisplayPoints(resultState) {
  return Number(resultState?.assessment?.points || 0) +
    Number(resultState?.assessment?.bonusPoints || 0);
}

function renderBreakdown(resultState) {
  const items = [
    { label: "Motivation", value: resultState?.motivation?.points || 0 },
    { label: "Diagnostic Test", value: resultState?.diagnostic?.points || 0 },
    { label: "Lesson Content", value: resultState?.content?.points || 0 },
    { label: "Video Demonstration", value: resultState?.video?.points || 0 },
    { label: "Lab Discussion", value: resultState?.lab?.points || 0 },
    { label: "Assessment", value: getAssessmentDisplayPoints(resultState) }
  ];

  resultsBreakdown.innerHTML = items.map((item) => `
    <article class="results-score-card">
      <p class="results-score-card__label">${item.label}</p>
      <h3 class="results-score-card__value">${item.value}</h3>
    </article>
  `).join("");
}

function renderBadge(resultState) {
  const badgeKey = resultState?.assessment?.badge;
  const badgeData = BADGE_UI[badgeKey];

  if (!badgeData) {
    resultsBadgeIcon.style.display = "none";
    resultsBadgeLabel.textContent = "No Badge";
    resultsBadgeDesc.textContent = "Complete the assessment to earn a badge.";
    return;
  }

  resultsBadgeIcon.style.display = "block";
  resultsBadgeIcon.src = badgeData.icon;
  resultsBadgeIcon.alt = badgeData.label;
  resultsBadgeLabel.textContent = badgeData.label;
  resultsBadgeDesc.textContent = badgeData.description;
}

function getConsecutiveLessonsSameDateBonus(userData, lessonIdToClaim) {
  const today = getTodayDateString();
  const history = Array.isArray(userData?.lessonHistory) ? userData.lessonHistory : [];

  const hasLesson1Today = history.some(
    (entry) => entry.lessonId === "lesson1" && entry.date === today
  ) || lessonIdToClaim === "lesson1";

  const hasLesson2Today = history.some(
    (entry) => entry.lessonId === "lesson2" && entry.date === today
  ) || lessonIdToClaim === "lesson2";

  return hasLesson1Today && hasLesson2Today ? 20 : 0;
}

function buildBonuses(resultState, userData, lessonIdToClaim) {
  const assessment = resultState?.assessment || {};
  const percent = Number(assessment.percent || 0);

  const consecutiveLessonsBonus = getConsecutiveLessonsSameDateBonus(userData, lessonIdToClaim);
  const perfectBonus = percent === 100 ? 15 : 0;
  const highScoreBonus = percent >= 80 && percent < 100 ? 10 : 0;

  return [
    {
      key: "consecutiveLessons",
      label: "Completed Lesson 1 and Lesson 2 on the same date",
      points: consecutiveLessonsBonus
    },
    {
      key: "perfectAssessment",
      label: "Perfect Score in Assessment",
      points: perfectBonus
    },
    {
      key: "highScoreAssessment",
      label: "High Score Bonus (80–99%)",
      points: highScoreBonus
    }
  ];
}

function renderBonuses(bonuses) {
  resultsBonuses.innerHTML = bonuses.map((bonus) => `
    <article class="results-bonus-item ${bonus.points > 0 ? "results-bonus-item--active" : ""}">
      <p class="results-bonus-item__text">${bonus.label}</p>
      <strong class="results-bonus-item__value">+${bonus.points}</strong>
    </article>
  `).join("");
}

function computeFinalRunTotal(resultState, bonuses) {
  const base = Number(resultState?.totalPoints || 0);
  const bonusTotal = bonuses.reduce((sum, bonus) => sum + Number(bonus.points || 0), 0);
  return base + bonusTotal;
}

function getNewRankLabel(newEnergyTotal) {
  return getCurrentBadge(newEnergyTotal || 0);
}

function getAssessmentRecord(resultState, finalRunTotal, date) {
  const assessment = resultState?.assessment || {};

  return {
    lessonId: currentLessonId,
    date,
    points: Number(assessment.points || 0),
    bonusPoints: Number(assessment.bonusPoints || 0),
    totalPoints: Number(assessment.points || 0) + Number(assessment.bonusPoints || 0),
    percent: Number(assessment.percent || 0),
    correctCount: Number(assessment.correctCount || 0),
    totalQuestions: Number(assessment.totalQuestions || 0),
    badge: assessment.badge || null,
    lessonRunTotal: finalRunTotal
  };
}

function getLabDiscussionRecord(resultState, date) {
  return {
    lessonId: currentLessonId,
    date,
    points: Number(resultState?.lab?.points || 0)
  };
}

function dedupeCompletedLessons(list, lessonId) {
  const safe = Array.isArray(list) ? [...list] : [];
  return safe.includes(lessonId) ? safe : [...safe, lessonId];
}

async function claimLessonResults() {
  const user = auth.currentUser;
  if (!user || !currentLessonResult) return;

  claimResultsBtn.disabled = true;
  claimResultsBtn.textContent = "Saving...";

  try {
    const today = getTodayDateString();
    const bonuses = buildBonuses(currentLessonResult, currentUserData, currentLessonId);
    const totalBonusPoints = bonuses.reduce((sum, bonus) => sum + Number(bonus.points || 0), 0);
    const finalRunTotal = computeFinalRunTotal(currentLessonResult, bonuses);

    const existingEnergy = Number(currentUserData?.energy || 0);
    const updatedEnergy = existingEnergy + finalRunTotal;

    const pointsBreakdown = getSafePointsBreakdown(currentUserData);
    const bonusState = getSafeBonuses(currentUserData);
    const progressState = getSafeProgress(currentUserData);
    const unlockedBadges = getSafeUnlockedBadges(currentUserData);

const assessmentBadgeKey = currentLessonResult?.assessment?.badge || null;
const assessmentBadgeLabel = assessmentBadgeKey
  ? (BADGE_UI[assessmentBadgeKey]?.label || null)
  : null;

const mainBadgeLabel = getCurrentBadge(updatedEnergy || 0);
const rankLabel = mainBadgeLabel;

    const updatedCompletedLessons = dedupeCompletedLessons(
      progressState.completedLessons,
      currentLessonId
    );

    const existingLessonHistory = Array.isArray(currentUserData?.lessonHistory)
      ? [...currentUserData.lessonHistory]
      : [];

    const lessonHistoryEntry = {
      lessonId: currentLessonId,
      date: today,
      totalPoints: finalRunTotal,
      basePoints: Number(currentLessonResult?.totalPoints || 0),
      bonusPoints: totalBonusPoints,
      motivationPoints: Number(currentLessonResult?.motivation?.points || 0),
      diagnosticPoints: Number(currentLessonResult?.diagnostic?.points || 0),
      contentPoints: Number(currentLessonResult?.content?.points || 0),
      videoPoints: Number(currentLessonResult?.video?.points || 0),
      labPoints: Number(currentLessonResult?.lab?.points || 0),
      assessmentPoints: getAssessmentDisplayPoints(currentLessonResult),
      assessmentBadge: assessmentBadgeKey
    };

    const updatedLessonHistory = [...existingLessonHistory, lessonHistoryEntry];

    const existingAssessments = currentUserData?.assessments && typeof currentUserData.assessments === "object"
      ? currentUserData.assessments
      : {};

    const existingLabDiscussion = currentUserData?.labDiscussion && typeof currentUserData.labDiscussion === "object"
      ? currentUserData.labDiscussion
      : {};

    const newAssessmentRecord = getAssessmentRecord(currentLessonResult, finalRunTotal, today);
    const newLabRecord = getLabDiscussionRecord(currentLessonResult, today);

    const updatedAssessments = {
      ...existingAssessments,
      [currentLessonId]: newAssessmentRecord
    };

    const updatedLabDiscussion = {
      ...existingLabDiscussion,
      [currentLessonId]: newLabRecord
    };

const updatedUnlockedBadges = mainBadgeLabel && !unlockedBadges.includes(mainBadgeLabel)
  ? [...unlockedBadges, mainBadgeLabel]
  : unlockedBadges;

    const consecutiveLessonsBonusValue = Number(bonuses.find((b) => b.key === "consecutiveLessons")?.points || 0);

await updateUserData(user.uid, {
  energy: updatedEnergy,
  rank: rankLabel,

  "pointsBreakdown.lessons":
    pointsBreakdown.lessons +
    Number(currentLessonResult?.motivation?.points || 0) +
    Number(currentLessonResult?.content?.points || 0),

  "pointsBreakdown.diagnostics":
    pointsBreakdown.diagnostics +
    Number(currentLessonResult?.diagnostic?.points || 0),

  "pointsBreakdown.videos":
    pointsBreakdown.videos +
    Number(currentLessonResult?.video?.points || 0),

  "pointsBreakdown.labDiscussion":
    pointsBreakdown.labDiscussion +
    Number(currentLessonResult?.lab?.points || 0),

  "pointsBreakdown.assessment":
    pointsBreakdown.assessment +
    Number(currentLessonResult?.assessment?.points || 0),

  "pointsBreakdown.bonuses":
    pointsBreakdown.bonuses + totalBonusPoints,

  "bonuses.consecutiveLessons":
    bonusState.consecutiveLessons + (consecutiveLessonsBonusValue > 0 ? 1 : 0),

  "bonuses.totalBonusPoints":
    bonusState.totalBonusPoints + totalBonusPoints,

  assessments: updatedAssessments,
  labDiscussion: updatedLabDiscussion,

  "badges.current": mainBadgeLabel,
  "badges.unlocked": updatedUnlockedBadges,

  "progress.completedLessons": updatedCompletedLessons,
  "progress.lessonsCompleted": updatedCompletedLessons.length,
  "progress.currentLessonId": null,

  [`progress.lessonState.${currentLessonId}`]: createDefaultLessonState(),
  [`progress.lessonQuizState.${currentLessonId}`]: createDefaultQuizState(),
  [`progress.lessonResults.${currentLessonId}`]: createDefaultLessonResultState()
});

clearLessonSessionScore(currentLessonId);
window.location.href = "../Pages/dashboard.html";
  } catch (error) {
    console.error("Failed to claim lesson results:", error);
    claimResultsBtn.disabled = false;
    claimResultsBtn.textContent = "Claim Points & Finish";
    alert("Could not save your lesson results. Please try again.");
  }
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../Pages/login.html";
    return;
  }

  currentLessonId = getLessonIdFromUrl();
  currentUserData = await getUserData(user.uid);

  const lessonData = LESSONS[currentLessonId] || LESSONS.lesson1;
  currentLessonResult =
    currentUserData?.progress?.lessonResults?.[currentLessonId] || null;

  if (!currentLessonResult) {
    window.location.href = `../Pages/lesson.html?id=${encodeURIComponent(currentLessonId)}`;
    return;
  }

  resultsLessonTitle.textContent = lessonData.title;

  renderBreakdown(currentLessonResult);
  renderBadge(currentLessonResult);

  const bonuses = buildBonuses(currentLessonResult, currentUserData, currentLessonId);
  renderBonuses(bonuses);

  const finalRunTotal = computeFinalRunTotal(currentLessonResult, bonuses);
  resultsFinalTotal.textContent = finalRunTotal;

  claimResultsBtn.addEventListener("click", claimLessonResults);
});