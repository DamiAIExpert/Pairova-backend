# Backend Field Support Analysis for Edit Account Form

## Summary

Based on the backend code review, here's what fields are **supported** and what's **missing**:

---

## ✅ **SUPPORTED FIELDS**

### 1. **Account Section**
- ✅ **Photo Upload** (`photoUrl`) - Supported via `UpdateApplicantProfileDto`
- ✅ **Country** - Supported via `UpdateApplicantProfileDto`
- ❌ **Work Position** - **NOT SUPPORTED** (field doesn't exist in backend)

### 2. **Personal Information Section**
- ✅ **First Name** - Supported via `UpdateApplicantProfileDto`
- ✅ **Last Name** - Supported via `UpdateApplicantProfileDto`
- ✅ **Email** - Stored in `User` entity (read-only, can't be changed)
- ✅ **Phone** - Stored in `User` entity (can be updated via user update endpoint)
- ✅ **Date of Birth** - Supported via `UpdateApplicantProfileDto`
- ❌ **Language** - **NOT SUPPORTED** (field doesn't exist)
- ✅ **Gender** - Supported via `UpdateApplicantProfileDto` (enum: MALE, FEMALE)
- ❌ **Language Proficiency** - **NOT SUPPORTED** (field doesn't exist)

### 3. **Address Section**
- ✅ **City** - Supported via `UpdateApplicantProfileDto`
- ✅ **State** - Supported via `UpdateApplicantProfileDto`
- ❌ **Postal Code** - **NOT SUPPORTED** (field doesn't exist)
- ❌ **Tax ID** - **NOT SUPPORTED** (field doesn't exist)
- ✅ **Country** - Supported via `UpdateApplicantProfileDto` (duplicate of Account section)
- ❌ **Select City** (dropdown) - **NOT SUPPORTED** (field doesn't exist, only free-text `city`)

### 4. **Bio Section**
- ✅ **Bio** - Supported via `UpdateApplicantProfileDto` (with validation: 10-500 characters)
- ⚠️ **Note**: Current validation requires **minimum 10 characters**, but form allows shorter text

### 5. **Attach Files Section**
- ✅ **File Uploads** - Supported via `/uploads/simple` endpoint
- ✅ Files are stored in `uploads` table with `kind` field
- ✅ Can store multiple files per user

### 6. **Education Section**
- ✅ **School** - Supported via `CreateEducationDto`
- ✅ **Degree** - Supported via `CreateEducationDto`
- ✅ **Course** (`fieldOfStudy`) - Supported via `CreateEducationDto`
- ✅ **Grade** - Supported via `CreateEducationDto`
- ✅ **Start Date** - Supported via `CreateEducationDto`
- ✅ **End Date** - Supported via `CreateEducationDto`
- ❌ **Role** - **NOT SUPPORTED** (field doesn't exist in DTO or entity)
- ❌ **Description** - **NOT SUPPORTED** (field doesn't exist in DTO or entity)

### 7. **Certificates Section**
- ✅ **Certificate Name** - Supported via `CreateCertificationDto`
- ✅ **Issuing Organization** (`issuer`) - Supported via `CreateCertificationDto`
- ✅ **Issue Date** - Supported via `CreateCertificationDto`
- ✅ **Credential URL** - Supported via `CreateCertificationDto`
- ❌ **Credential ID** - **NOT SUPPORTED** (field doesn't exist)
- ⚠️ **File Upload**: Certificates can be uploaded via `/uploads/simple`, but there's no direct link between uploads and certifications table

### 8. **Experience Section**
- ✅ **Employment Type** - Supported via `CreateExperienceDto` (enum: FULL_TIME, PART_TIME, CONTRACT, VOLUNTEER, INTERNSHIP)
- ✅ **Company Name** (`company`) - Supported via `CreateExperienceDto`
- ✅ **Job Role** (`roleTitle`) - Supported via `CreateExperienceDto`
- ✅ **Start Date** - Supported via `CreateExperienceDto`
- ✅ **End Date** - Supported via `CreateExperienceDto`
- ✅ **Description** - Supported via `CreateExperienceDto`
- ✅ **Location City** (`locationCity`) - Supported via `CreateExperienceDto`
- ⚠️ **Location State** (`locationState`) - **PARTIALLY SUPPORTED** (exists in entity, but NOT in DTO)
- ⚠️ **Location Country** (`locationCountry`) - **PARTIALLY SUPPORTED** (exists in entity, but NOT in DTO)
- ❌ **Postal Code** - **NOT SUPPORTED** (field doesn't exist)
- ❌ **Same as company address** (checkbox) - **NOT SUPPORTED** (logic doesn't exist)

### 9. **Skills Section**
- ⚠️ **Skills Array** - **PARTIALLY SUPPORTED**
  - Field exists in `ApplicantProfile` entity as `skills: string[]`
  - ❌ **NOT in `UpdateApplicantProfileDto`** (needs to be added to DTO)
  - Currently can't be updated via profile update endpoint

---

## ❌ **MISSING FIELDS** (Need Backend Changes)

### High Priority (Commonly Used Fields)
1. **Work Position** - Need to add to `ApplicantProfile` entity and `UpdateApplicantProfileDto`
2. **Skills Array** - Need to add to `UpdateApplicantProfileDto` (entity already has it)
3. **Phone** - Need to ensure it can be updated (might need separate user update endpoint)
4. **Postal Code** - Need to add to `ApplicantProfile` entity and `UpdateApplicantProfileDto`
5. **Education Role** - Need to add to `Education` entity and `CreateEducationDto`
6. **Education Description** - Need to add to `Education` entity and `CreateEducationDto`
7. **Experience Location State** - Need to add to `CreateExperienceDto` (entity has it)
8. **Experience Location Country** - Need to add to `CreateExperienceDto` (entity has it)
9. **Experience Postal Code** - Need to add to `Experience` entity and `CreateExperienceDto`
10. **Certification Credential ID** - Need to add to `Certification` entity and `CreateCertificationDto`

### Low Priority (Optional/Nice to Have)
1. **Language** - Add language preference field
2. **Language Proficiency** - Add proficiency level field
3. **Tax ID** - Add tax identification field
4. **Select City** (dropdown) - This is more of a UI enhancement, backend can use free-text `city`

---

## 🔧 **REQUIRED BACKEND CHANGES**

### 1. Update `UpdateApplicantProfileDto`
```typescript
// Add these fields:
@IsArray()
@IsString({ each: true })
@IsOptional()
skills?: string[];

@IsString()
@IsOptional()
workPosition?: string;

@IsString()
@IsOptional()
postalCode?: string;

@IsString()
@IsOptional()
phone?: string; // Or handle via separate user update
```

### 2. Update `CreateEducationDto`
```typescript
// Add these fields:
@IsString()
@IsOptional()
role?: string;

@IsString()
@IsOptional()
description?: string;
```

### 3. Update `CreateExperienceDto`
```typescript
// Add these fields:
@IsString()
@IsOptional()
locationState?: string;

@IsString()
@IsOptional()
locationCountry?: string;

@IsString()
@IsOptional()
postalCode?: string;
```

### 4. Update `CreateCertificationDto`
```typescript
// Add this field:
@IsString()
@IsOptional()
credentialId?: string;
```

### 5. Update Entities (if fields don't exist)
- Add `workPosition` to `ApplicantProfile`
- Add `postalCode` to `ApplicantProfile`
- Add `role` and `description` to `Education`
- Add `postalCode` to `Experience`
- Add `credentialId` to `Certification`

---

## 📝 **CURRENT WORKAROUNDS**

1. **Skills**: Can't be updated via profile update endpoint (need to add to DTO)
2. **Education Role/Description**: Frontend collects but won't be saved (fields don't exist)
3. **Experience Location State/Country**: Entity has fields but DTO doesn't accept them
4. **Work Position**: Frontend collects but won't be saved (field doesn't exist)
5. **Postal Code**: Frontend collects but won't be saved (field doesn't exist)
6. **Tax ID**: Frontend collects but won't be saved (field doesn't exist)
7. **Certification Credential ID**: Frontend collects but won't be saved (field doesn't exist)

---

## ✅ **RECOMMENDATIONS**

### Immediate Actions:
1. **Add `skills` array to `UpdateApplicantProfileDto`** (entity already supports it)
2. **Add `workPosition` to `ApplicantProfile` entity and DTO**
3. **Add `postalCode` to `ApplicantProfile` entity and DTO**
4. **Add `locationState` and `locationCountry` to `CreateExperienceDto`** (entities already have these)
5. **Add `role` and `description` to `Education` entity and DTO**
6. **Add `postalCode` to `Experience` entity and DTO**
7. **Add `credentialId` to `Certification` entity and DTO**

### Optional Enhancements:
- Add `language` and `languageProficiency` fields
- Add `taxId` field
- Link certificate file uploads to certification records
- Add validation for bio minimum length (currently 10 chars, might be too restrictive)

---

## 🎯 **CONCLUSION**

**Approximately 70% of the form fields are supported by the backend.** The main gaps are:
- Work Position
- Skills (in update DTO)
- Postal Code (both profile and experience)
- Education Role & Description
- Experience Location State/Country (in DTO)
- Certification Credential ID
- Tax ID
- Language fields

Most of these can be easily added to the backend with minimal changes to existing code.















