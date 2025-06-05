import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAeC2YCGHsox-E-CXq1QnRCKsQXjyX9WA",
  authDomain: "pexeso-project.firebaseapp.com",
  projectId: "pexeso-project",
  storageBucket: "pexeso-project.appspot.com",
  messagingSenderId: "965793257998",
  appId: "1:965793257998:web:b2405a3c5d2cf93c4bba5f",
};

const app = initializeApp(firebaseConfig);

const projectFirestore = getFirestore(app);

export { projectFirestore };
