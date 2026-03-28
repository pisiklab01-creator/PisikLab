import { db } from "../firebase-config.js";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function getUserData(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data();
}

export async function updateUserData(uid, updates) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, updates);
}

export async function setUserData(uid, data) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, data);
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, "users"));

  const users = [];
  snap.forEach((docSnap) => {
    users.push({
      uid: docSnap.id,
      ...docSnap.data()
    });
  });

  return users;
}