// ==============================================
//  Firebase Configuration & Initialization
//  هذا الملف مسؤول عن تهيئة الاتصال بـ Firebase
// ==============================================

const firebaseConfig = {
    apiKey: "ضع_المفتاح_هنا",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// تصدير خدمة المصادقة للاستخدام في ملفات أخرى
const auth = firebase.auth();
const db = firebase.firestore();

// ضبط اللغة العربية لرسائل Firebase
auth.languageCode = 'ar';
console.log("✅ Firebase initialized successfully");
