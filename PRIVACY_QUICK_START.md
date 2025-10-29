# Privacy Settings - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Run Migration

```bash
cd pairova-backend
npm run db:migration:run
```

### Step 2: Restart Backend

```bash
npm run start:dev
```

### Step 3: Test API

```bash
# Login to get token
curl -X POST http://localhost:3007/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "password": "yourpassword"}'

# Save the token
TOKEN="paste_token_here"

# Get privacy settings
curl -X GET http://localhost:3007/api/v1/profiles/applicant/privacy \
  -H "Authorization: Bearer $TOKEN"

# Update privacy settings
curl -X PATCH http://localhost:3007/api/v1/profiles/applicant/privacy \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"allowAiTraining": false}'
```

---

## 📋 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/v1/profiles/applicant/privacy` | Get privacy settings |
| PATCH | `/api/v1/profiles/applicant/privacy` | Update privacy settings |

---

## 🎛️ Privacy Controls

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `allowAiTraining` | boolean | `true` | AI model training |
| `allowProfileIndexing` | boolean | `true` | Search visibility |
| `allowDataAnalytics` | boolean | `true` | Platform analytics |
| `allowThirdPartySharing` | boolean | `false` | Partner sharing |

---

## 💡 Example Requests

### Get Settings

```bash
GET /api/v1/profiles/applicant/privacy
Authorization: Bearer {token}
```

**Response**:
```json
{
  "userId": "...",
  "allowAiTraining": true,
  "allowProfileIndexing": true,
  "allowDataAnalytics": true,
  "allowThirdPartySharing": false,
  "privacyUpdatedAt": null
}
```

### Update Settings

```bash
PATCH /api/v1/profiles/applicant/privacy
Authorization: Bearer {token}
Content-Type: application/json

{
  "allowAiTraining": false,
  "allowDataAnalytics": false
}
```

**Response**:
```json
{
  "userId": "...",
  "allowAiTraining": false,
  "allowProfileIndexing": true,
  "allowDataAnalytics": false,
  "allowThirdPartySharing": false,
  "privacyUpdatedAt": "2024-01-15T11:45:23.456Z"
}
```

---

## 📚 Full Documentation

- **Implementation Guide**: `PRIVACY_SETTINGS_IMPLEMENTATION.md`
- **API Reference**: `PRIVACY_SETTINGS_API.md`
- **Complete Summary**: `PRIVACY_FEATURE_COMPLETE.md`
- **Swagger UI**: http://localhost:3007/api/docs

---

## ✅ Verification Checklist

- [ ] Migration ran successfully
- [ ] Backend started without errors
- [ ] Can GET privacy settings
- [ ] Can PATCH privacy settings
- [ ] `privacyUpdatedAt` timestamp updates
- [ ] Swagger docs show new endpoints
- [ ] Logs show privacy changes

---

## 🆘 Troubleshooting

### Migration Failed

```bash
# Check migration status
npm run db:migration:show

# Revert if needed
npm run db:migration:revert

# Try again
npm run db:migration:run
```

### 401 Unauthorized

- Check JWT token is valid
- Token must be from an applicant user
- Use Bearer token format: `Bearer {token}`

### 404 Not Found

- Ensure user has an applicant profile
- Check user role is `applicant`

---

**Need Help?** Check the full documentation files or contact the dev team.



