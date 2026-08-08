// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "cortexai-b5dce.firebaseapp.com",
    projectId: "cortexai-b5dce",
    storageBucket: "cortexai-b5dce.firebasestorage.app",
    messagingSenderId: "113014316095",
    appId: "1:113014316095:web:6580ba243932dd4203ec8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()