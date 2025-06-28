// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMi0qxk1gURZ2jTpfrIGv1U0ZGLJCsQOg",
  authDomain: "knights-pantry-43158.firebaseapp.com",
  projectId: "knights-pantry-43158",
  storageBucket: "knights-pantry-43158.firebasestorage.app",
  messagingSenderId: "673700538035",
  appId: "1:673700538035:web:aa5ab394d57bd8b0daf2c6",
  measurementId: "G-PPCYN5QG2D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
