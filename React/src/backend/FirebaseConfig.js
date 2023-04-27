// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAwrHxtLgqz-HReH3kWASiQG-rqoHUgSW0",
    authDomain: "slaythespirestats.firebaseapp.com",
    projectId: "slaythespirestats",
    storageBucket: "slaythespirestats.appspot.com",
    messagingSenderId: "57361793860",
    appId: "1:57361793860:web:870df54a1d34ef147f8d11",
    measurementId: "G-6YMRXW8297"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
