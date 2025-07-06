// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3bnLyVXbZWyAUe8gfEoKseDRWjfEYHBA",
  authDomain: "pexesousers.firebaseapp.com",
  projectId: "pexesousers",
  storageBucket: "pexesousers.firebasestorage.app",
  messagingSenderId: "1000059706799",
  appId: "1:1000059706799:web:59f3d7ad9b18917163a35a",
  measurementId: "G-KB4KHDC2V6"
};

// Initialize Firebase
const appUsers = initializeApp(firebaseConfig);
export const auth = getAuth(appUsers);
export const projectUsers = getFirestore(appUsers);
// const analytics = getAnalytics(appUsers);