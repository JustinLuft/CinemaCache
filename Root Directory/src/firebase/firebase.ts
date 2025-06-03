import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLA-nkenhshvASX3uqzsIpgdlXema8T34",
  authDomain: "cinemacache-bf806.firebaseapp.com",
  projectId: "cinemacache-bf806",
  storageBucket: "cinemacache-bf806.appspot.com",
  messagingSenderId: "888040410090",
  appId: "1:888040410090:web:bf754ae27809dc9b400093",
  measurementId: "G-0QL6Q4KQD6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db, analytics };
