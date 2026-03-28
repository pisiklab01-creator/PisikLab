export function createDefaultUserProfile(user, displayName) {
  return {
    uid: user.uid,
    email: user.email,
    displayName: displayName,

    admin: false,
    isVisibleInLeaderboard: true,

    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),

    energy: 0,
    level: 1,
    rank: "SPARK",

    pointsBreakdown: {
      lessons: 0,
      diagnostics: 0,
      videos: 0,
      labDiscussion: 0,
      assessments: 0,
      bonuses: 0
    },

    progress: {
      lessonsCompleted: 0,
      videosWatched: 0,
      currentLessonId: null,
      completedLessons: [],
      completedVideos: []
    },

    assessments: {},
    labDiscussion: {},

    bonuses: {
      lastLoginDate: null,
      loginStreak: 0,
      consecutiveLessons: 0,
      totalBonusPoints: 0
    },

    badges: {
      unlocked: [],
      current: null
    },

    stats: {
      totalTimeSpent: 0,
      averageAnswerTime: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    }
  };
}