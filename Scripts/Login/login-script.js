import { auth, db } from "../firebase-config.js";
import { createDefaultUserProfile } from "./user-model.js";
import { applyLoginBonus } from "../Game System/points-system.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  reload,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const DEV_MODE = true;

// ==========================
// INTRO MODAL
// ==========================
const modal = document.getElementById("introModal");
const enterBtn = document.getElementById("enterBtn");

// ==========================
// HERO STATES
// ==========================
const heroWelcome = document.getElementById("heroWelcome");
const heroAuth = document.getElementById("heroAuth");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");

// ==========================
// AUTH PANEL / CARDS
// ==========================
const authContainer = document.getElementById("authContainer");
const loginCard = document.getElementById("loginCard");
const signupCard = document.getElementById("signupCard");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

// ==========================
// INPUTS
// ==========================
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");

// ==========================
// BUTTONS
// ==========================
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const checkAuthBtn = document.getElementById("checkAuthBtn");
const devAuthBtn = document.getElementById("devAuthBtn");

// ==========================
// VISIT STATE
// ==========================
let isReturningVisit = localStorage.getItem("visitedBefore") === "true";

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  if (user.emailVerified) {
    safeRedirect("../Pages/dashboard.html");
  } else {
    showAuthHero();
    startVerificationWatcher();
  }
});

// ==========================
// HELPERS
// ==========================
function fadeIn(el) {
  el.classList.remove("hidden");
  requestAnimationFrame(() => {
    el.classList.add("show");
  });
}

function fadeOut(el, callback) {
  el.classList.remove("show");
  setTimeout(() => {
    el.classList.add("hidden");
    if (callback) callback();
  }, 400);
}

function switchCards(fromEl, toEl) {
  fadeOut(fromEl, () => {
    toEl.classList.remove("hidden");
    requestAnimationFrame(() => {
      toEl.classList.add("show");
    });
  });
}

function showWelcomeHero() {
  heroAuth.classList.add("hidden");
  heroWelcome.classList.remove("hidden");
  authContainer.classList.remove("hidden");
}

function showAuthHero() {
  heroWelcome.classList.add("hidden");
  heroAuth.classList.remove("hidden");
  authContainer.classList.add("hidden");
}

function updateHeroText(title, subtitle) {
  welcomeTitle.classList.add("out");
  welcomeSubtitle.classList.add("out");

  setTimeout(() => {
    welcomeTitle.textContent = title;
    welcomeSubtitle.textContent = subtitle;

    welcomeTitle.classList.remove("out");
    welcomeSubtitle.classList.remove("out");
  }, 200);
}

function setHeroState(state) {
  showWelcomeHero();

  if (state === "first") {
    updateHeroText(
      "Welcome to PisikLab!",
      "Please log-in or make your account to begin."
    );
    return;
  }

  if (state === "returning") {
    updateHeroText(
      "Welcome back to PisikLab!",
      "Please log-in or make your account to begin."
    );
    return;
  }

  if (state === "signup") {
    updateHeroText(
      "Get Started with Your Account",
      'Fill in the necessary information and click "Register" once you\'re done.'
    );
  }
}

function updateLoginButtonState() {
  const filled =
    loginEmail.value.trim() !== "" &&
    loginPassword.value.trim() !== "";

  loginBtn.disabled = !filled;
}

function updateSignupButtonState() {
  const filled =
    signupName.value.trim() !== "" &&
    signupEmail.value.trim() !== "" &&
    signupPassword.value.trim() !== "";

  signupBtn.disabled = !filled;
}

// ==========================
// INTRO MODAL LOGIC
// ==========================
if (isReturningVisit && !DEV_MODE) {
  modal.style.display = "none";
  setHeroState("returning");
} else {
  setHeroState("first");
}

enterBtn.addEventListener("click", () => {
  modal.classList.add("hide");

  setTimeout(() => {
    modal.style.display = "none";
  }, 500);

  localStorage.setItem("visitedBefore", "true");
  isReturningVisit = true;
  setHeroState("returning");
});

// ==========================
// INPUT LISTENERS
// ==========================
const input = document.getElementById("signupName");

[loginEmail, loginPassword].forEach((input) => {
  input.addEventListener("input", updateLoginButtonState);
});

[signupName, signupEmail, signupPassword].forEach((input) => {
  input.addEventListener("input", updateSignupButtonState);
});

updateLoginButtonState();
updateSignupButtonState();

// ==========================
// LOGIN ↔ SIGNUP SWITCHING
// ==========================
showSignup.addEventListener("click", () => {
  setHeroState("signup");
  switchCards(loginCard, signupCard);
});

showLogin.addEventListener("click", () => {
  setHeroState(isReturningVisit && !DEV_MODE ? "returning" : "first");
  switchCards(signupCard, loginCard);
});

// ==========================
// SIGNUP
// ==========================
signupBtn.addEventListener("click", async () => {
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();

if (name.length < 2) {
  alert("Name must be at least 2 characters.");
  return;
}

if (name.length > 30) {
  alert("Name must not exceed 30 characters.");
  return;
}

  if (!name || !email || !password) return;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), createDefaultUserProfile(user, name));

    await sendEmailVerification(user);

    showAuthHero();
    startVerificationWatcher();
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered.");
    } else {
      alert(error.message);
    }
  }
});

// ==========================
// LOGIN
// ==========================
loginBtn.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) return;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      showAuthHero();
      startVerificationWatcher();
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(
      doc(db, "users", user.uid),
      createDefaultUserProfile(user, user.displayName || "User")
    );
  }

    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Login error:", error);
    alert("Invalid login credentials.");
  }
});

// ==========================
// EMAIL VERIFICATION WATCHER
// ==========================
let verificationInterval = null;

function startVerificationWatcher() {
  checkAuthBtn.disabled = true;

  if (verificationInterval) {
    clearInterval(verificationInterval);
  }

  verificationInterval = setInterval(async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await reload(user);

      if (user.emailVerified) {
        checkAuthBtn.disabled = false;
        clearInterval(verificationInterval);
        verificationInterval = null;
      }
    } catch (error) {
      console.error("Verification reload failed:", error);
    }
  }, 3000);
}

checkAuthBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await reload(user);

    if (user.emailVerified) {
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    console.error("Verification check failed:", error);
  }
});

// ==========================
// DEV SHORTCUT
// ==========================
if (DEV_MODE && devAuthBtn) {
  devAuthBtn.addEventListener("click", () => {
    showAuthHero();
  });
} else if (devAuthBtn) {
  devAuthBtn.style.display = "none";
}

function safeRedirect(url) {
  if (DEV_MODE) {
    console.log("[DEV MODE] Redirect blocked →", url);
    return;
  }

  window.location.replace(url);
}