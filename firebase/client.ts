// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCNlmV0fLP6yiw1Aqdmg7hztiDKeppJ3kc",
    authDomain: "prepwise-d84d3.firebaseapp.com",
    projectId: "prepwise-d84d3",
    storageBucket: "prepwise-d84d3.firebasestorage.app",
    messagingSenderId: "645645678453",
    appId: "1:645645678453:web:534a077fddfd3485db853c",
    measurementId: "G-MKFLL5B6Y9"
};

// Initialize Firebase    !getApps.length ?
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);