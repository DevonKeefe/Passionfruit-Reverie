import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-XADmXMbj0w5nrgZS7Ok4-Ggr7Ua2JRQ",
  authDomain: "passionfruit-reverie.firebaseapp.com",
  projectId: "passionfruit-reverie",
  storageBucket: "passionfruit-reverie.firebasestorage.app",
  messagingSenderId: "233025313326",
  appId: "1:233025313326:web:68b988d9c962c5b7ce1dbf",
  measurementId: "G-K13CXGFK0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
