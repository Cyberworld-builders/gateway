# Leads API Documentation

## Overview

The Leads API provides a centralized system for capturing and managing email leads across all CyberWorld products (EternaGuard, Studio, Gateway, etc.).

## Database Schema

### `leads` Table

```sql
- id: uuid (primary key)
- email: text (unique, not null)
- products: text[] (array of product identifiers)
- status: text (active, unsubscribed, bounced)
- metadata: jsonb (product-specific data, engagement tracking)
- created_at: timestamp
- updated_at: timestamp
```

### Key Features

1. **Single Email, Multiple Products**: One email can be subscribed to multiple products
2. **Automatic Deduplication**: If an email already exists, the new product is added to the array
3. **Status Tracking**: Track active, unsubscribed, and bounced emails
4. **Metadata Storage**: Store product-specific information and engagement data

## API Endpoints

### POST `/api/leads`

Capture a new lead or add a product to an existing lead.

**Request Body:**
```json
{
  "email": "user@example.com",
  "product": "eternaguard",
  "metadata": {
    "source": "landing_page",
    "page": "home"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Successfully subscribed",
  "leadId": "uuid"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

### GET `/api/leads?email=user@example.com&product=eternaguard`

Check if an email is subscribed.

**Response:**
```json
{
  "success": true,
  "subscribed": true,
  "status": "active",
  "products": ["eternaguard", "studio"]
}
```

## Email Validation

The API includes built-in validation for:

1. **Format Validation**: Standard email regex
2. **Disposable Email Blocking**: Blocks 15+ common disposable email providers
3. **Length Validation**: Max 254 characters
4. **Normalization**: Converts to lowercase and trims whitespace

### Blocked Disposable Domains

- tempmail.com
- guerrillamail.com
- 10minutemail.com
- mailinator.com
- throwaway.email
- fakeinbox.com
- temp-mail.org
- getnada.com
- maildrop.cc
- trashmail.com
- yopmail.com
- sharklasers.com
- guerrillamailblock.com
- spam4.me
- grr.la
- dispostable.com
- mintemail.com

## Database Function

### `upsert_lead(p_email, p_product, p_metadata)`

A PostgreSQL function that handles the insert/update logic:

- If email exists: Adds product to array (if not already present)
- If email doesn't exist: Creates new lead with product
- Automatically reactivates unsubscribed leads on new signup
- Returns success/error status

## Usage in Products

### EternaGuard Example

```typescript
import { validateEmail, submitLead } from "@/lib/email-validation";

const handleSubmit = async (email: string) => {
  // Client-side validation
  const validation = validateEmail(email);
  if (!validation.valid) {
    return { error: validation.error };
  }

  // Submit to API
  const result = await submitLead(email, "eternaguard", {
    source: "landing_page",
    page: "home",
  });

  return result;
};
```

## Environment Variables

### Gateway (API)
No additional environment variables needed - uses existing Supabase config.

### Products (EternaGuard, Studio, etc.)
Add to `.env.local`:
```
NEXT_PUBLIC_GATEWAY_API_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_GATEWAY_API_URL=https://gateway.cyberworld.com  # Production
```

## Security

1. **Row Level Security (RLS)**: Enabled on `leads` table
2. **Anonymous Insert**: Public can insert leads (for forms)
3. **Authenticated Read/Update/Delete**: Only authenticated users can view/modify leads
4. **Server-Side Validation**: All validation happens on the API side
5. **Metadata Tracking**: Automatically captures user agent and referer

## Future Enhancements

- [ ] Add email verification service integration (ZeroBounce, Abstract API)
- [ ] Implement double opt-in flow
- [ ] Add unsubscribe endpoint
- [ ] Create admin dashboard for lead management
- [ ] Add export functionality (CSV, etc.)
- [ ] Implement engagement tracking
- [ ] Add webhook support for email service providers

