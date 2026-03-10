# Widget Versioning Strategy

**Version:** 1.0.0  
**Last Updated:** 2026-03-09

---

## 📦 Version Structure

**Semantic Versioning:** `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0) - Breaking changes
- **MINOR** (1.1.0) - New features, backward compatible
- **PATCH** (1.0.1) - Bug fixes, backward compatible

---

## 🏗️ Build Output

**After running `npm run build`:**

```
dist/
├── index-1.0.0.global.js    ← Versioned filename (269KB minified)
└── index.global.js          ← Latest symlink (optional)
```

---

## 🚀 Deployment URLs

### **Vercel Deployment**

**Versioned:**
```
https://kembang-widget.vercel.app/index-1.0.0.global.js
https://kembang-widget.vercel.app/index-1.1.0.global.js
```

**Latest (via rewrite):**
```
https://kembang-widget.vercel.app/widget.js
```

---

### **CDN Deployment (Production)**

**Versioned:**
```
https://cdn.kembang.ai/widget-1.0.0.js
https://cdn.kembang.ai/widget-1.1.0.js
```

**Latest:**
```
https://cdn.kembang.ai/widget.js  ← Points to latest stable
```

---

### **npm/unpkg**

**Versioned:**
```
https://unpkg.com/@kembang/widget@1.0.0/dist/index.global.js
https://unpkg.com/@kembang/widget@1.1.0/dist/index.global.js
```

**Latest:**
```
https://unpkg.com/@kembang/widget/dist/index.global.js
```

---

## 📝 Embed Code Examples

### **Option 1: Specific Version (Recommended for Production)**

```html
<script>
  window.KembangConfig = {
    apiKey: "kw_live_abc123...",
    position: "bottom-right",
    theme: "auto"
  };
</script>
<script src="https://cdn.kembang.ai/widget-1.0.0.js"></script>
```

**Benefits:**
- ✅ Stable - won't break with updates
- ✅ Predictable behavior
- ✅ Can test new versions before upgrading

---

### **Option 2: Latest Version (Use with Caution)**

```html
<script>
  window.KembangConfig = {
    apiKey: "kw_live_abc123...",
    position: "bottom-right",
    theme: "auto"
  };
</script>
<script src="https://cdn.kembang.ai/widget.js"></script>
```

**Benefits:**
- ✅ Always up-to-date
- ✅ Automatic bug fixes

**Risks:**
- ⚠️ Breaking changes may affect your site
- ⚠️ Unexpected behavior changes

---

### **Option 3: Self-Hosted (Maximum Control)**

```html
<!-- Download widget-1.0.0.js and host locally -->
<script>
  window.KembangConfig = {
    apiKey: "kw_live_abc123...",
    position: "bottom-right",
    theme: "auto"
  };
</script>
<script src="/assets/widget-1.0.0.js"></script>
```

**Benefits:**
- ✅ Full control
- ✅ No external dependencies
- ✅ Can modify if needed

---

## 🔧 Build Commands

### **Development:**
```bash
cd apps/widget
npm run dev          # Watch mode, auto-rebuild
```

### **Production Build:**
```bash
cd apps/widget
npm run build        # Builds index-1.0.0.global.js
```

### **Versioned Build:**
```bash
cd apps/widget
npm run build:version  # Updates version in all files
npm run build
```

---

## 📋 Version Release Checklist

### **Before Release:**

- [ ] Update version in `package.json`
- [ ] Run `npm run build:version`
- [ ] Test widget locally (`open index.html`)
- [ ] Verify version displays correctly
- [ ] Test all widget features
- [ ] Check console for errors

### **Deployment:**

- [ ] Build widget: `npm run build`
- [ ] Upload to Vercel: `vercel --prod`
- [ ] Upload to CDN (if using)
- [ ] Update documentation
- [ ] Notify users of new version

### **Post-Deployment:**

- [ ] Test deployed version
- [ ] Verify version number in console
- [ ] Check widget functionality
- [ ] Monitor for errors

---

## 🎯 Version Detection

**Check widget version in browser console:**

```javascript
// Method 1: Via global object
console.log(KembangAI.getVersion());
// Output: "1.0.0"

// Method 2: Via instance
const widget = KembangAI.init(config);
console.log(widget.getVersion());
// Output: "1.0.0"

// Method 3: Check console log on init
// Output: "🌸 Kembang AI Widget v1.0.0 Initializing..."
```

---

## 🔄 Update Strategy

### **For Tenants (UMKM Clients):**

**Recommended:** Use specific version in embed code

```html
<!-- Good: Stable version -->
<script src="https://cdn.kembang.ai/widget-1.0.0.js"></script>
```

**Update Process:**
1. Test new version in staging
2. Update version number in embed code
3. Deploy to production

---

### **For Development Team:**

**Semantic Versioning Rules:**

**MAJOR (1.0.0 → 2.0.0):**
- Breaking API changes
- Removed features
- Changed widget initialization

**MINOR (1.0.0 → 1.1.0):**
- New features
- New configuration options
- Backward compatible improvements

**PATCH (1.0.0 → 1.0.1):**
- Bug fixes
- Performance improvements
- Security patches

---

## 📊 Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | 2026-03-09 | Initial release | ✅ Current Stable |

---

## 🆘 Troubleshooting

### **Widget not loading:**

```javascript
// Check if widget loaded
if (!window.KembangAI) {
  console.error('Widget not loaded!');
  // Check network tab for 404 errors
  // Verify CDN URL is correct
}
```

### **Wrong version loaded:**

```javascript
// Check loaded version
console.log(KembangAI.getVersion());

// Clear cache and reload
// Or use versioned URL with query param:
// widget-1.0.0.js?v=timestamp
```

---

## 📞 Support

**For version-related issues:**
- Check console logs for version number
- Verify embed code matches deployed version
- Clear browser cache
- Contact development team

---

**Last Updated:** 2026-03-09  
**Maintained By:** Development Team
