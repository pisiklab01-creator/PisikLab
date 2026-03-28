import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getUserData, getAllUsers, updateUserData } from "../Game System/user-service.js";
import { getCurrentBadge, applyLoginBonus } from "../Game System/points-system.js";
import {
  updateProfile,
  updatePassword,
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const DEV_MODE = false;
const DEV_FORCE_LOGIN_BONUS_TOAST = false;

// ===== DOM REFERENCES =====
const dashboardGreeting = document.getElementById("dashboardGreeting");
const pointsValue = document.getElementById("pointsValue");
const currentBadgeIcon = document.getElementById("currentBadgeIcon");
const currentBadgeValue = document.getElementById("currentBadgeValue");
const leaderboardBody = document.getElementById("leaderboardBody");
const findMyRankBtn = document.getElementById("findMyRankBtn");
const continueLearningBtn = document.getElementById("continueLearningBtn");

const bonusToast = document.getElementById("bonusToast");
const bonusToastMessage = document.getElementById("bonusToastMessage");
const testBonusToastBtn = document.getElementById("testBonusToastBtn");

const navButtons = document.querySelectorAll(".nav-btn");
const dashboardNav = document.getElementById("dashboardNav");
const dashboardMenuToggle = document.getElementById("dashboardMenuToggle");

const mainVideoPlayer = document.getElementById("mainVideoPlayer");
const mainVideoTitle = document.getElementById("mainVideoTitle");
const mainVideoLesson = document.getElementById("mainVideoLesson");
const mainVideoDescription = document.getElementById("mainVideoDescription");
const videoLockedState = document.getElementById("videoLockedState");

const lessonButtons = document.querySelectorAll(".lesson-card__button");

const profileDisplayName = document.getElementById("profileDisplayName");
const profileNewEmail = document.getElementById("profileNewEmail");
const profileCurrentPasswordForEmail = document.getElementById("profileCurrentPasswordForEmail");
const saveEmailBtn = document.getElementById("saveEmailBtn");

const profileCurrentPasswordForPassword = document.getElementById("profileCurrentPasswordForPassword");
const profileNewPassword = document.getElementById("profileNewPassword");
const savePasswordBtn = document.getElementById("savePasswordBtn");

const saveDisplayNameBtn = document.getElementById("saveDisplayNameBtn");
const resetScoresBtn = document.getElementById("resetScoresBtn");
const logoutBtn = document.getElementById("logoutBtn");

const DASHBOARD_PANEL_KEY = "pisiklab_active_dashboard_panel";

const attemptLesson1Btn = document.getElementById("attemptLesson1Btn");
const attemptLesson2Btn = document.getElementById("attemptLesson2Btn");
const attemptsTableBody = document.getElementById("attemptsTableBody");

let selectedAttemptLessonId = "lesson1";
let cachedUserData = null;

// ===== DEV HELPERS =====
function shouldShowDevBonusToast() {
  if (!DEV_MODE || !DEV_FORCE_LOGIN_BONUS_TOAST) return false;

  const key = "dev_login_bonus_toast_shown";
  const alreadyShown = sessionStorage.getItem(key) === "true";

  if (alreadyShown) return false;

  sessionStorage.setItem(key, "true");
  return true;
}

// ===== PANEL SWITCHING =====
function showPanel(panelId) {
  const panels = document.querySelectorAll(".dashboard-panel");

  panels.forEach((panel) => {
    panel.classList.remove("active-panel");
    panel.classList.add("hidden-panel");
  });

  navButtons.forEach((button) => {
    button.classList.remove("active");
  });

  const targetPanel = document.getElementById(panelId);
  const activeButton = document.querySelector(`.nav-btn[data-panel="${panelId}"]`);

  if (targetPanel) {
    targetPanel.classList.remove("hidden-panel");
    targetPanel.classList.add("active-panel");

    sessionStorage.setItem(DASHBOARD_PANEL_KEY, panelId);
  }

  if (activeButton) {
    activeButton.classList.add("active");
  }

  if (dashboardNav) {
    dashboardNav.classList.remove("menu-open");
  }
}

restoreSavedPanel();

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showPanel(button.dataset.panel);
  });
});

if (dashboardMenuToggle && dashboardNav) {
  dashboardMenuToggle.addEventListener("click", () => {
    dashboardNav.classList.toggle("menu-open");
  });
}

attemptLesson1Btn?.addEventListener("click", () => {
  setActiveAttemptLesson("lesson1");
});

attemptLesson2Btn?.addEventListener("click", () => {
  setActiveAttemptLesson("lesson2");
});

// ===== GREETING =====
function adjustGreetingSize(name) {
  if (!dashboardGreeting) return;

  const length = name.length;
  let fontSize = "64px";

  if (length <= 8) fontSize = "64px";
  else if (length <= 12) fontSize = "56px";
  else if (length <= 18) fontSize = "48px";
  else if (length <= 24) fontSize = "40px";
  else fontSize = "34px";

  dashboardGreeting.style.fontSize = fontSize;
}

// ===== BONUS TOAST =====
function showBonusToast(message) {
  if (!bonusToast || !bonusToastMessage) return;

  bonusToastMessage.textContent = message;
  bonusToast.classList.add("show");

  clearTimeout(showBonusToast.hideTimer);
  showBonusToast.hideTimer = setTimeout(() => {
    bonusToast.classList.remove("show");
  }, 3000);
}

if (DEV_MODE && testBonusToastBtn) {
  testBonusToastBtn.addEventListener("click", () => {
    showBonusToast("You received: +2 Daily Sign-In Bonus");
  });
} else if (testBonusToastBtn) {
  testBonusToastBtn.style.display = "none";
}

// ===== LEADERBOARD =====
function renderLeaderboardRows(users, currentUserId) {
  if (!leaderboardBody) return;

  if (!users.length) {
    leaderboardBody.innerHTML = `<div class="leaderboard-empty">No leaderboard data yet.</div>`;
    return;
  }

  leaderboardBody.innerHTML = users.map((user) => {
    const isCurrentUser = user.uid === currentUserId;
    const badgeIcon = getBadgeIconPath(user.badge);

    return `
      <div class="leaderboard-row ${isCurrentUser ? "leaderboard-row--me" : ""}" data-uid="${user.uid}">
        <div class="leaderboard-rank">#${user.rank}</div>
        <div class="leaderboard-name">${user.displayName}</div>

        <div class="leaderboard-badge leaderboard-badge--icon-only">
          <img src="${badgeIcon}" alt="${user.badge}" title="${user.badge}" class="leaderboard-badge__icon">
        </div>

        <div class="leaderboard-points">${user.energy}</div>
      </div>
    `;
  }).join("");
}

function scrollToCurrentUser(uid) {
  const row = document.querySelector(`.leaderboard-row[data-uid="${uid}"]`);
  if (!row) return;

  row.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  row.classList.add("leaderboard-row--highlight");

  setTimeout(() => {
    row.classList.remove("leaderboard-row--highlight");
  }, 2500);
}

async function loadLeaderboard(currentUserId) {
  const allUsers = await getAllUsers();

  const users = allUsers
    .filter((user) => user.admin !== true && user.isVisibleInLeaderboard !== false)
    .map((user) => ({
      uid: user.uid,
      displayName: user.displayName || "Student",
      energy: user.energy || 0,
      badge: getCurrentBadge(user.energy || 0)
    }))
    .sort((a, b) => b.energy - a.energy)
    .map((user, index) => ({
      ...user,
      rank: index + 1
    }));

  renderLeaderboardRows(users, currentUserId);

  if (findMyRankBtn) {
    findMyRankBtn.onclick = () => {
      scrollToCurrentUser(currentUserId);
    };
  }
}

function splitVideoDataList(value) {
  if (!value) return [];
  return value
    .split("||")
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderVideoDescriptionBlock({ objectives = [], materials = [], procedure = [] } = {}) {
  const safeObjectives = objectives.length
    ? objectives
    : ["No objectives available yet."];

  const safeMaterials = materials.length
    ? materials
    : ["No materials listed yet."];

  const safeProcedure = procedure.length
    ? procedure
    : ["No procedure available yet."];

  return `
    <div class="video-player-card__section">
      <h4 class="video-player-card__section-title">Objectives</h4>
      <ul class="video-player-card__list">
        ${safeObjectives.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>

    <div class="video-player-card__section">
      <h4 class="video-player-card__section-title">Materials</h4>
      <ul class="video-player-card__list">
        ${safeMaterials.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>

    <div class="video-player-card__section">
      <h4 class="video-player-card__section-title">Procedure</h4>
      <ol class="video-player-card__list video-player-card__list--ordered">
        ${safeProcedure.map((item) => `<li>${item}</li>`).join("")}
      </ol>
    </div>
  `;
}

// ===== VIDEO SYSTEM =====
function showLockedVideoState() {
  if (mainVideoPlayer) {
    mainVideoPlayer.setAttribute("src", "");
  }

  if (videoLockedState) {
    videoLockedState.classList.add("show");
  }

  if (mainVideoTitle) {
    mainVideoTitle.textContent = "No Video Available Yet";
  }

  if (mainVideoLesson) {
    mainVideoLesson.textContent = "Locked";
  }

  if (mainVideoDescription) {
    mainVideoDescription.innerHTML = renderVideoDescriptionBlock({
      objectives: ["Complete a lesson to unlock video demonstrations."],
      materials: ["Available after unlocking the selected video."],
      procedure: [
        "Complete the required lesson first.",
        "Select an unlocked video from the playlist.",
        "Review the experiment details while watching."
      ]
    });
  }
}

function showPlayableVideoState() {
  if (videoLockedState) {
    videoLockedState.classList.remove("show");
  }
}

function unlockVideoItem(item) {
  item.disabled = false;
  item.classList.remove("locked");

  const thumb = item.querySelector(".video-item__thumb");
  if (thumb) {
    thumb.textContent = "▶";
  }
}

function lockVideoItem(item) {
  item.disabled = true;
  item.classList.add("locked");
  item.classList.remove("active");

  const thumb = item.querySelector(".video-item__thumb");
  if (thumb) {
    thumb.textContent = "🔒";
  }
}

function applyVideoAccess(userData) {
  const videoItems = document.querySelectorAll(".video-item");
  const isAdmin = userData.admin === true;
  const completedLessons = userData.progress?.completedLessons || [];

  videoItems.forEach((item) => lockVideoItem(item));

  if (isAdmin) {
    videoItems.forEach((item) => unlockVideoItem(item));
    return;
  }

  const lessonToVideosMap = {
    lesson1: ["eggTray", "candleSpoon"],
    lesson2: ["grainMixing", "barakoGatas"]
  };

  completedLessons.forEach((lessonId) => {
    const allowedVideoIds = lessonToVideosMap[lessonId] || [];

    allowedVideoIds.forEach((videoId) => {
      const item = document.querySelector(`.video-item[data-video-id="${videoId}"]`);
      if (item) {
        unlockVideoItem(item);
      }
    });
  });
}

function setupVideoPlaylist() {
  const videoItems = document.querySelectorAll(".video-item");

  videoItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.disabled) return;

      videoItems.forEach((button) => button.classList.remove("active"));
      item.classList.add("active");

      const embed = item.dataset.videoEmbed;
      const title = item.dataset.videoTitle;
      const lesson = item.dataset.videoLesson;
      const objectives = splitVideoDataList(item.dataset.videoObjectives);
      const materials = splitVideoDataList(item.dataset.videoMaterials);
      const procedure = splitVideoDataList(item.dataset.videoProcedure);

      showPlayableVideoState();

      if (mainVideoPlayer) {
  mainVideoPlayer.setAttribute("src", embed);
}

      if (mainVideoTitle) mainVideoTitle.textContent = title;
      if (mainVideoLesson) mainVideoLesson.textContent = lesson;
      if (mainVideoDescription) {
  mainVideoDescription.innerHTML = renderVideoDescriptionBlock({
    objectives,
    materials,
    procedure
  });
}
    });
  });
}

function loadFirstAvailableVideo() {
  const firstUnlocked = document.querySelector(".video-item:not(.locked)");

  if (!firstUnlocked) {
    showLockedVideoState();
    return;
  }

  firstUnlocked.click();
}

setupVideoPlaylist();

function openLesson(lessonId) {
  if (!lessonId) return;
  window.location.href = `../Pages/lesson.html?id=${lessonId}`;
}

// ===== AUTH + DASHBOARD LOAD =====
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("../Pages/login.html");
    return;
  }

  if (!user.emailVerified) {
    window.location.replace("../Pages/login.html");
    return;
  }

  try {
    const loginBonusResult = await applyLoginBonus(user.uid);

    if (loginBonusResult?.applied) {
      showBonusToast(`You received: +${loginBonusResult.amount} ${loginBonusResult.label}`);
    } else if (shouldShowDevBonusToast()) {
      showBonusToast("You received: +2 Daily Sign-In Bonus");
    }

    const data = await getUserData(user.uid);
    cachedUserData = data;

    if (!data) {
      window.location.replace("../Pages/login.html");
      return;
    }

    const fullName = data.displayName || "Student";

    if (dashboardGreeting) {
      dashboardGreeting.textContent = `Hello, ${fullName}!`;
      adjustGreetingSize(fullName);
    }

    if (pointsValue) {
      pointsValue.textContent = data.energy ?? 0;
    }

const resolvedMainBadge = getCurrentBadge(data.energy || 0);

if (currentBadgeIcon) {
  currentBadgeIcon.src = getBadgeIconPath(resolvedMainBadge);
  currentBadgeIcon.alt = resolvedMainBadge || "No Badge Yet";
}

if (currentBadgeValue) {
  currentBadgeValue.textContent = resolvedMainBadge || "No Badge Yet";
}

applyVideoAccess(data);
loadFirstAvailableVideo();
updateLessonProgressCards(data);

await loadLeaderboard(user.uid);

setActiveAttemptLesson(selectedAttemptLessonId);

    if (continueLearningBtn) {
      continueLearningBtn.onclick = () => {
        showPanel("lessonPanel");
      };
    }
  } catch (error) {
    console.error("Dashboard load error:", error);
  }
});

function getDefaultResetData() {
  return {
    energy: 0,
    level: 1,
    rank: "SPARK",

    "pointsBreakdown.lessons": 0,
    "pointsBreakdown.diagnostics": 0,
    "pointsBreakdown.videos": 0,
    "pointsBreakdown.labDiscussion": 0,
    "pointsBreakdown.assessment": 0,
    "pointsBreakdown.bonuses": 0,

    "progress.lessonsCompleted": 0,
    "progress.videosWatched": 0,
    "progress.currentLessonId": null,
    "progress.completedLessons": [],
    "progress.completedVideos": [],
    "progress.lessonState": {},
    "progress.lessonQuizState": {},
    "progress.lessonResults": {},

    assessments: {},
    labDiscussion: {},
    lessonHistory: [],

    "bonuses.consecutiveLessons": 0,
    "bonuses.totalBonusPoints": 0,

    "badges.unlocked": [],
    "badges.current": null,

    "stats.totalTimeSpent": 0,
    "stats.averageAnswerTime": 0,
    "stats.correctAnswers": 0,
    "stats.wrongAnswers": 0
  };
}

async function reauthenticateCurrentUser(currentPassword) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user.");

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
}

if (saveDisplayNameBtn) {
  saveDisplayNameBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    const newName = profileDisplayName?.value.trim();

    if (!user || !newName) return;

    try {
      await updateProfile(user, { displayName: newName });
      await updateUserData(user.uid, { displayName: newName });

      if (dashboardGreeting) {
        dashboardGreeting.textContent = `Hello, ${newName}!`;
        adjustGreetingSize(newName);
      }

      showBonusToast("Display name updated successfully.");
    } catch (error) {
      console.error("Display name update failed:", error);
      alert("Could not update display name.");
    }
  });
}

if (saveEmailBtn) {
  saveEmailBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    const newEmail = profileNewEmail?.value.trim();
    const currentPassword = profileCurrentPasswordForEmail?.value.trim();

    if (!user || !newEmail || !currentPassword) return;

    try {
      await reauthenticateCurrentUser(currentPassword);
      await verifyBeforeUpdateEmail(user, newEmail);
      showBonusToast("Verification email sent to your new address.");
    } catch (error) {
      console.error("Email update failed:", error);
      alert("Could not update email. Please check your current password and try again.");
    }
  });
}

if (savePasswordBtn) {
  savePasswordBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    const currentPassword = profileCurrentPasswordForPassword?.value.trim();
    const newPassword = profileNewPassword?.value.trim();

    if (!user || !currentPassword || !newPassword) return;

    try {
      await reauthenticateCurrentUser(currentPassword);
      await updatePassword(user, newPassword);
      showBonusToast("Password updated successfully.");
    } catch (error) {
      console.error("Password update failed:", error);
      alert("Could not update password. Please check your current password and try again.");
    }
  });
}

if (resetScoresBtn) {
  resetScoresBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    const confirmed = window.confirm(
      "Are you sure you want to reset your scores, badges, and progress? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      await updateUserData(user.uid, getDefaultResetData());

      clearLessonSessionStorage();

if (pointsValue) pointsValue.textContent = "0";

if (currentBadgeValue) {
  currentBadgeValue.textContent = "No Badge Yet";
}

if (currentBadgeIcon) {
  currentBadgeIcon.src = getBadgeIconPath("No Badge Yet");
  currentBadgeIcon.alt = "No Badge Yet";
}

cachedUserData = {
  ...(cachedUserData || {}),
  energy: 0,
  badges: {
    current: null,
    unlocked: []
  },
  assessments: {},
  labDiscussion: {},
  lessonHistory: [],
  progress: {
    completedLessons: [],
    completedVideos: [],
    lessonState: {},
    lessonQuizState: {},
    lessonResults: {}
  }
};

updateLessonProgressCards(cachedUserData);
renderAttemptsTable(cachedUserData, selectedAttemptLessonId);

showBonusToast("Your scores and progress have been reset.");
await loadLeaderboard(user.uid);
    } catch (error) {
      console.error("Reset failed:", error);
      alert("Could not reset scores.");
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.replace("../Pages/login.html");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  });
}

function restoreSavedPanel() {
  const savedPanel = sessionStorage.getItem(DASHBOARD_PANEL_KEY);

  if (savedPanel && document.getElementById(savedPanel)) {
    showPanel(savedPanel);
  } else {
    showPanel("homePanel");
  }
}

lessonButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lessonId = button.dataset.lessonId;
    openLesson(lessonId);
  });
});

function getBadgeIconPath(badgeName) {
  switch (badgeName) {
    case "Spark Starter":
      return "../Assets/Badges/spark-starter.svg";
    case "A-Lab Explorer":
      return "../Assets/Badges/a-lab-explorer.svg";
    case "Heat Seeker":
      return "../Assets/Badges/heat-seeker.svg";
    case "Blaze Runner":
      return "../Assets/Badges/blaze-runner.svg";
    case "Fire Master":
      return "../Assets/Badges/fire-master.svg";
    case "PISIKLAB Legend":
      return "../Assets/Badges/pisiklab-legend.svg";
    default:
      return "../Assets/Badges/no-badge.svg";
  }
}

function getAssessmentBadgeIconPath(badgeKey) {
  switch (badgeKey) {
    case "spark":
      return "../Assets/Badges/spark.svg";
    case "charge":
      return "../Assets/Badges/charge.svg";
    case "ignition":
      return "../Assets/Badges/ignition.svg";
    case "burst":
      return "../Assets/Badges/burst.svg";
    default:
      return "../Assets/Badges/no-badge.svg";
  }
}

function getAssessmentBadgeLabel(badgeKey) {
  switch (badgeKey) {
    case "spark":
      return "Spark Badge";
    case "charge":
      return "Charge Badge";
    case "ignition":
      return "Ignition Badge";
    case "burst":
      return "Burst Badge";
    default:
      return "No Badge";
  }
}

function formatAttemptDate(dateValue) {
  if (!dateValue) return "—";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getLessonAttempts(userData, lessonId) {
  const assessments = userData?.assessments || {};
  const lessonRecord = assessments?.[lessonId];

  if (!lessonRecord) return [];

  // Supports one-record-per-lesson now, and array later if you expand it.
  if (Array.isArray(lessonRecord)) {
    return lessonRecord;
  }

  return [lessonRecord];
}

function renderAttemptsTable(userData, lessonId) {
  if (!attemptsTableBody) return;

  const attempts = getLessonAttempts(userData, lessonId);

  if (!attempts.length) {
    attemptsTableBody.innerHTML = `
      <tr>
        <td colspan="3" class="attempts-table__empty">No attempts yet.</td>
      </tr>
    `;
    return;
  }

  const sortedAttempts = [...attempts].sort((a, b) => {
    const aTime = new Date(a?.date || 0).getTime();
    const bTime = new Date(b?.date || 0).getTime();
    return bTime - aTime;
  });

  attemptsTableBody.innerHTML = sortedAttempts.map((attempt) => {
    const badgeKey = attempt?.badge || null;
    const badgeLabel = getAssessmentBadgeLabel(badgeKey);
    const badgeIcon = getAssessmentBadgeIconPath(badgeKey);
    const scoreValue =
      typeof attempt?.percent === "number"
        ? `${Math.round(attempt.percent)}%`
        : `${attempt?.correctCount ?? 0}/${attempt?.totalQuestions ?? 0}`;

    return `
      <tr>
        <td>${formatAttemptDate(attempt?.date)}</td>
        <td>${scoreValue}</td>
        <td>
          <span class="attempts-badge-chip">
            <img
              src="${badgeIcon}"
              alt="${badgeLabel}"
              class="attempts-badge-chip__icon"
            >
            <span>${badgeLabel}</span>
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

function setActiveAttemptLesson(lessonId) {
  selectedAttemptLessonId = lessonId;

  attemptLesson1Btn?.classList.toggle("active", lessonId === "lesson1");
  attemptLesson2Btn?.classList.toggle("active", lessonId === "lesson2");

  if (cachedUserData) {
    renderAttemptsTable(cachedUserData, selectedAttemptLessonId);
  }
}

function getStepDisplayLabel(stepId) {
  switch (stepId) {
    case "motivation":
      return "Motivation";
    case "diagnostic":
      return "Diagnostic Test";
    case "content":
      return "Lesson";
    case "video":
      return "Video Demonstration";
    case "lab":
      return "Lab Discussion";
    case "assessment":
      return "Assessment";
    default:
      return "Motivation";
  }
}

function updateLessonProgressCards(userData) {
  const lessonIds = ["lesson1", "lesson2"];

  lessonIds.forEach((lessonId) => {
    const progressEl = document.getElementById(`${lessonId}ProgressText`);
    const buttonEl = document.querySelector(`.lesson-card__button[data-lesson-id="${lessonId}"]`);

    if (!progressEl || !buttonEl) return;

    const lessonState = userData?.progress?.lessonState?.[lessonId];
    const completedLessons = Array.isArray(userData?.progress?.completedLessons)
      ? userData.progress.completedLessons
      : [];

    if (completedLessons.includes(lessonId)) {
      progressEl.textContent = "Completed";
      buttonEl.textContent = "Start Again";
      return;
    }

    if (lessonState?.currentStep) {
      const label = getStepDisplayLabel(lessonState.currentStep);
      progressEl.textContent = `Continue from: ${label}`;
      buttonEl.textContent = "Continue Activity";
      return;
    }

    progressEl.textContent = "Not started yet";
    buttonEl.textContent = "Start Activity";
  });
}

const LESSON_SESSION_SCORE_KEY = "pisiklab_lesson_session_score";
const LESSON_CURRENT_STEP_KEY = "pisiklab_lesson_current_step";

function clearLessonSessionStorage() {
  ["lesson1", "lesson2"].forEach((lessonId) => {
    sessionStorage.removeItem(`${LESSON_SESSION_SCORE_KEY}_${lessonId}`);
    sessionStorage.removeItem(`${LESSON_CURRENT_STEP_KEY}_${lessonId}`);
  });
}