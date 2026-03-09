# Frontend Synchronization Guide

**Last Updated:** 2026-03-09  
**Backend Version:** 2.0.0 (with FAQ + State Machine + Product CRUD)

---

## 🚨 Breaking Changes

### **1. Chat Response Structure**

Response dari `/api/v1/chat/message` sekarang punya field baru:

```typescript
interface ChatResponse {
  conversation_id: string;
  reply: string;
  sources: string[];
  
  // NEW FIELDS
  intent: "faq" | "greeting" | "smalltalk" | "tool" | "rag" | "rag_cached" | "rag_cached";
  llm_used: boolean;
  from_cache?: boolean;
  state?: {
    stage: string;
    slots: Record<string, any>;
  };
}
```

**Action Required:** Update TypeScript types di frontend.

---

## 📡 New API Endpoints

### **FAQ Management**

```
GET    /api/v1/faq              # List FAQs for tenant
POST   /api/v1/faq              # Create new FAQ
DELETE /api/v1/faq/{id}         # Delete FAQ
```

**Example Request:**
```typescript
// List FAQs
const faqs = await api.get('/faq');

// Create FAQ
await api.post('/faq', {
  category: 'business_hours',
  question_patterns: ['jam buka berapa', 'buka jam berapa'],
  answer: 'Kami buka setiap hari pukul 09.00-21.00 WIB.',
  confidence: 0.9
});
```

---

### **Product CRUD**

```
GET    /api/v1/products                    # List products (with filters)
GET    /api/v1/products/{id}               # Get product detail
POST   /api/v1/products                    # Create product
PUT    /api/v1/products/{id}               # Update product
DELETE /api/v1/products/{id}               # Delete product (soft delete)
GET    /api/v1/products/catalog/metadata   # Get catalog for AI
POST   /api/v1/products/bulk               # Bulk upload (CSV/Excel)
```

**Query Parameters:**
```typescript
GET /api/v1/products?category=skincare&min_price=50000&max_price=200000&in_stock_only=true&search=serum&page=1&page_size=10
```

**Example Request:**
```typescript
// List products with filters
const products = await api.get('/products', {
  params: {
    category: 'skincare',
    min_price: 50000,
    max_price: 200000,
    in_stock_only: true,
    search: 'serum',
    page: 1,
    page_size: 10
  }
});

// Create product
await api.post('/products', {
  sku: 'SKN-001',
  name: 'Vitamin C Serum',
  description: 'Serum untuk mencerahkan kulit',
  category: 'skincare',
  subcategory: 'serum',
  price: 95000,
  stock_quantity: 50,
  is_active: true,
  attributes: {
    skin_type: ['berminyak', 'kering'],
    benefits: ['whitening', 'brightening']
  }
});
```

---

### **Health & Metrics**

```
GET /health    # Health check
GET /metrics   # Request metrics
```

---

## 🔧 Configuration Changes

### **Environment Variables**

Update `.env.local` di **tenant** dan **console** apps:

```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# For production (Hugging Face)
# NEXT_PUBLIC_API_BASE_URL=https://your-space.hf.space/api/v1
```

---

### **CORS Configuration**

Backend sekarang support:

| Domain | Purpose | Status |
|--------|---------|--------|
| `http://localhost:3000` | Tenant local dev | ✅ |
| `http://localhost:3001` | Console local dev | ✅ |
| `http://localhost:8000` | Backend local | ✅ |
| `https://kembang-tenant.vercel.app` | Tenant production | ✅ |
| `https://kembang-console.vercel.app` | Console production | ✅ |
| `https://*.hf.space` | Hugging Face Spaces | ✅ |
| `https://huggingface.co` | Hugging Face domain | ✅ |

**No frontend changes needed** - CORS sudah dikonfigurasi di backend.

---

## 💡 Optional Enhancements

### **1. Show Intent Indicator**

Display badge untuk menunjukkan tipe response:

```typescript
// apps/tenant/app/chat/page.tsx

const IntentBadge = ({ intent }: { intent: string }) => {
  const colors = {
    faq: 'bg-green-100 text-green-800',
    greeting: 'bg-blue-100 text-blue-800',
    smalltalk: 'bg-purple-100 text-purple-800',
    rag: 'bg-gray-100 text-gray-800',
    rag_cached: 'bg-yellow-100 text-yellow-800',
  };
  
  const labels = {
    faq: 'FAQ',
    greeting: 'Greeting',
    smalltalk: 'Smalltalk',
    rag: 'AI Response',
    rag_cached: 'Cached',
  };
  
  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[intent]}`}>
      {labels[intent]}
    </span>
  );
};

// Usage
{messages.map((msg) => (
  <Message
    key={msg.id}
    content={msg.content}
    badge={msg.metadata?.intent && <IntentBadge intent={msg.metadata.intent} />}
  />
))}
```

---

### **2. Show Conversation State (Sales Flow)**

Display progress indicator untuk sales funnel:

```typescript
const SalesProgress = ({ state }: { state: any }) => {
  if (!state) return null;
  
  const stages = {
    INIT: 'Starting...',
    GREETING_DONE: 'Greeted',
    ASKING_PRODUCT: 'Asking product preferences',
    ASKING_BUDGET: 'Asking budget',
    SHOWING_PRODUCTS: 'Showing products',
    CHECKOUT: 'Checkout',
  };
  
  return (
    <div className="text-sm text-gray-500">
      Current stage: {stages[state.stage]}
      {Object.keys(state.slots).length > 0 && (
        <div className="mt-1">
          Known: {Object.keys(state.slots).join(', ')}
        </div>
      )}
    </div>
  );
};
```

---

### **3. FAQ Management Page**

Create new page di Tenant Dashboard:

**File:** `apps/tenant/app/kb/faq/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface FAQ {
  id: string;
  category: string;
  question_patterns: string[];
  answer: string;
  confidence: number;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadFAQs();
  }, []);
  
  const loadFAQs = async () => {
    try {
      const response = await api.get('/faq');
      setFaqs(response.faqs);
    } catch (error) {
      console.error('Failed to load FAQs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteFAQ = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    
    try {
      await api.delete(`/faq/${id}`);
      loadFAQs();
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">FAQ Management</h1>
      
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-bold text-gray-500">
                  {faq.category}
                </span>
                <h3 className="font-bold">{faq.question_patterns.join(', ')}</h3>
                <p className="text-gray-600 mt-2">{faq.answer}</p>
              </div>
              <button
                onClick={() => deleteFAQ(faq.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### **4. Product Management Page**

Update existing product page to use new endpoints:

```typescript
// Replace /api/v1/kb/documents with /api/v1/products

const products = await api.get('/products', {
  params: {
    category: selectedCategory,
    in_stock_only: inStockOnly,
    search: searchQuery,
  }
});
```

---

## 🐛 Troubleshooting

### **Issue: Chat masih pakai RAG semua (FAQ tidak jalan)**

**Possible causes:**
1. FAQ tidak ada di database
2. Endpoint salah (pakai `/widget/chat` bukan `/chat/message`)

**Solution:**
```bash
# Check FAQs in database
cd backend
uv run python check_faqs_in_db.py

# Make sure using correct endpoint
grep -r "chat/message" apps/tenant/
# Should show: POST /api/v1/chat/message
```

---

### **Issue: CORS Error**

**Error:**
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
```bash
# Restart backend server
cd backend
uv run uvicorn app.main:app --reload

# Check CORS config in backend
grep -A 5 "CORS_ORIGINS" app/core/config.py
# Should include your frontend URL
```

---

### **Issue: Response structure berbeda**

**Check backend version:**
```bash
cd backend
git log --oneline -1
# Should show latest commit
```

**Check response in browser:**
```typescript
// In browser console
const response = await fetch('/api/v1/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'test' })
});
const data = await response.json();
console.log(data);
// Should show: { conversation_id, reply, sources, intent, llm_used, ... }
```

---

## ✅ Quick Checklist

Minimal changes required:

- [ ] Update TypeScript types for ChatResponse
- [ ] Add new API endpoints to client
- [ ] Update environment variables
- [ ] Test chat with FAQ questions
- [ ] Test product CRUD (if applicable)
- [ ] Test FAQ management (if applicable)

Optional enhancements:

- [ ] Add intent indicator badge
- [ ] Show conversation state progress
- [ ] Create FAQ management page
- [ ] Update product management page

---

## 📞 Support

If you encounter issues:

1. Check backend logs: `tail -f logs/backend.log`
2. Check browser console for errors
3. Verify API responses in Network tab
4. Run backend tests: `uv run pytest tests/`

---

**Backend is ready! Frontend changes are optional but recommended for better UX.** 🚀
