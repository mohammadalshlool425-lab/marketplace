// ==============================================
//  Authentication Module
//  نظام المصادقة - تسجيل دخول / خروج
// ==============================================

(function () {
    'use strict';

    // ============ DOM Elements ============
    const DOM = {
        // Login Form
        loginForm: document.getElementById('loginForm'),
        emailInput: document.getElementById('email'),
        passwordInput: document.getElementById('password'),
        loginBtn: document.getElementById('loginBtn'),
        togglePasswordBtn: document.getElementById('togglePassword'),
        rememberMe: document.getElementById('rememberMe'),
        googleLoginBtn: document.getElementById('googleLoginBtn'),

        // Error displays
        emailError: document.getElementById('emailError'),
        passwordError: document.getElementById('passwordError'),

        // Loading
        loadingSpinner: document.getElementById('loadingSpinner'),
        toastContainer: document.getElementById('toastContainer')
    };

    // ============ Validation Helpers ============
    const Validator = {
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email.trim());
        },
        isValidPassword(password) {
            return password.length >= 6;
        },
        showFieldError(inputEl, errorEl, message) {
            inputEl.classList.add('input-error');
            if (message) {
                errorEl.querySelector('.error-text').textContent = message;
            }
            errorEl.classList.add('visible');
        },
        clearFieldError(inputEl, errorEl) {
            inputEl.classList.remove('input-error');
            errorEl.classList.remove('visible');
        },
        validateLoginForm(email, password) {
            let isValid = true;
            if (!email || !this.isValidEmail(email)) {
                this.showFieldError(
                    DOM.emailInput,
                    DOM.emailError,
                    !email ? 'البريد الإلكتروني مطلوب' : 'صيغة البريد الإلكتروني غير صحيحة'
                );
                isValid = false;
            } else {
                this.clearFieldError(DOM.emailInput, DOM.emailError);
            }
            if (!password || !this.isValidPassword(password)) {
                this.showFieldError(
                    DOM.passwordInput,
                    DOM.passwordError,
                    !password ? 'كلمة المرور مطلوبة' : 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
                );
                isValid = false;
            } else {
                this.clearFieldError(DOM.passwordInput, DOM.passwordError);
            }
            return isValid;
        }
    };

    // ============ UI Helpers ============
    const UI = {
        setLoading(isLoading) {
            if (isLoading) {
                DOM.loadingSpinner.classList.add('active');
                DOM.loginBtn.disabled = true;
                DOM.loginBtn.innerHTML = '<div class="btn-spinner"></div><span>جارٍ تسجيل الدخول...</span>';
            } else {
                DOM.loadingSpinner.classList.remove('active');
                DOM.loginBtn.disabled = false;
                DOM.loginBtn.innerHTML = '<span class="btn-text">تسجيل الدخول</span>';
            }
        },
        showToast(type, message) {
            const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <span class="toast-icon">${icons[type]}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
            `;
            DOM.toastContainer.appendChild(toast);
            setTimeout(() => {
                toast.classList.add('removing');
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        }
    };

    function getArabicErrorMessage(errorCode) {
        const errors = {
            'auth/user-not-found': 'لا يوجد حساب مسجل بهذا البريد الإلكتروني',
            'auth/wrong-password': 'كلمة المرور غير صحيحة',
            'auth/invalid-email': 'صيغة البريد الإلكتروني غير صحيحة',
            'auth/user-disabled': 'تم تعطيل هذا الحساب. تواصل مع الدعم',
            'auth/too-many-requests': 'محاولات كثيرة. حاول مرة أخرى لاحقاً',
            'auth/invalid-credential': 'بيانات الدخول غير صحيحة. تحقق من البريد وكلمة المرور'
        };
        return errors[errorCode] || 'حدث خطأ غير متوقع. حاول مرة أخرى';
    }

    const AuthActions = {
        async loginWithEmail(email, password) {
            UI.setLoading(true);
            try {
                const persistence = DOM.rememberMe.checked
                    ? firebase.auth.Auth.Persistence.LOCAL
                    : firebase.auth.Auth.Persistence.SESSION;
                await auth.setPersistence(persistence);
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                UI.showToast('success', 'مرحباً بعودتك! 🎉');
                setTimeout(() => { window.location.href = '../index.html'; }, 1500);
            } catch (error) {
                UI.showToast('error', getArabicErrorMessage(error.code));
                UI.setLoading(false);
            }
        },
        async loginWithGoogle() {
            UI.setLoading(true);
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                provider.setCustomParameters({ prompt: 'select_account' });
                const result = await auth.signInWithPopup(provider);
                const user = result.user;
                if (result.additionalUserInfo?.isNewUser) {
                    await db.collection('users').doc(user.uid).set({
                        email: user.email,
                        provider: 'google',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                UI.showToast('success', `مرحباً ${user.displayName || ''}! 🎉`);
                setTimeout(() => { window.location.href = '../index.html'; }, 1500);
            } catch (error) {
                if (error.code !== 'auth/popup-closed-by-user') {
                    UI.showToast('error', getArabicErrorMessage(error.code));
                }
                UI.setLoading(false);
            }
        }
    };

    function initEventListeners() {
        if (DOM.loginForm) {
            DOM.loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const email = DOM.emailInput.value.trim();
                const password = DOM.passwordInput.value;
                if (!Validator.validateLoginForm(email, password)) return;
                AuthActions.loginWithEmail(email, password);
            });
        }
        if (DOM.togglePasswordBtn) {
            DOM.togglePasswordBtn.addEventListener('click', function () {
                const isPassword = DOM.passwordInput.type === 'password';
                DOM.passwordInput.type = isPassword ? 'text' : 'password';
                this.textContent = isPassword ? '🙈' : '👁️';
            });
        }
        if (DOM.googleLoginBtn) {
            DOM.googleLoginBtn.addEventListener('click', () => AuthActions.loginWithGoogle());
        }
    }

    function initAuthObserver() {
        auth.onAuthStateChanged(function (user) {
            if (user && window.location.pathname.includes('login.html')) {
                window.location.href = '../index.html';
            }
        });
    }

    function init() {
        initEventListeners();
        initAuthObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
