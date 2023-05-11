// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';

import { getFunctions, httpsCallable } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBKiyjOGVZc_nrnE05pyF83eKz8ly0SBRg',
  authDomain: 'authorbookproject.firebaseapp.com',
  projectId: 'authorbookproject',
  storageBucket: 'authorbookproject.appspot.com',
  messagingSenderId: '188911220447',
  appId: '1:188911220447:web:55a134db50ab1853735b6a',
  measurementId: 'G-FXEN0951DB',
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
export const functions = getFunctions(app);
