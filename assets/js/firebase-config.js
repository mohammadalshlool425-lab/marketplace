// ==============================================
//  Firebase Configuration & Initialization
// ==============================================

// 1. استدعاء الأدوات الحديثة من روابط Firebase مباشرة
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 2. مفاتيح الربط الخاصة بمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyCKgJr981P09i3hiMyRTDgL_67_Q1R671Q",
  authDomain: "marketplace-91934.firebaseapp.com",
  projectId: "marketplace-91934",
  storageBucket: "marketplace-91934.firebasestorage.app",
  messagingSenderId: "854394309158",
  appId: "1:854394309158:web:39a55b02bca8344c62b4e7",
  measurementId: "G-VRG75NEVE2"
};

// 3. تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// 4. تصدير خدمات المصادقة وقاعدة البيانات لاستخدامها في باقي الملفات
export const auth = getAuth(app);
export const db = getFirestore(app);

// ضبط اللغة العربية
auth.languageCode = 'ar';
console.log("✅ Firebase initialized successfully");
