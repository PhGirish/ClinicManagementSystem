// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtQfpuyZf-pPl5MsAZNpWsc-vbfN97S5E",
  authDomain: "clinic-project-b93e3.firebaseapp.com",
  projectId: "clinic-project-b93e3",
  storageBucket: "clinic-project-b93e3.appspot.com",
  messagingSenderId: "155219618782",
  appId: "1:155219618782:web:ab8cd2a786b063c5298b4f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
