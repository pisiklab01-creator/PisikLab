import { getUserData, updateUserData } from "./user-service.js";

function getUnlockedBadges(energy) {
  const badges = [];

  if (energy >= 150) badges.push("Spark Starter");
  if (energy >= 250) badges.push("A-Lab Explorer");
  if (energy >= 350) badges.push("Heat Seeker");
  if (energy >= 450) badges.push("Blaze Runner");
  if (energy >= 550) badges.push("Fire Master");
  if (energy >= 700) badges.push("PISIKLAB Legend");

  return badges;
}

export function getCurrentBadge(energy) {
  if (energy >= 700) return "PISIKLAB Legend";
  if (energy >= 550) return "Fire Master";
  if (energy >= 450) return "Blaze Runner";
  if (energy >= 350) return "Heat Seeker";
  if (energy >= 250) return "A-Lab Explorer";
  if (energy >= 150) return "Spark Starter";
  return "No Badge Yet";
}

async function updateBadges(uid, energy) {
  await updateUserData(uid, {
    "badges.unlocked": getUnlockedBadges(energy),
    "badges.current": getCurrentBadge(energy)
  });
}

function getToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const year = parts.find(part => part.type === "year").value;
  const month = parts.find(part => part.type === "month").value;
  const day = parts.find(part => part.type === "day").value;

  return `${year}-${month}-${day}`;
}

export async function awardPoints(uid, category, amount) {
  const user = await getUserData(uid);
  if (!user) return;

  const currentCategory = user.pointsBreakdown?.[category] || 0;
  const newEnergy = (user.energy || 0) + amount;

  await updateUserData(uid, {
    energy: newEnergy,
    [`pointsBreakdown.${category}`]: currentCategory + amount
  });

  await updateBadges(uid, newEnergy);
}

export async function applyLoginBonus(uid) {
  const user = await getUserData(uid);
  if (!user) {
    return { applied: false, amount: 0, label: "Daily Sign-In Bonus" };
  }

  const today = getToday();

  if (user.bonuses.lastLoginDate === today) {
    return { applied: false, amount: 0, label: "Daily Sign-In Bonus" };
  }

  const newEnergy = (user.energy || 0) + 2;
  const newBonusPoints = (user.pointsBreakdown?.bonuses || 0) + 2;
  const newTotalBonusPoints = (user.bonuses?.totalBonusPoints || 0) + 2;

  await updateUserData(uid, {
    energy: newEnergy,
    "pointsBreakdown.bonuses": newBonusPoints,
    "bonuses.lastLoginDate": today,
    "bonuses.totalBonusPoints": newTotalBonusPoints,
    lastLogin: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Manila" }).replace(" ", "T")
  });

  await updateBadges(uid, newEnergy);

  return {
    applied: true,
    amount: 2,
    label: "Daily Sign-In Bonus"
  };
}

export async function applyLessonCompletion(uid) {
  const user = await getUserData(uid);
  if (!user) return;

  const count = (user.bonuses?.consecutiveLessons || 0) + 1;
  const updates = {
    "bonuses.consecutiveLessons": count
  };

  let newEnergy = user.energy || 0;

  if (count === 2) {
    newEnergy += 20;
    updates.energy = newEnergy;
    updates["pointsBreakdown.bonuses"] = (user.pointsBreakdown?.bonuses || 0) + 20;
    updates["bonuses.totalBonusPoints"] = (user.bonuses?.totalBonusPoints || 0) + 20;
    updates["bonuses.consecutiveLessons"] = 0;
  }

  await updateUserData(uid, updates);

  if (count === 2) {
    await updateBadges(uid, newEnergy);
  }
}

export async function applyAssessmentBonus(uid, percentage) {
  if (percentage === 100) {
    await awardPoints(uid, "bonuses", 15);
  } else if (percentage >= 80) {
    await awardPoints(uid, "bonuses", 10);
  }
}