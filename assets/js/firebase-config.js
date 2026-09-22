// ==============================================
//  Firebase Configuration & Initialization
//  هذا الملف مسؤول عن تهيئة الاتصال بـ Firebase
// ==============================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKgJr981P09i3hiMyRTDgL_67_Q1R671Q",
  authDomain: "marketplace-91934.firebaseapp.com",
  projectId: "marketplace-91934",
  storageBucket: "marketplace-91934.firebasestorage.app",
  messagingSenderId: "854394309158",
  appId: "1:854394309158:web:39a55b02bca8344c62b4e7",
  measurementId: "G-VRG75NEVE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// تصدير خدمة المصادقة للاستخدام في ملفات أخرى
const auth = firebase.auth();
const db = firebase.firestore();

// ضبط اللغة العربية لرسائل Firebase
auth.languageCode = 'ar';
console.log("✅ Firebase initialized successfully");
