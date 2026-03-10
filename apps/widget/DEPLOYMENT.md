# Widget Deployment Guide

**Version:** 1.0.0  
**Ready for Deployment:** ✅ YES

---

## 📦 Build Output

**After running `npm run build`:**

```
dist/
├── index-1.0.0.global.js    ← Versioned (269KB minified)
└── index.global.js          ← Latest (copy of versioned)
```

---

## 🚀 Deployment Options

### **Option 1: Vercel (Recommended for Testing)**

**Step 1: Navigate to widget directory**
```bash
cd apps/widget
```

**Step 2: Build**
```bash
npm run build
```

**Step 3: Deploy to Vercel**
```bash
vercel --project kembang-widget
```

**Step 4: Configure in Vercel Dashboard**
```
Root Directory: apps/widget
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Deployment URLs:**
```
https://kembang-widget.vercel.app/index-1.0.0.global.js  ← Versioned
https://kembang-widget.vercel.app/widget.js              ← Via rewrite
```

---

### **Option 2: CDN (Production)**

**Step 1: Build**
```bash
cd apps/widget
npm run build
```

**Step 2: Upload to S3/CloudFront**
```bash
# Versioned
aws s3 cp dist/index-1.0.0.global.js \
  s3://kembang-cdn/widget-1.0.0.js \
  --acl public-read

# Latest
aws s3 cp dist/index.global.js \
  s3://kembang-cdn/widget.js \
  --acl public-read
```

**CDN URLs:**
```
https://cdn.kembang.ai/widget-1.0.0.js  ← Versioned
https://cdn.kembang.ai/widget.js        ← Latest
```

---

### **Option 3: GitHub Releases**

**Step 1: Build**
```bash
npm run build
```

**Step 2: Create GitHub Release**
```bash
# Tag the release
git tag v1.0.0
git push origin v1.0.0
```

**Step 3: Upload to Releases**
- Go to GitHub Releases
- Create new release (v1.0.0)
- Upload `dist/index-1.0.0.global.js`

**Release URL:**
```
https://github.com/your-org/kembang-ai/releases/download/v1.0.0/widget-1.0.0.js
```

---

## 📝 Embed Code for Tenants

### **After Deployment - Update Tenant Dashboard**

**File:** `apps/tenant/app/settings/packages/page.tsx`

**Update WIDGET_CDN:**
```typescript
// For Vercel deployment
const WIDGET_CDN = "https://kembang-widget.vercel.app/widget-1.0.0.js";

// For CDN deployment
const WIDGET_CDN = "https://cdn.kembang.ai/widget-1.0.0.js";

// For GitHub releases
const WIDGET_CDN = "https://github.com/your-org/kembang-ai/releases/download/v1.0.0/widget-1.0.0.js";
```

---

## 🧪 Testing Checklist

### **Local Testing:**

```bash
# 1. Build widget
npm run build

# 2. Open test page
open index.html

# 3. Verify in browser console
console.log(KembangAI.getVersion());
// Should output: "1.0.0"
```

### **After Vercel Deployment:**

```bash
# 1. Create test HTML file
cat > test.html << EOF
<!DOCTYPE html>
<html>
<head><title>Widget Test</title></head>
<body>
  <h1>Widget Test Page</h1>
  <script>
    window.KembangConfig = {
      apiKey: "kw_live_test_key",
      position: "bottom-right"
    };
  </script>
  <script src="https://kembang-widget.vercel.app/widget-1.0.0.js"></script>
</body>
</html>
EOF

# 2. Open in browser
open test.html

# 3. Verify widget loads
# Check console for: "🌸 Kembang AI Widget v1.0.0 Initializing..."
```

---

## ⚙️ Vercel Configuration

**File:** `apps/widget/vercel.json` (already created)

**Features:**
- ✅ Versioned URLs (`/index-1.0.0.global.js`)
- ✅ Latest rewrite (`/widget.js` → `/index-1.0.0.global.js`)
- ✅ CORS headers (Access-Control-Allow-Origin: *)
- ✅ Cache headers (1 year immutable)

---

## 🔄 Version Update Process

### **To Release Version 1.1.0:**

**Step 1: Update version**
```bash
cd apps/widget
npm version 1.1.0  # Updates package.json
```

**Step 2: Update version in code**
- Edit `src/index.ts`: Update `WIDGET_VERSION = "1.1.0"`
- Edit `index.html`: Update version display
- Edit `vercel.json`: Update rewrite to `index-1.1.0.global.js`

**Step 3: Build**
```bash
npm run build
# Output: dist/index-1.1.0.global.js
```

**Step 4: Deploy**
```bash
vercel --project kembang-widget --prod
```

**Step 5: Update Tenant Dashboard**
- Update `WIDGET_CDN` to new version
- Deploy tenant app

---

## 📊 Deployment Verification

### **Check Deployment Success:**

```bash
# 1. Check if file is accessible
curl -I https://kembang-widget.vercel.app/index-1.0.0.global.js

# Expected headers:
# HTTP/2 200
# content-type: application/javascript
# access-control-allow-origin: *
# cache-control: public, max-age=31536000, immutable
```

### **Check Widget Version:**

```javascript
// In browser console
console.log(KembangAI.getVersion());
// Output: "1.0.0"
```

---

## 🆘 Troubleshooting

### **404 Error:**
```
❌ File not found: /index-1.0.0.global.js
```

**Solution:**
- Verify build completed successfully
- Check `dist/` folder has the file
- Redeploy to Vercel

---

### **CORS Error:**
```
❌ Access to script has been blocked by CORS policy
```

**Solution:**
- Verify `vercel.json` has CORS headers
- Check Vercel deployment completed
- Clear browser cache

---

### **Widget Not Loading:**
```
❌ KembangAI is not defined
```

**Solution:**
- Check script src URL is correct
- Verify deployment URL is accessible
- Check browser console for errors

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [ ] Widget builds successfully (`npm run build`)
- [ ] Version number is correct in `package.json`
- [ ] Version number is correct in `src/index.ts`
- [ ] `vercel.json` exists and is correct
- [ ] Tested locally (`open index.html`)
- [ ] Console shows correct version
- [ ] Widget functionality works
- [ ] No console errors

---

## 📞 Post-Deployment

After deployment:

1. **Test deployed URL**
2. **Verify version in console**
3. **Update tenant dashboard** with new widget URL
4. **Notify tenants** of new version (if breaking changes)
5. **Monitor for errors** in Vercel dashboard

---

## 🎯 Quick Deploy Command

**For quick deployment:**

```bash
cd apps/widget
npm run build
vercel --project kembang-widget --prod
```

**Output:**
```
✅ Deployment complete!
🔗 https://kembang-widget.vercel.app
📦 https://kembang-widget.vercel.app/index-1.0.0.global.js
```

---

**Ready to Deploy!** 🚀

**Last Updated:** 2026-03-09  
**Version:** 1.0.0
