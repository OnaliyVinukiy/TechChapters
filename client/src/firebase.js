// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzGZjohQaxi6N0e4nHQmxAgL40bxUto30",
  authDomain: "techchapters-a381e.firebaseapp.com",
  databaseURL: "https://techchapters-a381e-default-rtdb.firebaseio.com",
  projectId: "techchapters-a381e",
  storageBucket: "techchapters-a381e.appspot.com",
  messagingSenderId: "350355077376",
  appId: "1:350355077376:web:53059c1623aeeff2a65be5",
  measurementId: "G-ENHLKCGHGW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
export const googleProvider = new GoogleAuthProvider();
