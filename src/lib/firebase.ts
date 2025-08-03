import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBa_hfqMT7heJ86_c8PFP96MuX8j3PGltw",
  authDomain: "dinakargiftfromindia.firebaseapp.com",
  projectId: "dinakargiftfromindia",
  storageBucket: "dinakargiftfromindia.firebasestorage.app",
  messagingSenderId: "464219684997",
  appId: "1:464219684997:web:62b8425edb06071a8ee9ec",
  measurementId: "G-23CXEBE9XX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app; 