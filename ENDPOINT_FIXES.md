# Endpoint Fixes Summary

**Date:** 2026-03-09
**Status:** RESOLVED

## Problem

Frontend was calling incorrect API paths for stats and low-stock endpoints.

## Incorrect Paths (DO NOT USE)

- `/api/v1/superadmin/faq/stats`
- `/api/v1/superadmin/products/stats`
- `/api/v1/superadmin/products/low-stock`

## Correct Paths (USE THESE)

| Endpoint | Correct Path | Method | Auth Required |
|----------|-------------|--------|---------------|
| FAQ Stats | `/api/v1/faq/stats` | GET | Superadmin only |
| Product Stats | `/api/v1/products/stats` | GET | Superadmin only |
| Low Stock Products | `/api/v1/products/low-stock` | GET | Superadmin only |

## Query Parameters

### FAQ Stats
No parameters required.

Response includes:
- `total_faqs`: Total number of FAQs across all tenants
- `by_category`: List of categories with FAQ counts
- `by_tenant`: List of tenants with FAQ counts
- `top_faqs`: List of top 10 active FAQs

### Product Stats
No parameters required.

Response includes:
- `total_products`: Total number of products across all tenants
- `by_category`: List of categories with product counts
- `by_tenant`: List of tenants with product counts
- `low_stock_count`: Number of products with stock < 10
- `avg_price`: Average product price

### Low Stock Products
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `threshold` | int | 10 | Stock threshold for low stock alert |

Response includes:
- `threshold`: The threshold used
- `products`: List of products below threshold with details

## Example Requests

### FAQ Stats
```bash
curl -X GET http://localhost:8000/api/v1/faq/stats \
  -H "Authorization: Bearer <SUPERADMIN_TOKEN>"
```

### Product Stats
```bash
curl -X GET http://localhost:8000/api/v1/products/stats \
  -H "Authorization: Bearer <SUPERADMIN_TOKEN>"
```

### Low Stock Products
```bash
curl -X GET "http://localhost:8000/api/v1/products/low-stock?threshold=10" \
  -H "Authorization: Bearer <SUPERADMIN_TOKEN>"
```

## Root Cause

FastAPI route ordering issue. Static routes (`/stats`, `/low-stock`) must be defined before dynamic routes (`/{id}`) to prevent path conflicts.

## Action Required for Frontend

Update all API calls from:
```javascript
// WRONG
GET /api/v1/superadmin/faq/stats
GET /api/v1/superadmin/products/stats
GET /api/v1/superadmin/products/low-stock
```

To:
```javascript
// CORRECT
GET /api/v1/faq/stats
GET /api/v1/products/stats
GET /api/v1/products/low-stock?threshold=10
```

## Testing

All endpoints verified working with test script `test_api_comprehensive.py`.

Run tests:
```bash
uv run python test_api_comprehensive.py
```

## Files Modified

- `app/api/routes_faq.py` - Moved `/stats` route before `/{faq_id}`
- `app/api/routes_products.py` - Moved `/stats` and `/low-stock` routes before `/{product_id}`
- `test_api_comprehensive.py` - Updated test paths to correct endpoints
