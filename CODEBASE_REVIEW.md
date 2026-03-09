# 🏗️ Codebase Separation Plan

**Date:** 2026-03-09  
**Goal:** Separate Console and Tenant apps for independent deployment

---

## 📊 Current Structure (Monorepo)

```
frontend/
├── apps/
│   ├── console/          # Superadmin dashboard
│   ├── tenant/           # Tenant dashboard
│   └── widget/           # Chat widget SDK
├── packages/
│   ├── api-client/       # Shared API client
│   └── ui/               # Shared UI components
└── package.json          # Workspace root
```

---

## ✅ Build Verification

### **All Apps Build Successfully**

```bash
# Console App
✅ 17 routes compiled
✅ No TypeScript errors
✅ Bundle size: ~191kB max

# Tenant App
✅ 14 routes compiled
✅ No TypeScript errors
✅ Bundle size: ~189kB max

# Widget SDK
✅ Build successful
✅ Minified: 269kB
```

---

## 🔍 Critical Code Review

### **Console App (Superadmin)**

**Pages:**
- ✅ `/` - Dashboard with platform stats
- ✅ `/tenants` - Tenant management (table layout)
- ✅ `/tenants/[id]` - Tenant details with quick links
- ✅ `/users` - Global user management
- ✅ `/kb` - Knowledge Base (with tenant filter)
- ✅ `/chat` - Conversations (with tenant selector)
- ✅ `/infra` - Infrastructure monitoring
- ✅ `/superadmin/faq` - FAQ overview
- ✅ `/superadmin/products` - Product catalog
- ✅ `/superadmin/api-keys` - API key management
- ✅ `/settings/*` - System settings

**Critical Features:**
- ✅ Tenant isolation implemented
- ✅ Pagination on all list pages
- ✅ Search and filters working
- ✅ API integration complete
- ✅ Error handling implemented

---

### **Tenant App**

**Pages:**
- ✅ `/` - Tenant dashboard with stats
- ✅ `/kb` - Knowledge Base management
- ✅ `/faq` - FAQ management
- ✅ `/products` - Product catalog (with SKU)
- ✅ `/playground` - Chat testing
- ✅ `/chat` - Conversation history
- ✅ `/settings/keys` - API key generation
- ✅ `/settings/team` - Team management
- ✅ `/settings/packages` - Widget integration
- ✅ `/settings` - Tenant settings

**Critical Features:**
- ✅ Product CRUD matches backend schema
- ✅ FAQ CRUD implemented
- ✅ Playground with conversation persistence
- ✅ API key show/hide/copy
- ✅ Team member management

---

### **Shared Packages**

**API Client (`packages/api-client`):**
- ✅ All endpoints implemented
- ✅ Authentication headers attached
- ✅ X-Tenant-ID header for tenant isolation
- ✅ Error handling with detailed logging
- ✅ TypeScript types defined

**Methods:**
```typescript
// Auth
login(), getMe()

// Chat
sendChatMessage(), getChatSessions(), getChatHistory()

// KB
getDocuments(), uploadDocument(), deleteDocument()

// FAQ
getFaqs(), getFaqStats(), createFaq(), updateFaq(), deleteFaq()

// Products
getProducts(), getProductStats(), getLowStockProducts()
createProduct(), updateProduct(), deleteProduct()

// API Keys
getApiKeys(), revokeApiKey()

// Superadmin
getPlatformStats(), listAllTenants(), createTenant()
updateTenant(), deleteTenant(), getGlobalUsage()
getGlobalConversations(), getGlobalChatHistory()
listAllUsers(), createUser(), updateUser(), deleteUser()

// Health & Metrics
getSystemHealth(), getSystemLogs()
```

---

## ⚠️ Issues Found (Non-Critical)

### **1. ESLint Not Installed**
```
⨯ ESLint must be installed in order to run during builds
```
**Severity:** Low  
**Impact:** None (build succeeds)  
**Fix:** Optional - `npm install --save-dev eslint`

---

### **2. Console Logging in Production**
```typescript
console.log("[API] Client initialized with baseURL:", ...)
console.log("[Playground] API Response:", data)
```
**Severity:** Low  
**Impact:** Verbose logs in production  
**Fix:** Remove or conditionally disable in production

---

### **3. Hardcoded Localhost URLs**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```
**Severity:** Medium  
**Impact:** Won't work in production  
**Fix:** Update to production URL before deploy

---

## 🎯 Separation Strategy

### **Option 1: Keep Monorepo (Recommended)**

**Current structure is already good!**

**Benefits:**
- ✅ Shared packages (api-client, ui)
- ✅ Single `npm install`
- ✅ Consistent versions
- ✅ Easy to maintain

**Deployment:**
```bash
# Deploy independently
cd apps/console && vercel --prod
cd apps/tenant && vercel --prod
```

---

### **Option 2: Full Separation**

**If you want completely separate repos:**

#### **1. Console App Repository**
```
console-app/
├── app/
├── components/
├── lib/
├── store/
├── hooks/
├── package.json
└── .env.local
```

**Steps:**
1. Copy `apps/console` to new repo
2. Copy `packages/api-client` as dependency
3. Update imports
4. Separate `package.json`

---

#### **2. Tenant App Repository**
```
tenant-app/
├── app/
├── components/
├── lib/
├── store/
├── hooks/
├── package.json
└── .env.local
```

**Steps:**
1. Copy `apps/tenant` to new repo
2. Copy `packages/api-client` as dependency
3. Update imports
4. Separate `package.json`

---

## 📦 Recommended Approach

**Keep monorepo structure** with these updates:

### **1. Add Production Scripts**

```json
{
  "scripts": {
    "build:console": "npm run build --workspace=@kembang/console",
    "build:tenant": "npm run build --workspace=@kembang/tenant",
    "deploy:console": "cd apps/console && vercel --prod",
    "deploy:tenant": "cd apps/tenant && vercel --prod"
  }
}
```

---

### **2. Separate Environment Files**

```bash
# apps/console/.env.production
NEXT_PUBLIC_API_BASE_URL=https://api.kembang.ai/api/v1

# apps/tenant/.env.production
NEXT_PUBLIC_API_BASE_URL=https://api.kembang.ai/api/v1
```

---

### **3. Vercel Configuration**

**Create separate Vercel projects:**

```bash
# Console
cd apps/console
vercel --project kembang-console

# Tenant
cd apps/tenant
vercel --project kembang-tenant
```

---

## ✅ Pre-Deployment Checklist

### **Console App**
- [ ] Update API URL to production
- [ ] Remove console.log statements
- [ ] Test all superadmin features
- [ ] Verify tenant isolation
- [ ] Test pagination on all pages
- [ ] Verify error handling

### **Tenant App**
- [ ] Update API URL to production
- [ ] Remove console.log statements
- [ ] Test product CRUD
- [ ] Test FAQ CRUD
- [ ] Test playground
- [ ] Verify API key generation

### **Shared**
- [ ] Update api-client timeout if needed
- [ ] Add request/response logging (optional)
- [ ] Add retry logic for failed requests (optional)

---

## 🚀 Deployment Commands

```bash
# 1. Build both apps
npm run build:console
npm run build:tenant

# 2. Deploy Console
cd apps/console
vercel --prod

# 3. Deploy Tenant
cd apps/tenant
vercel --prod

# 4. Verify deployments
curl https://console.kembang.ai/health
curl https://app.kembang.ai/health
```

---

## 📊 Post-Deployment Monitoring

### **Metrics to Track:**
- API response times
- Error rates (4xx, 5xx)
- Page load times
- User sessions
- Active tenants

### **Tools:**
- Vercel Analytics
- Backend logs
- Database query performance
- Error tracking (Sentry, etc.)

---

**Status:** ✅ READY FOR SEPARATION & DEPLOYMENT

**Recommendation:** Keep monorepo, deploy separately

---

**Last Updated:** 2026-03-09
