import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDd--tE0mkYK68I9TzVsaSBOYA3_Gnf4TY",
  authDomain: "pexeso-project-en.firebaseapp.com",
  projectId: "pexeso-project-en",
  storageBucket: "pexeso-project-en.firebasestorage.app",
  messagingSenderId: "460497809986",
  appId: "1:460497809986:web:7d07bee0344ea8e3b7f3db",
};

const app = initializeApp(firebaseConfig);

const projectFirestore = getFirestore(app);

export { projectFirestore };
