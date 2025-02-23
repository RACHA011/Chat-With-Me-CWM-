// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: 'AIzaSyBVsjpYhsSqmrx4sDVb90nqSHPBz8kKDdg',
  authDomain: 'chatwithme-033.firebaseapp.com',
  databaseURL: 'https://chatwithme-033-default-rtdb.firebaseio.com',
  projectId: 'chatwithme-033',
  storageBucket: 'chatwithme-033.firebasestorage.app',
  messagingSenderId: '961730881303',
  appId: '1:961730881303:web:a1d820247e3aa62558f952',
  measurementId: 'G-J6KXVK11WH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth;

// const db = getDatabase();
const db = getFirestore(app);
const database = getDatabase(app);
export { auth, db, database };

