import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  Timestamp,
} from 'firebase/firestore/lite';

import { db, auth } from './Initialize';
export const LogOut = () => {
  signOut(auth)
    .then(() => {
      console.log('logged out Sucess!');

      // Sign-out successful.
    })
    .catch((error) => {
      console.log('logged out');
      // An error happened.
    });
};
export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new Error('No user is currently signed in.'));
      }
    });
  });
};
export let user = null;
export const CreateAuthor = async (email, password, name, birth, bio) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredential) => {
        user = userCredential.user;
        console.log(user);
        await setDoc(doc(db, 'users', user.uid), {
          email: email,
          password: password,
          name: name,
          birth: Timestamp.fromDate(birth),
          bio: bio,
        }).then((msg) => {
          // console.log('Document written with ID: ', docRef.id);
        });
      }
    );
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};
export const LogIn = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      user = userCredential.user;
      resolve({ con: true, user });
    } catch (error) {
      const errorCode = error.code;

      if (
        errorCode === 'auth/invalid-email' ||
        errorCode === 'auth/user-disabled' ||
        errorCode === 'auth/user-not-found'
      ) {
        console.log('error in email');
        reject({
          con: false,
          errorType: 'email',
          errorMessage: error.message,
        });
      } else if (errorCode === 'auth/wrong-password') {
        console.log('error in pass');
        reject({
          con: false,
          errorType: 'password',
          errorMessage: error.message,
        });
      } else {
        console.log('error');
        reject({
          con: false,
          errorType: 'unknown',
          errorMessage: error.message,
        });
      }
    }
  });
};
