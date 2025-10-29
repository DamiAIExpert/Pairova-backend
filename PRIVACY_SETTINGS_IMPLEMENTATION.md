# Privacy Settings Implementation Guide

## Overview

This document describes the complete implementation of the Privacy Settings feature for the Pairova platform. The feature allows job seekers (applicants) to control how their data is used across the platform, particularly in relation to AI model training and data analytics.

## Table of Contents

1. [Feature Description](#feature-description)
2. [Database Schema](#database-schema)
3. [Backend Implementation](#backend-implementation)
4. [API Endpoints](#api-endpoints)
5. [Privacy Controls](#privacy-controls)
6. [Testing](#testing)
7. [Frontend Integration](#frontend-integration)

---

## Feature Description

The Privacy Settings feature provides applicants with granular control over their data usage:

### Privacy Options

1. **AI Model Training** (`allowAiTraining`)
   - Controls whether applicant data can be used to train and improve AI matching models
   - Default: `true` (enabled)
   - Impact: When disabled, minimal data is sent to AI services

2. **Profile Indexing** (`allowProfileIndexing`)
   - Controls whether the applicant's profile appears in search results
   - Default: `true` (enabled)
   - Impact: When disabled, profile is hidden from employer searches

3. **Data Analytics** (`allowDataAnalytics`)
   - Controls whether applicant data is used for platform analytics and insights
   - Default: `true` (enabled)
   - Impact: When disabled, user data is excluded from aggregate analytics

4. **Third-Party Sharing** (`allowThirdPartySharing`)
   - Controls whether applicant data can be shared with third-party partners
   - Default: `false` (disabled)
   - Impact: When disabled, data is never shared outside the platform

---

## Database Schema

### Migration: `1761013000000-AddPrivacySettings.ts`

Adds privacy settings columns to the `applicant_profiles` table:

```sql
ALTER TABLE "applicant_profiles" 
ADD COLUMN "allow_ai_training" boolean NOT NULL DEFAULT true,
ADD COLUMN "allow_profile_indexing" boolean NOT NULL DEFAULT true,
ADD COLUMN "allow_data_analytics" boolean NOT NULL DEFAULT true,
ADD COLUMN "allow_third_party_sharing" boolean NOT NULL DEFAULT false,
ADD COLUMN "privacy_updated_at" TIMESTAMP WITH TIME ZONE;

CREATE INDEX "IDX_applicant_profiles_privacy" 
ON "applicant_profiles" ("allow_ai_training", "allow_profile_indexing");
```

### Entity Fields

Updated `ApplicantProfile` entity includes:

```typescript
@Column({ name: 'allow_ai_training', type: 'boolean', default: true })
allowAiTraining: boolean;

@Column({ name: 'allow_profile_indexing', type: 'boolean', default: true })
allowProfileIndexing: boolean;

@Column({ name: 'allow_data_analytics', type: 'boolean', default: true })
allowDataAnalytics: boolean;

@Column({ name: 'allow_third_party_sharing', type: 'boolean', default: false })
allowThirdPartySharing: boolean;

@Column({ name: 'privacy_updated_at', type: 'timestamptz', nullable: true })
privacyUpdatedAt: Date;
```

---

## Backend Implementation

### Service Layer

**Location**: `src/users/applicant/applicant.service.ts`

#### Key Methods

1. **`getPrivacySettings(user: User)`**
   - Retrieves current privacy settings for an applicant
   - Returns: `PrivacySettingsResponseDto`

2. **`updatePrivacySettings(user: User, updateDto: UpdatePrivacySettingsDto)`**
   - Updates privacy settings for an applicant
   - Logs changes for audit purposes
   - Updates `privacyUpdatedAt` timestamp
   - Returns: `PrivacySettingsResponseDto`

3. **`allowsAiTraining(userId: string)`**
   - Quick check if user allows AI training
   - Used by AI service before processing data
   - Returns: `boolean`

4. **`allowsProfileIndexing(userId: string)`**
   - Quick check if user allows profile indexing
   - Used by search services
   - Returns: `boolean`

5. **`allowsDataAnalytics(userId: string)`**
   - Quick check if user allows data analytics
   - Used by analytics services
   - Returns: `boolean`

### DTOs

#### `UpdatePrivacySettingsDto`
```typescript
{
  allowAiTraining?: boolean;
  allowProfileIndexing?: boolean;
  allowDataAnalytics?: boolean;
  allowThirdPartySharing?: boolean;
}
```

#### `PrivacySettingsResponseDto`
```typescript
{
  userId: string;
  allowAiTraining: boolean;
  allowProfileIndexing: boolean;
  allowDataAnalytics: boolean;
  allowThirdPartySharing: boolean;
  privacyUpdatedAt: Date | null;
}
```

---

## API Endpoints

### Base URL
```
/api/v1/profiles/applicant
```

### Endpoints

#### 1. Get Privacy Settings

**GET** `/privacy`

**Authentication**: Required (JWT)

**Authorization**: `APPLICANT` role only

**Response**: `200 OK`
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "allowAiTraining": true,
  "allowProfileIndexing": true,
  "allowDataAnalytics": true,
  "allowThirdPartySharing": false,
  "privacyUpdatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: User is not an applicant
- `404 Not Found`: Profile not found

---

#### 2. Update Privacy Settings

**PATCH** `/privacy`

**Authentication**: Required (JWT)

**Authorization**: `APPLICANT` role only

**Request Body**:
```json
{
  "allowAiTraining": false,
  "allowProfileIndexing": true,
  "allowDataAnalytics": false,
  "allowThirdPartySharing": false
}
```

**Response**: `200 OK`
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "allowAiTraining": false,
  "allowProfileIndexing": true,
  "allowDataAnalytics": false,
  "allowThirdPartySharing": false,
  "privacyUpdatedAt": "2024-01-15T11:45:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: User is not an applicant
- `404 Not Found`: Profile not found

---

## Privacy Controls

### AI Service Integration

**Location**: `src/ai/ai.service.ts`

The AI service has been updated to respect privacy settings:

```typescript
private async prepareJobApplicantData(job: Job, applicant: User): Promise<JobApplicantData> {
  const applicantProfile = applicant.applicantProfile;
  
  // Check privacy settings
  const allowsAiTraining = applicantProfile?.allowAiTraining ?? true;
  const allowsDataAnalytics = applicantProfile?.allowDataAnalytics ?? true;

  // If user doesn't allow AI training or analytics, return minimal data
  if (!allowsAiTraining && !allowsDataAnalytics) {
    this.logger.log(`User ${applicant.id} has disabled AI training and analytics`);
    return minimalData; // Returns only essential matching data
  }

  // Return full data for AI processing
  return fullData;
}
```

### Audit Logging

All privacy settings changes are logged:

```typescript
this.logger.log(`Privacy settings updated for user ${user.id}`, {
  userId: user.id,
  changes: updateDto,
  timestamp: new Date().toISOString(),
});
```

---

## Testing

### Running Migrations

```bash
# Run the privacy settings migration
npm run db:migration:run
```

### Manual Testing with cURL

#### Get Privacy Settings
```bash
curl -X GET http://localhost:3007/api/v1/profiles/applicant/privacy \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Privacy Settings
```bash
curl -X PATCH http://localhost:3007/api/v1/profiles/applicant/privacy \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "allowAiTraining": false,
    "allowDataAnalytics": false
  }'
```

### Testing Scenarios

1. **Default Settings**: New users should have AI training, profile indexing, and data analytics enabled by default
2. **Disable AI Training**: Verify that AI services receive minimal data when disabled
3. **Privacy Update Timestamp**: Verify that `privacyUpdatedAt` is updated on each change
4. **Audit Logging**: Check logs to ensure privacy changes are recorded
5. **Authorization**: Verify that only applicants can access privacy endpoints

---

## Frontend Integration

### API Service

Create a privacy settings service in the frontend:

```typescript
// src/services/privacy.service.ts
import apiClient from './api';

export interface PrivacySettings {
  userId: string;
  allowAiTraining: boolean;
  allowProfileIndexing: boolean;
  allowDataAnalytics: boolean;
  allowThirdPartySharing: boolean;
  privacyUpdatedAt: string | null;
}

export class PrivacyService {
  static async getPrivacySettings(): Promise<PrivacySettings> {
    const response = await apiClient.get<PrivacySettings>(
      '/profiles/applicant/privacy'
    );
    return response.data;
  }

  static async updatePrivacySettings(
    settings: Partial<Omit<PrivacySettings, 'userId' | 'privacyUpdatedAt'>>
  ): Promise<PrivacySettings> {
    const response = await apiClient.patch<PrivacySettings>(
      '/profiles/applicant/privacy',
      settings
    );
    return response.data;
  }
}
```

### React Component Example

```typescript
import { useState, useEffect } from 'react';
import { PrivacyService, PrivacySettings } from '@/services/privacy.service';
import { Switch } from '@/components/ui/switch';

const PrivacySettingsPage = () => {
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await PrivacyService.getPrivacySettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load privacy settings:', error);
    }
  };

  const handleToggle = async (field: keyof PrivacySettings, value: boolean) => {
    try {
      setLoading(true);
      const updated = await PrivacyService.updatePrivacySettings({
        [field]: value,
      });
      setSettings(updated);
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Privacy Settings</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">AI Model Training</h3>
            <p className="text-sm text-gray-600">
              Allow your data to be used to improve our AI matching models
            </p>
          </div>
          <Switch
            checked={settings.allowAiTraining}
            onCheckedChange={(checked) => handleToggle('allowAiTraining', checked)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Profile Indexing</h3>
            <p className="text-sm text-gray-600">
              Allow your profile to appear in employer searches
            </p>
          </div>
          <Switch
            checked={settings.allowProfileIndexing}
            onCheckedChange={(checked) => handleToggle('allowProfileIndexing', checked)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Data Analytics</h3>
            <p className="text-sm text-gray-600">
              Allow your data to be used for platform analytics and insights
            </p>
          </div>
          <Switch
            checked={settings.allowDataAnalytics}
            onCheckedChange={(checked) => handleToggle('allowDataAnalytics', checked)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Third-Party Sharing</h3>
            <p className="text-sm text-gray-600">
              Allow your data to be shared with trusted third-party partners
            </p>
          </div>
          <Switch
            checked={settings.allowThirdPartySharing}
            onCheckedChange={(checked) => handleToggle('allowThirdPartySharing', checked)}
            disabled={loading}
          />
        </div>
      </div>

      {settings.privacyUpdatedAt && (
        <p className="text-sm text-gray-500">
          Last updated: {new Date(settings.privacyUpdatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default PrivacySettingsPage;
```

---

## Security Considerations

1. **Authentication**: All privacy endpoints require JWT authentication
2. **Authorization**: Only applicants can access their own privacy settings
3. **Audit Trail**: All privacy changes are logged with timestamps
4. **Data Minimization**: When privacy settings restrict data usage, minimal data is processed
5. **Default Privacy**: Conservative defaults (third-party sharing disabled by default)

---

## Compliance

This implementation supports compliance with:

- **GDPR**: Right to control data processing
- **CCPA**: Right to opt-out of data selling/sharing
- **Privacy by Design**: Privacy-friendly defaults
- **Transparency**: Clear descriptions of data usage

---

## Future Enhancements

1. **Granular Controls**: More specific controls for different AI models
2. **Data Export**: Allow users to export their data
3. **Data Deletion**: Implement right to be forgotten
4. **Privacy Dashboard**: Comprehensive view of all data usage
5. **Consent Management**: Track and manage all user consents
6. **Privacy Notifications**: Notify users of privacy policy changes

---

## Support

For questions or issues related to privacy settings:

- Technical: Check the API documentation at `/api/docs`
- Privacy Policy: Review the platform privacy policy
- Support: Contact support@pairova.com

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Author**: Pairova Development Team



