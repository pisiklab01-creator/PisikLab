import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBvYcS4_vXQDWyrmlhD3jSsWGZ2NtlbM0",
  authDomain: "pisiklab-e5ee7.firebaseapp.com",
  projectId: "pisiklab-e5ee7",
  storageBucket: "pisiklab-e5ee7.firebasestorage.app",
  messagingSenderId: "201432699799",
  appId: "1:201432699799:web:452f0aa3b8006cc371ead2",
  measurementId: "G-CNLVKPV1Z2"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };