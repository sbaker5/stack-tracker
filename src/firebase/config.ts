// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration from the Firebase console
// Replace this with your actual configuration from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDFnYCx9vogKeUwmL-QoKrZnVz--o14SmM",
  authDomain: "stack-tracker.firebaseapp.com",
  projectId: "stack-tracker",
  storageBucket: "stack-tracker.firebasestorage.app",
  messagingSenderId: "677178514230",
  appId: "1:677178514230:web:7f8439f894014b87e27197"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
