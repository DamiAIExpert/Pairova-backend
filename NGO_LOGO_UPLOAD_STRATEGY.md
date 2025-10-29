# 🖼️ NGO Logo Upload Strategy & Best Practices

## **Current Situation**

You noticed the NGO onboarding endpoint accepts `logoUrl` as a **string**, but you're not sure about the best approach for handling file uploads.

**Current Response:**
```json
{
  "logoUrl": null,  // ← Not being set even though string was sent
  "orgName": "Save the Children Foundation",
  ...
}
```

---

## **✅ Recommended Approach: Two-Step Upload Process**

Based on your existing infrastructure and industry best practices, here's the recommended approach:

### **Architecture:**
```
1. User selects logo file in frontend
   ↓
2. Frontend uploads logo to: POST /profiles/uploads
   ↓
3. Backend uploads to Cloudinary
   ↓
4. Backend saves record in file_uploads table
   ↓
5. Backend returns Cloudinary URL
   ↓
6. Frontend includes URL in onboarding data
   ↓
7. Backend saves URL to nonprofit_orgs.logo_url
```

---

## **Why This Approach? (Industry Best Practices)**

### **✅ Advantages:**

1. **Separation of Concerns**
   - File upload is separate from data submission
   - Each endpoint does one thing well
   - Easier to debug and maintain

2. **Better User Experience**
   - User can see logo preview immediately after upload
   - Can change logo before final submission
   - Doesn't lose logo if form submission fails

3. **Performance**
   - File uploads are resource-intensive
   - Separating them prevents timeout on main onboarding endpoint
   - Can upload large files without blocking form submission

4. **Security**
   - File validation happens in dedicated upload endpoint
   - Malicious files caught early
   - Onboarding endpoint only accepts validated URLs

5. **Scalability**
   - Cloudinary handles CDN, transformations, optimization
   - Your server doesn't store files (saves disk space)
   - Automatic image optimization and resizing
   - Global CDN for fast loading worldwide

6. **Flexibility**
   - Can upload logo at any step (not just Step 1)
   - Can update logo later without re-submitting entire onboarding
   - Multiple upload endpoints for different file types

---

## **Your Existing Infrastructure** ✅

Good news! You already have everything set up:

### **1. Storage Module** ✅
- **Location:** `pairova-backend/src/storage/`
- **Features:**
  - Multi-provider support (Cloudinary, AWS S3, Google Cloud)
  - Provider factory pattern
  - Automatic provider selection
  - Health monitoring
  - Usage tracking

### **2. Cloudinary Integration** ✅
- **Service:** `CloudinaryStorageService`
- **Features:**
  - Auto upload to Cloudinary
  - Thumbnail generation
  - Image transformations
  - Secure URLs
  - Public ID management

### **3. File Upload Endpoint** ✅
- **Endpoint:** `POST /profiles/uploads`
- **Controller:** `UploadController`
- **Features:**
  - JWT authentication
  - File type validation
  - Size limits (10MB)
  - Memory storage (no disk writes)
  - Automatic Cloudinary upload

### **4. Database Tracking** ✅
- **Table:** `file_uploads`
- **Features:**
  - Tracks all uploaded files
  - Links files to users
  - Stores Cloudinary public_id
  - Metadata storage
  - Soft deletes

---

## **🔧 Implementation Steps**

### **Backend (Already Done!** ✅**)**

Your existing upload endpoint handles everything:

```typescript
POST /profiles/uploads
Authorization: Bearer <token>
Content-Type: multipart/form-data

// Form data:
file: <logo file>
kind: "logo"  // or "avatar"
```

**Response:**
```json
{
  "id": "uuid",
  "filename": "logo.png",
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234/pairova/logo.png",
  "thumbnailUrl": "https://res.cloudinary.com/...",
  "publicId": "pairova/timestamp_randomid",
  "size": 125000,
  "mimeType": "image/png",
  "fileType": "OTHER"
}
```

### **Frontend Implementation** (Needs Update)

#### **Step 1: Add Logo Upload UI to Account Info Form**

Update `pairova-frontend/src/components/nonProfile/onboarding/account.tsx`:

```typescript
const [formData, setFormData] = useState({
  companyName: "",
  country: "",
  profilePhoto: null as File | null,
  logoUrl: "", // ← Add this to store Cloudinary URL
});

const [uploading, setUploading] = useState(false);
const [uploadError, setUploadError] = useState("");

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file size (2MB max for logo)
  if (file.size > 2 * 1024 * 1024) {
    setUploadError("Logo must be less than 2MB");
    return;
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    setUploadError("Logo must be JPG, PNG, or SVG");
    return;
  }

  try {
    setUploading(true);
    setUploadError("");

    // Upload to backend
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/profiles/uploads?kind=logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Save the Cloudinary URL
    setFormData(prev => ({
      ...prev,
      profilePhoto: file,
      logoUrl: response.data.url, // ← Save Cloudinary URL
    }));

    console.log('✅ Logo uploaded to Cloudinary:', response.data.url);
  } catch (err: any) {
    console.error('Failed to upload logo:', err);
    setUploadError(err.response?.data?.message || 'Failed to upload logo');
  } finally {
    setUploading(false);
  }
};

// In the submit handler:
const handleSubmit = async () => {
  try {
    setLoading(true);

    await NonprofitService.updateProfileStep({
      orgName: formData.companyName,
      country: formData.country,
      logoUrl: formData.logoUrl, // ← Include the Cloudinary URL
    });

    // Mark complete and navigate...
  } catch (err) {
    // Error handling...
  }
};
```

#### **Step 2: Update UI to Show Upload Status**

```tsx
<div className="flex flex-col md:flex-row items-center gap-8">
  {/* Logo Preview */}
  <div className="w-[120px] h-[120px] border-2 border-dashed border-black/30 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
    {formData.logoUrl ? (
      <img
        src={formData.logoUrl}  // ← Show Cloudinary URL
        alt="Organization Logo"
        className="w-full h-full object-contain"
      />
    ) : formData.profilePhoto ? (
      <img
        src={URL.createObjectURL(formData.profilePhoto)}
        alt="Organization Logo Preview"
        className="w-full h-full object-contain"
      />
    ) : (
      <div className="text-center p-4">
        <Icon icon="mdi:office-building" className="text-4xl text-gray-400 mx-auto mb-2" />
        <p className="text-xs text-gray-500">No Logo</p>
      </div>
    )}
  </div>

  {/* Upload Button */}
  <div className="flex flex-col gap-4">
    <div className="border border-black/30 rounded-md py-3 px-8 cursor-pointer hover:bg-gray-50 transition-colors">
      <label htmlFor="upload" className="cursor-pointer">
        <input
          type="file"
          id="upload"
          accept="image/jpeg,image/jpg,image/png,image/svg+xml"
          className="hidden w-full"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <p>{uploading ? 'Uploading...' : 'Upload Logo'}</p>
      </label>
    </div>

    {uploading && (
      <div className="flex items-center gap-2">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <span className="text-sm text-gray-600">Uploading to cloud...</span>
      </div>
    )}

    {uploadError && (
      <p className="text-sm text-red-600">{uploadError}</p>
    )}

    {formData.logoUrl && (
      <p className="text-sm text-green-600">✅ Logo uploaded successfully!</p>
    )}

    {formData.logoUrl && (
      <button
        className="bg-black py-3 px-8 rounded-md text-white hover:bg-gray-800 transition-colors"
        onClick={() => setFormData(prev => ({ ...prev, logoUrl: "", profilePhoto: null }))}
        disabled={uploading}
      >
        Remove Logo
      </button>
    )}
  </div>
</div>

<p className="text-xs text-gray-500 mt-2">
  Upload your organization's logo (PNG, JPG, SVG recommended, max 2MB)
</p>
```

---

## **🔒 Security & Validation**

### **Backend Validation** (Already Implemented ✅)

Your existing upload endpoint includes:

```typescript
// File size limit: 10MB
new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })

// File type validation
new FileTypeValidator({
  fileType: /(image\/jpeg|image\/png|application\/pdf)/,
})
```

### **Recommended Logo-Specific Validation**

Update the upload endpoint to have stricter validation for logos:

```typescript
// For logos specifically:
- Max size: 2MB (logos should be smaller)
- Allowed types: image/jpeg, image/png, image/svg+xml
- Min dimensions: 200x200px
- Max dimensions: 2000x2000px
- Aspect ratio: Square preferred
```

### **Cloudinary Automatic Optimizations** ✅

Cloudinary automatically:
- ✅ Converts to WebP for supported browsers
- ✅ Optimizes file size
- ✅ Generates responsive images
- ✅ Creates thumbnails
- ✅ Protects from malicious files
- ✅ Serves via CDN (fast worldwide)

---

## **📊 Database Schema**

### **Current Schema** ✅

```sql
-- nonprofit_orgs table
CREATE TABLE nonprofit_orgs (
  logo_url TEXT NULL,  -- ✅ Already exists, stores Cloudinary URL
  ...
);

-- file_uploads table (tracks all uploads)
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY,
  filename VARCHAR NOT NULL,
  url VARCHAR NOT NULL,         -- Cloudinary secure_url
  thumbnail_url VARCHAR NULL,   -- Cloudinary thumbnail
  public_id VARCHAR NULL,        -- For deletion from Cloudinary
  user_id UUID,
  file_type ENUM('OTHER', 'IMAGE', 'DOCUMENT'),
  size BIGINT,
  mime_type VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP,
  ...
);
```

### **Data Flow:**

```
1. Logo uploaded → Cloudinary
2. Cloudinary returns:
   - url: "https://res.cloudinary.com/pairova/image/upload/v1234/logo.png"
   - publicId: "pairova/1234_xyz"
   
3. Save to file_uploads table:
   - id: uuid
   - url: Cloudinary URL
   - publicId: pairova/1234_xyz
   - userId: NGO user ID
   
4. Save to nonprofit_orgs table:
   - logoUrl: Cloudinary URL (same as above)
   
5. Frontend displays: <img src="Cloudinary URL" />
```

---

## **💰 Cost Considerations**

### **Cloudinary Free Tier:**
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ 25,000 transformations/month
- ✅ More than enough for most NGO platforms

### **Scalability:**
If you exceed free tier, Cloudinary pricing is very competitive:
- Storage: ~$0.18/GB/month
- Bandwidth: ~$0.08/GB
- Transformations: Included

### **Alternative: Local Storage**
- ❌ Your server pays for bandwidth
- ❌ No CDN (slower for global users)
- ❌ No automatic optimization
- ❌ No automatic backups
- ❌ Server disk space costs

**Verdict:** Cloudinary is the better choice for NGO logos! ✅

---

## **🧪 Testing Checklist**

- [ ] Upload logo in Account Info form (Step 1)
- [ ] Verify logo appears in preview
- [ ] Verify logo uploaded to Cloudinary
- [ ] Verify URL saved to database
- [ ] Verify logo displays on NGO profile
- [ ] Test file size validation (max 2MB)
- [ ] Test file type validation (only images)
- [ ] Test upload error handling
- [ ] Test remove logo functionality
- [ ] Test logo persists when going back in form
- [ ] Test logo included in final onboarding submission
- [ ] Test logo displays on dashboard after onboarding

---

## **🔄 Migration Path (If Needed)**

If you want to migrate existing NGOs with local logos to Cloudinary:

```typescript
// Migration script
async function migrateLogosToCloudinary() {
  const ngos = await nonprofitRepository.find({
    where: { logoUrl: Not(IsNull()) }
  });

  for (const ngo of ngos) {
    if (ngo.logoUrl && !ngo.logoUrl.includes('cloudinary.com')) {
      // Old local URL, migrate to Cloudinary
      const response = await axios.get(ngo.logoUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);
      
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'pairova/logos' },
        (error, result) => {
          if (result) {
            ngo.logoUrl = result.secure_url;
            nonprofitRepository.save(ngo);
          }
        }
      ).end(buffer);
    }
  }
}
```

---

## **📄 Summary & Recommendation**

### **✅ Recommended Solution:**

**Use the existing two-step upload process:**

1. **User uploads logo** → `POST /profiles/uploads`
2. **Backend uploads to Cloudinary** → Returns URL
3. **Frontend includes URL in onboarding data** → `POST /profiles/nonprofit/onboarding`
4. **Backend saves URL to database** → `nonprofit_orgs.logo_url`

### **Why?**
- ✅ Already implemented (90% done!)
- ✅ Industry best practice
- ✅ Better user experience
- ✅ Secure and scalable
- ✅ Cost-effective (Cloudinary free tier)
- ✅ Global CDN for fast loading
- ✅ Automatic optimization

### **What You Need to Do:**
1. ✅ Backend: Already done! Your upload endpoint works.
2. ❌ Frontend: Update Account Info form to use the upload endpoint
3. ❌ Frontend: Include `logoUrl` in onboarding submission
4. ✅ Database: Already has `logo_url` column

---

**Created:** October 29, 2025  
**Status:** Ready to implement frontend changes  
**Estimated Time:** 30 minutes

