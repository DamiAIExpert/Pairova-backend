# Privacy Settings API Reference

## Overview

The Privacy Settings API allows job seekers to manage their data privacy preferences on the Pairova platform.

## Base URL

```
https://api.pairova.com/api/v1
```

For development:
```
http://localhost:3007/api/v1
```

---

## Authentication

All endpoints require JWT authentication via Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Get Privacy Settings

Retrieve the current privacy settings for the authenticated applicant.

**Endpoint**: `GET /profiles/applicant/privacy`

**Authorization**: Required (Applicant role)

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response**: `200 OK`

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "allowAiTraining": true,
  "allowProfileIndexing": true,
  "allowDataAnalytics": true,
  "allowThirdPartySharing": false,
  "privacyUpdatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string (UUID) | Unique identifier of the applicant |
| `allowAiTraining` | boolean | Whether data can be used for AI model training |
| `allowProfileIndexing` | boolean | Whether profile appears in search results |
| `allowDataAnalytics` | boolean | Whether data is used for analytics |
| `allowThirdPartySharing` | boolean | Whether data can be shared with partners |
| `privacyUpdatedAt` | string (ISO 8601) | Timestamp of last privacy update (nullable) |

**Error Responses**:

| Status Code | Description |
|-------------|-------------|
| `401 Unauthorized` | Missing or invalid JWT token |
| `403 Forbidden` | User is not an applicant |
| `404 Not Found` | Applicant profile not found |

**Example cURL**:

```bash
curl -X GET "http://localhost:3007/api/v1/profiles/applicant/privacy" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

### 2. Update Privacy Settings

Update one or more privacy settings for the authenticated applicant.

**Endpoint**: `PATCH /profiles/applicant/privacy`

**Authorization**: Required (Applicant role)

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:

All fields are optional. Only include fields you want to update.

```json
{
  "allowAiTraining": false,
  "allowProfileIndexing": true,
  "allowDataAnalytics": false,
  "allowThirdPartySharing": false
}
```

**Request Body Schema**:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `allowAiTraining` | boolean | No | true | Allow AI model training |
| `allowProfileIndexing` | boolean | No | true | Allow profile indexing |
| `allowDataAnalytics` | boolean | No | true | Allow data analytics |
| `allowThirdPartySharing` | boolean | No | false | Allow third-party sharing |

**Response**: `200 OK`

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "allowAiTraining": false,
  "allowProfileIndexing": true,
  "allowDataAnalytics": false,
  "allowThirdPartySharing": false,
  "privacyUpdatedAt": "2024-01-15T11:45:23.456Z"
}
```

**Error Responses**:

| Status Code | Description |
|-------------|-------------|
| `400 Bad Request` | Invalid request body (non-boolean values) |
| `401 Unauthorized` | Missing or invalid JWT token |
| `403 Forbidden` | User is not an applicant |
| `404 Not Found` | Applicant profile not found |

**Example cURL**:

```bash
curl -X PATCH "http://localhost:3007/api/v1/profiles/applicant/privacy" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "allowAiTraining": false,
    "allowDataAnalytics": false
  }'
```

---

## Privacy Settings Explained

### AI Model Training (`allowAiTraining`)

**What it controls**: Whether your profile data can be used to train and improve AI matching algorithms.

**When enabled**:
- Your data helps improve job matching accuracy
- Better recommendations for all users
- Contributes to platform improvement

**When disabled**:
- Minimal data sent to AI services
- Only essential matching performed
- May result in less accurate job matches

**Default**: `true` (enabled)

---

### Profile Indexing (`allowProfileIndexing`)

**What it controls**: Whether your profile appears in employer searches and recommendations.

**When enabled**:
- Employers can find your profile
- You appear in job match results
- Maximum job opportunities

**When disabled**:
- Profile hidden from employer searches
- You can still apply to jobs manually
- Reduced visibility to employers

**Default**: `true` (enabled)

---

### Data Analytics (`allowDataAnalytics`)

**What it controls**: Whether your data is included in platform analytics and insights.

**When enabled**:
- Helps improve platform features
- Contributes to market insights
- Supports better user experience

**When disabled**:
- Data excluded from analytics
- No contribution to aggregate statistics
- May limit personalized features

**Default**: `true` (enabled)

---

### Third-Party Sharing (`allowThirdPartySharing`)

**What it controls**: Whether your data can be shared with trusted third-party partners.

**When enabled**:
- Access to partner job boards
- Additional job opportunities
- Extended network reach

**When disabled**:
- Data stays within Pairova platform
- No external sharing
- Maximum privacy

**Default**: `false` (disabled)

---

## Use Cases

### Example 1: Disable All Data Usage

```bash
curl -X PATCH "http://localhost:3007/api/v1/profiles/applicant/privacy" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "allowAiTraining": false,
    "allowProfileIndexing": false,
    "allowDataAnalytics": false,
    "allowThirdPartySharing": false
  }'
```

**Result**: Maximum privacy, but limited platform features and job visibility.

---

### Example 2: Enable AI Training Only

```bash
curl -X PATCH "http://localhost:3007/api/v1/profiles/applicant/privacy" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "allowAiTraining": true,
    "allowProfileIndexing": false,
    "allowDataAnalytics": false,
    "allowThirdPartySharing": false
  }'
```

**Result**: Better job matches while maintaining profile privacy.

---

### Example 3: Check Current Settings

```bash
curl -X GET "http://localhost:3007/api/v1/profiles/applicant/privacy" \
  -H "Authorization: Bearer $TOKEN"
```

**Result**: View all current privacy settings.

---

## Rate Limiting

- **Rate Limit**: 100 requests per minute per user
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

---

## Versioning

Current API version: `v1`

Version is included in the URL path: `/api/v1/...`

---

## Support

- **API Documentation**: https://api.pairova.com/docs
- **Support Email**: support@pairova.com
- **Developer Portal**: https://developers.pairova.com

---

## Changelog

### Version 1.0.0 (January 2025)
- Initial release of Privacy Settings API
- Four privacy controls: AI training, profile indexing, analytics, third-party sharing
- Audit logging for all privacy changes

---

**Last Updated**: January 2025  
**API Version**: 1.0.0



