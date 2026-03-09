# 🔐 Frontend Security Sync Guide

**Date:** 2026-03-09  
**Backend Version:** 2.0.0 (Security Hardened)  
**Priority:** HIGH - Required for Production

---

## 🚨 Breaking Changes

### **None!** All changes are backward compatible.

Frontend can continue using existing API calls. Security enhancements are transparent to frontend.

---

## 🔒 New Security Features

### **1. Password Policy Enforcement**

**What Changed:**
- Backend now validates password strength on registration
- Minimum requirements enforced

**Requirements:**
- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (@$!%*?&#)

**Frontend Action Required:**

Add password validation BEFORE sending to API:

```typescript
// apps/tenant/app/register/page.tsx (or wherever registration happens)

function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[@$!%*?&#]/.test(password)) {
    errors.push("Password must contain at least one special character (@$!%*?&#)");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Usage in form submit
const handleSubmit = async (data) => {
  const validation = validatePassword(data.password);
  
  if (!validation.valid) {
    // Show validation errors to user
    setErrors(validation.errors);
    return;
  }
  
  // Proceed with registration
  await api.register(data);
};
```

**Error Response:**
```json
{
  "detail": [
    {
      "type": "value_error",
      "msg": "Value error, Password must contain at least one uppercase letter",
      "loc": ["body", "password"]
    }
  ]
}
```

**UI Recommendation:**
```tsx
// Show password requirements as checklist
<div className="password-requirements">
  <h4>Password must contain:</h4>
  <ul>
    <li className={password.length >= 8 ? 'valid' : ''}>
      At least 8 characters
    </li>
    <li className={/[A-Z]/.test(password) ? 'valid' : ''}>
      One uppercase letter
    </li>
    <li className={/[a-z]/.test(password) ? 'valid' : ''}>
      One lowercase letter
    </li>
    <li className={/[0-9]/.test(password) ? 'valid' : ''}>
      One number
    </li>
    <li className={/[@$!%*?&#]/.test(password) ? 'valid' : ''}>
      One special character (@$!%*?&#)
    </li>
  </ul>
</div>
```

---

### **2. Rate Limiting on Auth Endpoints**

**What Changed:**
- Login/Register endpoints now rate limited to **5 requests per minute**
- Prevents brute force attacks

**Frontend Action Required:**

Handle 429 (Too Many Requests) responses gracefully:

```typescript
// In your API client or auth service

try {
  await api.login(credentials);
} catch (error) {
  if (error.response?.status === 429) {
    // Rate limited
    const retryAfter = error.response.data.retry_after || '1 minute';
    
    showError(
      `Too many failed attempts. Please try again after ${retryAfter}`
    );
    
    // Optionally disable login button temporarily
    setLoginDisabled(true);
    setTimeout(() => setLoginDisabled(false), 60000);
  } else if (error.response?.status === 401) {
    // Invalid credentials
    showError('Invalid email or password');
  }
}
```

**Rate Limit Response:**
```json
{
  "detail": "rate_limit_exceeded",
  "message": "Too many requests. Please try again after 1 minute",
  "retry_after": "1 minute"
}
```

**UI Recommendation:**
```tsx
// Add cooldown timer display
{loginDisabled && (
  <div className="login-cooldown">
    <AlertTriangleIcon />
    <p>Too many failed attempts. Cooldown: {cooldownTime}s</p>
  </div>
)}
```

---

### **3. Account Lockout**

**What Changed:**
- Account locks after **5 consecutive failed login attempts**
- Lockout duration: **15 minutes**
- Returns HTTP 423 (Locked)

**Frontend Action Required:**

Handle 423 (Locked) response:

```typescript
try {
  await api.login(credentials);
} catch (error) {
  if (error.response?.status === 423) {
    // Account locked
    const detail = error.response.data.detail;
    // detail: "Account locked due to too many failed attempts. Try again after 2026-03-09T15:30:00"
    
    showError(
      'Account locked due to too many failed attempts. Please try again later.'
    );
    
    // Optionally redirect to password reset
    showPasswordResetSuggestion();
  }
}
```

**Lockout Response:**
```json
{
  "detail": "Account locked due to too many failed attempts. Try again after 2026-03-09T15:30:00"
}
```

**UI Recommendation:**
```tsx
// Show account locked state
{error?.status === 423 && (
  <Alert variant="error">
    <LockIcon />
    <div>
      <h4>Account Locked</h4>
      <p>Too many failed login attempts. Your account has been temporarily locked.</p>
      <Button onClick={() => redirectToPasswordReset()}>
        Reset Password
      </Button>
    </div>
  </Alert>
)}
```

---

### **4. Security Headers**

**What Changed:**
- Backend now sends security headers on all responses
- No frontend changes required

**Headers Added:**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Frontend Action:** None required

---

### **5. Security Event Logging**

**What Changed:**
- All auth events now logged (login attempts, lockouts, registrations)
- No frontend changes required

**Events Logged:**
- ✅ Login attempts (success/failure)
- ✅ Account lockouts
- ✅ User registrations
- ✅ Password changes
- ✅ Permission denied

**Frontend Action:** None required

---

## 📋 Frontend Testing Checklist

### **Before Deployment:**

- [ ] **Test Password Validation**
  ```typescript
  // Try registering with weak password
  await register({ email: 'test@test.com', password: 'weak' });
  // Should show validation error BEFORE API call
  ```

- [ ] **Test Rate Limiting**
  ```typescript
  // Try logging in 6 times rapidly with wrong password
  for (let i = 0; i < 6; i++) {
    await login({ email: 'test@test.com', password: 'wrong' });
  }
  // 6th attempt should show rate limit error (429)
  ```

- [ ] **Test Account Lockout**
  ```typescript
  // Try logging in 5 times with wrong password
  for (let i = 0; i < 5; i++) {
    await login({ email: 'test@test.com', password: 'wrong' });
  }
  // 5th attempt should return 423 (Locked)
  ```

- [ ] **Test Security Headers**
  ```bash
  curl -I https://your-backend-url/health
  # Should see security headers in response
  ```

---

## 🎨 UI/UX Recommendations

### **Password Strength Indicator**

```tsx
function PasswordStrength({ password }: { password: string }) {
  const strength = calculatePasswordStrength(password);
  
  return (
    <div className="password-strength">
      <div className={`strength-bar strength-${strength.level}`}>
        <div className="fill" style={{ width: `${strength.percentage}%` }} />
      </div>
      <p className="strength-text">{strength.label}</p>
    </div>
  );
}

function calculatePasswordStrength(password: string) {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[@$!%*?&#]/.test(password)) score++;
  
  const percentage = (score / 6) * 100;
  
  let level = 'weak';
  let label = 'Weak';
  
  if (percentage >= 80) {
    level = 'strong';
    label = 'Strong';
  } else if (percentage >= 60) {
    level = 'medium';
    label = 'Medium';
  } else if (percentage >= 40) {
    level = 'fair';
    label = 'Fair';
  }
  
  return { level, label, percentage };
}
```

### **Login Attempt Counter**

```tsx
function LoginForm() {
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const handleLogin = async (credentials) => {
    try {
      await api.login(credentials);
      setFailedAttempts(0); // Reset on success
    } catch (error) {
      if (error.response?.status === 401) {
        setFailedAttempts(prev => prev + 1);
        
        if (failedAttempts + 1 >= 4) {
          showWarning('One more failed attempt will lock your account');
        }
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Login form */}
      
      {failedAttempts > 0 && (
        <div className="failed-attempts">
          Failed attempts: {failedAttempts}/5
        </div>
      )}
    </form>
  );
}
```

---

## 🔧 Configuration

### **Environment Variables**

Add to frontend `.env`:

```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url

# Security
NEXT_PUBLIC_ENABLE_PASSWORD_VALIDATION=true
NEXT_PUBLIC_MAX_LOGIN_ATTEMPTS=5
NEXT_PUBLIC_LOCKOUT_DURATION_MINUTES=15
```

---

## 📊 API Response Changes

### **Registration Response**

**Before:**
```json
{
  "access_token": "token_here"
}
```

**After:** (No change - backward compatible)
```json
{
  "access_token": "token_here"
}
```

**New Error Cases:**
```json
// Password too weak
{
  "detail": [
    {
      "type": "value_error",
      "msg": "Value error, Password must contain at least one uppercase letter"
    }
  ]
}
```

---

### **Login Response**

**Before:**
```json
// Success
{
  "access_token": "token_here"
}

// Failure
{
  "detail": "invalid_credentials"
}
```

**After:** (Backward compatible + new error codes)
```json
// Success
{
  "access_token": "token_here"
}

// Invalid credentials (still works)
{
  "detail": "invalid_credentials"
}

// Rate limited (NEW)
{
  "detail": "rate_limit_exceeded",
  "message": "Too many requests. Please try again after 1 minute",
  "retry_after": "1 minute"
}

// Account locked (NEW)
{
  "detail": "Account locked due to too many failed attempts. Try again after 2026-03-09T15:30:00"
}
```

---

## 🚀 Deployment Timeline

### **Phase 1: Immediate (Required)**
- [ ] Add password validation to registration form
- [ ] Handle 429 (Rate Limit) responses
- [ ] Handle 423 (Account Locked) responses

### **Phase 2: Recommended (UX Improvements)**
- [ ] Add password strength indicator
- [ ] Add failed attempt counter
- [ ] Add cooldown timer display

### **Phase 3: Optional (Nice to Have)**
- [ ] Add password requirements checklist
- [ ] Add account lockout warning at 4 attempts
- [ ] Add "Forgot Password" suggestion on lockout

---

## 📞 Support

If you encounter issues:

1. **Check Backend Logs** - Look for security events
2. **Test Locally** - Use test credentials
3. **Review Error Messages** - Backend returns detailed errors
4. **Check Network Tab** - Verify API responses

---

## ✅ Summary

| Feature | Frontend Changes Required | Priority |
|---------|--------------------------|----------|
| Password Policy | ✅ Add client-side validation | HIGH |
| Rate Limiting | ✅ Handle 429 responses | HIGH |
| Account Lockout | ✅ Handle 423 responses | HIGH |
| Security Headers | ❌ None | N/A |
| Security Logging | ❌ None | N/A |

**Total Action Items:** 3 (all HIGH priority)

---

**Questions?** Reach out to backend team or check `SECURITY_HARDENING_COMPLETE.md` for details.

**Status:** ⚠️ ACTION REQUIRED before production deployment
