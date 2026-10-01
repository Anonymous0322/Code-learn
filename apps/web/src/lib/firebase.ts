import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC7uXrMtgJDzvyRXiOdtum5Mlf0VfNHbeY",
  authDomain: "futureprogrammers-812b6.firebaseapp.com",
  databaseURL: "https://futureprogrammers-812b6-default-rtdb.firebaseio.com",
  projectId: "futureprogrammers-812b6",
  storageBucket: "futureprogrammers-812b6.firebasestorage.app",
  messagingSenderId: "195336876180",
  appId: "1:195336876180:web:6ac5631c544e224e9d0481",
  measurementId: "G-HTLQP9BCD8"
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
