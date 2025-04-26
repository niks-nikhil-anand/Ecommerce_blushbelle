// /lib/firebaseConfig.js

import { initializeApp } from "firebase/app";
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBYNoII1QNGAQTWpUB-E0y6pHvi49wR9ZA",
  authDomain: "cleanveda-51bdf.firebaseapp.com",
  projectId: "cleanveda-51bdf",
  storageBucket: "cleanveda-51bdf.firebasestorage.app",
  messagingSenderId: "730410261892",
  appId: "1:730410261892:web:775297a40c4fb7089f91d1",
  measurementId: "G-37Y8C7L0NJ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);


export { firebaseApp };