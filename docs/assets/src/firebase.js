// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEb--p8n-yF1WoBCb5bUM-TercwCopi80",
  authDomain: "app-vetinos.firebaseapp.com",
  projectId: "app-vetinos",
  storageBucket: "app-vetinos.firebasestorage.app",
  messagingSenderId: "223855212975",
  appId: "1:223855212975:web:e851c6e81e1d64ba4a575a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };