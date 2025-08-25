// assets/register.js - Registration Form Handler
class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.strengthBar = document.getElementById('password-strength');
        this.feedbackText = document.getElementById('password-feedback');
        this.passwordMatch = document.getElementById('password-match');
        this.accountTypeRadios = document.querySelectorAll('input[name="accountType"]');
        this.industryField = document.getElementById('industry-field');

        this.init();
    }

    init() {
        if (!this.form) return; // Exit if not on register page

        this.setupPasswordValidation();
        this.setupAccountTypeToggle();
        this.setupFormSubmission();
        this.setupAutoFocus();
        this.setupPhoneValidation();
        this.setupRealTimeValidation();
    }

    // Password Strength Validation
    setupPasswordValidation() {
        if (!this.passwordInput) return;

        this.passwordInput.addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
            this.checkPasswordMatch();
        });

        if (this.confirmPasswordInput) {
            this.confirmPasswordInput.addEventListener('input', () => {
                this.checkPasswordMatch();
            });
        }
    }

    checkPasswordStrength(password) {
        if (!this.strengthBar || !this.feedbackText) return;

        let strength = 0;
        let feedback = '';
        let colorClass = '';

        // Strength criteria
        if (password.length >= 8) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;

        // Determine feedback and color
        if (strength === 0) {
            feedback = 'أدخل كلمة مرور';
            colorClass = 'bg-muted';
        } else if (strength < 40) {
            feedback = 'ضعيفة جداً 😟';
            colorClass = 'bg-destructive';
        } else if (strength < 60) {
            feedback = 'ضعيفة ⚠️';
            colorClass = 'bg-warning';
        } else if (strength < 80) {
            feedback = 'متوسطة 👍';
            colorClass = 'bg-primary';
        } else {
            feedback = 'قوية ممتازة! 🔒';
            colorClass = 'bg-success';
        }

        // Update UI
        this.strengthBar.style.width = strength + '%';
        this.strengthBar.className = `h-full rounded-full transition-all duration-300 ${colorClass}`;
        this.feedbackText.textContent = feedback;
    }

    checkPasswordMatch() {
        if (!this.passwordInput || !this.confirmPasswordInput || !this.passwordMatch) return;

        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        if (confirmPassword && password === confirmPassword) {
            this.passwordMatch.classList.remove('hidden');
            this.confirmPasswordInput.classList.remove('border-destructive');
            this.confirmPasswordInput.classList.add('border-success');
        } else if (confirmPassword) {
            this.passwordMatch.classList.add('hidden');
            this.confirmPasswordInput.classList.add('border-destructive');
            this.confirmPasswordInput.classList.remove('border-success');
        } else {
            this.passwordMatch.classList.add('hidden');
            this.confirmPasswordInput.classList.remove('border-destructive', 'border-success');
        }
    }

    // Account Type Toggle (Show/Hide Industry Field)
    setupAccountTypeToggle() {
        if (!this.accountTypeRadios.length) return;

        this.accountTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const industryField = this.industryField;
                const industrySelect = document.getElementById('industry');

                if (!industryField || !industrySelect) return;

                if (e.target.value === 'business' || e.target.value === 'enterprise') {
                    industryField.classList.remove('hidden');
                    industrySelect.required = true;
                } else {
                    industryField.classList.add('hidden');
                    industrySelect.required = false;
                    industrySelect.value = ''; // Clear selection
                }
            });
        });
    }

    // Phone Number Validation
    setupPhoneValidation() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            // Allow only numbers and common phone chars
            let value = e.target.value.replace(/[^\d\-\+\(\)\s]/g, '');

            // Format as user types (simple formatting)
            if (value.length > 3 && value.length <= 6) {
                value = value.replace(/(\d{3})(\d+)/, '$1-$2');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
            }

            e.target.value = value;
        });

        phoneInput.addEventListener('blur', (e) => {
            this.validatePhoneNumber(e.target);
        });
    }

    validatePhoneNumber(input) {
        const phone = input.value.replace(/\D/g, ''); // Remove non-digits
        const errorElement = document.querySelector('#phone + .text-destructive') ||
            document.querySelector('[data-error="phone"]');

        // Remove existing error
        if (errorElement) {
            errorElement.remove();
        }

        if (phone && phone.length < 8) {
            this.showFieldError(input, 'رقم الهاتف قصير جداً');
        } else if (phone && phone.length > 15) {
            this.showFieldError(input, 'رقم الهاتف طويل جداً');
        } else {
            this.clearFieldError(input);
        }
    }

    // Real-time Email Validation
    setupRealTimeValidation() {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', (e) => {
                this.validateEmail(e.target);
            });
        }

        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');

        [firstNameInput, lastNameInput].forEach(input => {
            if (input) {
                input.addEventListener('blur', (e) => {
                    this.validateRequired(e.target);
                });
            }
        });
    }

    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            this.showFieldError(input, 'البريد الإلكتروني غير صحيح');
        } else {
            this.clearFieldError(input);
        }
    }

    validateRequired(input) {
        const value = input.value.trim();
        const fieldName = input.getAttribute('placeholder') || 'هذا الحقل';

        if (input.hasAttribute('required') && !value) {
            this.showFieldError(input, `${fieldName} مطلوب`);
        } else {
            this.clearFieldError(input);
        }
    }

    showFieldError(input, message) {
        this.clearFieldError(input); // Remove existing error

        const errorElement = document.createElement('p');
        errorElement.className = 'text-xs text-destructive flex items-center gap-1 mt-1';
        errorElement.innerHTML = `<i class="bi bi-exclamation-circle"></i>${message}`;
        errorElement.setAttribute('data-error', input.id || 'field');

        input.classList.add('border-destructive');
        input.parentNode.parentNode.appendChild(errorElement);
    }

    clearFieldError(input) {
        const errorElement = input.parentNode.parentNode.querySelector(`[data-error="${input.id}"]`);
        if (errorElement) {
            errorElement.remove();
        }
        input.classList.remove('border-destructive');
        input.classList.add('border-success');
    }

    // Form Submission Handler
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });
    }

    handleFormSubmission(e) {
        e.preventDefault(); // Prevent default for demo

        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (!submitBtn || submitBtn.disabled) return;

        // Show loading state
        this.setLoadingState(submitBtn, true);

        // Validate form
        const isValid = this.validateForm();

        if (!isValid) {
            this.setLoadingState(submitBtn, false);
            this.showToast('يرجى تصحيح الأخطاء أولاً', 'error');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.setLoadingState(submitBtn, false);
            this.showSuccessMessage();
        }, 2000);
    }

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'هذا الحقل مطلوب');
                isValid = false;
            }
        });

        // Check password match
        if (this.passwordInput && this.confirmPasswordInput) {
            if (this.passwordInput.value !== this.confirmPasswordInput.value) {
                this.showFieldError(this.confirmPasswordInput, 'كلمات المرور غير متطابقة');
                isValid = false;
            }
        }

        // Check terms agreement
        const termsCheckbox = this.form.querySelector('input[name="agreeToTerms"]');
        if (termsCheckbox && !termsCheckbox.checked) {
            this.showToast('يجب الموافقة على الشروط والأحكام', 'error');
            isValid = false;
        }

        return isValid;
    }

    setLoadingState(button, loading) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="bi bi-arrow-repeat animate-spin me-2"></i>جاري إنشاء الحساب...';
        } else {
            button.disabled = false;
            button.innerHTML = '<i class="bi bi-person-plus me-2"></i>إنشاء الحساب';
        }
    }

    showSuccessMessage() {
        // Hide form
        this.form.style.display = 'none';

        // Show success message
        const successHTML = `
            <div class="text-center space-y-4">
                <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <i class="bi bi-check-circle-fill text-success text-4xl"></i>
                </div>
                <div>
                    <h3 class="text-2xl font-bold text-success">تم إنشاء الحساب بنجاح! 🎉</h3>
                    <p class="text-muted-foreground mt-2">تحقق من بريدك الإلكتروني لتفعيل الحساب</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="/login" class="kt-btn kt-btn-primary">
                        <i class="bi bi-box-arrow-in-right me-2"></i>
                        تسجيل الدخول
                    </a>
                    <button onclick="location.reload()" class="kt-btn kt-btn-outline">
                        <i class="bi bi-arrow-repeat me-2"></i>
                        تسجيل حساب آخر
                    </button>
                </div>
            </div>
        `;

        const container = this.form.parentNode;
        container.innerHTML = successHTML;
    }

    showToast(message, type = 'info') {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = `fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300 ${
            type === 'error' ? 'bg-destructive' :
                type === 'success' ? 'bg-success' :
                    'bg-primary'
        }`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Auto-focus first input
    setupAutoFocus() {
        const firstInput = this.form.querySelector('input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])');
        if (firstInput) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
                firstInput.focus();
            }, 100);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new RegistrationForm();
});

// Utility Functions
window.RegisterUtils = {
    // Generate strong password suggestion
    generatePassword: function() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Fill password fields
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        if (passwordInput && confirmPasswordInput) {
            passwordInput.value = password;
            confirmPasswordInput.value = password;
            passwordInput.dispatchEvent(new Event('input'));
        }

        return password;
    },

    // Clear form
    resetForm: function() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.reset();
            // Clear all error states
            form.querySelectorAll('.border-destructive, .border-success').forEach(input => {
                input.classList.remove('border-destructive', 'border-success');
            });
            form.querySelectorAll('[data-error]').forEach(error => {
                error.remove();
            });
        }
    }
};