// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpNinJWJkcU2eAhViO9KPTfGvgY22O65k",
  authDomain: "conflix-567b2.firebaseapp.com",
  projectId: "conflix-567b2",
  storageBucket: "conflix-567b2.appspot.com",
  messagingSenderId: "116348017117",
  appId: "1:116348017117:web:fea73cd2abc3e103807e34",
  measurementId: "G-022GF5VRRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app)