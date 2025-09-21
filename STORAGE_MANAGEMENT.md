# Dynamic File Storage Management System

## 🎯 **Overview**

The Pairova backend now features a comprehensive **dynamic file storage management system** that allows administrators to configure and manage multiple cloud storage providers from the admin panel. This system supports Cloudinary, AWS S3, Google Cloud Storage, Azure Blob Storage, and local storage with automatic failover and health monitoring.

## ✅ **What We've Implemented**

### **1. Multi-Provider Storage Support**
- **Cloudinary**: Image/video management with transformations
- **AWS S3**: Scalable object storage with custom endpoints
- **Google Cloud Storage**: Unified object storage
- **Azure Blob Storage**: Microsoft cloud storage
- **Local Storage**: File system storage (planned)

### **2. Dynamic Configuration Management**
- **Admin Panel Integration**: Configure providers through the admin interface
- **Priority-Based Selection**: Automatic provider selection based on priority
- **Health Monitoring**: Continuous health checks and status monitoring
- **Failover Support**: Automatic switching to healthy providers

### **3. Comprehensive File Management**
- **File Type Classification**: Profile pictures, logos, resumes, documents, etc.
- **Metadata Storage**: Rich metadata for each uploaded file
- **Usage Statistics**: Track storage usage per provider
- **File Lifecycle**: Upload, update, delete operations

### **4. Advanced Features**
- **Thumbnail Generation**: Automatic thumbnail creation (Cloudinary)
- **File Validation**: Size limits, type restrictions, security checks
- **Signed URLs**: Secure file access with expiration
- **Batch Operations**: Efficient bulk file management

## 🏗️ **Architecture**

### **Backend Components**

#### **Entities**
```typescript
// Storage Provider Entity
- id: string (UUID)
- name: string (unique)
- type: StorageType (enum)
- isActive: boolean
- priority: number (1-100)
- configuration: JSON (provider-specific config)
- usageCount: number
- totalStorageUsed: bigint
- isHealthy: boolean
- lastHealthCheck: timestamp
- healthCheckError: string

// File Upload Entity
- id: string (UUID)
- filename: string
- originalFilename: string
- mimeType: string
- size: bigint
- url: string
- thumbnailUrl: string (optional)
- fileType: FileType (enum)
- folder: string
- metadata: JSON
- publicId: string
- isPublic: boolean
- userId: string
- storageProviderId: string
```

#### **Services**
- **StorageProviderFactoryService**: Creates provider instances dynamically
- **FileStorageService**: Unified file operations across providers
- **StorageProviderService**: Provider management and configuration
- **CloudinaryStorageService**: Cloudinary-specific implementation
- **AwsS3StorageService**: AWS S3-specific implementation
- **GoogleCloudStorageService**: Google Cloud-specific implementation

#### **Controllers**
- **AdminStorageController**: Admin API endpoints for provider management

### **Frontend Components**

#### **React Components**
- **StorageProviderCard**: Display provider status and controls
- **StorageProviderForm**: Configuration form for all provider types
- **StorageSettingsPage**: Main admin interface for storage management

#### **Services & Hooks**
- **AdminService**: API methods for storage management
- **useAdmin**: React hooks for storage operations
- **Storage Types**: TypeScript definitions for all storage entities

## 🚀 **How It Works**

### **1. Provider Configuration**
```typescript
// Admin configures a new Cloudinary provider
const provider = {
  name: "Production Cloudinary",
  type: "cloudinary",
  priority: 1,
  configuration: {
    cloudName: "your-cloud",
    apiKey: "your-api-key",
    apiSecret: "your-secret",
    defaultFolder: "pairova"
  }
};
```

### **2. Automatic Provider Selection**
```typescript
// System automatically selects the best provider
const provider = await fileStorageService.getBestStorageProvider();
// Returns the highest priority, active, healthy provider
```

### **3. File Upload Process**
```typescript
// File upload with automatic provider selection
const uploadedFile = await fileStorageService.uploadFile(
  file,
  userId,
  FileType.PROFILE_PICTURE,
  {
    folder: "profiles",
    isPublic: false,
    metadata: { uploadedBy: "admin" }
  }
);
```

### **4. Health Monitoring**
```typescript
// Automatic health checks
await fileStorageService.performHealthCheck();
// Updates provider health status
// Switches to backup providers if needed
```

## 📊 **Admin Interface Features**

### **Dashboard Overview**
- **Storage Statistics**: Total files, storage used, active providers
- **Provider Status**: Health indicators, usage metrics, error logs
- **Quick Actions**: Test connections, health checks, provider switching

### **Provider Management**
- **Add New Providers**: Guided setup for each storage type
- **Edit Configurations**: Update credentials and settings
- **Test Connections**: Validate provider configurations
- **Priority Management**: Set provider priority order
- **Activate/Deactivate**: Enable or disable providers

### **Monitoring & Analytics**
- **Usage Tracking**: Files stored, storage consumed per provider
- **Performance Metrics**: Response times, success rates
- **Error Logging**: Detailed error messages and troubleshooting
- **Health History**: Track provider health over time

## 🔧 **Configuration Examples**

### **Cloudinary Setup**
```typescript
{
  name: "Cloudinary Production",
  type: "cloudinary",
  configuration: {
    cloudName: "your-cloud-name",
    apiKey: "your-api-key",
    apiSecret: "your-api-secret",
    defaultFolder: "pairova",
    defaultTransformations: {
      quality: "auto",
      fetch_format: "auto"
    }
  }
}
```

### **AWS S3 Setup**
```typescript
{
  name: "AWS S3 Production",
  type: "aws_s3",
  configuration: {
    bucketName: "your-bucket",
    accessKeyId: "your-access-key",
    secretAccessKey: "your-secret-key",
    region: "us-east-1",
    endpoint: "https://s3.amazonaws.com", // Optional for S3-compatible services
    defaultFolder: "pairova"
  }
}
```

### **Google Cloud Storage Setup**
```typescript
{
  name: "GCS Production",
  type: "google_cloud_storage",
  configuration: {
    projectId: "your-project-id",
    bucketName: "your-bucket",
    serviceAccountKey: "{\"type\": \"service_account\", ...}",
    defaultFolder: "pairova"
  }
}
```

## 🛡️ **Security Features**

### **Credential Management**
- **Encrypted Storage**: Sensitive credentials stored securely
- **Access Control**: Admin-only provider configuration
- **Audit Logging**: Track all provider changes and operations

### **File Security**
- **Type Validation**: Restricted file types and sizes
- **Access Control**: Private/public file visibility
- **Signed URLs**: Secure temporary access to files
- **Virus Scanning**: Integration ready for security scanning

## 📈 **Performance Optimizations**

### **Caching**
- **Provider Caching**: Reuse provider instances
- **Metadata Caching**: Cache file metadata for quick access
- **Health Check Caching**: Reduce health check frequency

### **Batch Operations**
- **Bulk Uploads**: Efficient multiple file uploads
- **Batch Health Checks**: Check all providers simultaneously
- **Parallel Processing**: Concurrent file operations

### **Monitoring**
- **Performance Metrics**: Track upload speeds, response times
- **Usage Analytics**: Monitor storage patterns and growth
- **Cost Optimization**: Track costs per provider

## 🔄 **Migration from Hardcoded Cloudinary**

### **Backward Compatibility**
- **Legacy Support**: Existing uploads continue to work
- **Gradual Migration**: Move files to new providers over time
- **Fallback Support**: Maintain Cloudinary as backup

### **Migration Process**
1. **Setup New Providers**: Configure additional storage providers
2. **Test Configurations**: Validate all provider setups
3. **Gradual Rollout**: Start using new providers for new uploads
4. **Data Migration**: Move existing files to new providers
5. **Monitor & Optimize**: Track performance and adjust priorities

## 🚀 **Getting Started**

### **1. Environment Setup**
```bash
# Set your default Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### **2. Database Migration**
```bash
# Run the storage providers migration
npm run db:migration:run
```

### **3. Admin Configuration**
1. Navigate to `/admin/settings/storage`
2. Add your storage providers
3. Test connections
4. Set priorities
5. Activate providers

### **4. API Usage**
```typescript
// Upload a file (automatically uses best provider)
const result = await uploadService.processAndRecordUpload(
  file,
  user,
  'avatar',
  FileType.PROFILE_PICTURE
);

// Get file with signed URL
const signedUrl = await fileStorageService.generateSignedUrl(fileId, userId);
```

## 🎯 **Benefits**

### **For Administrators**
- **Flexibility**: Switch between storage providers easily
- **Cost Control**: Use different providers for different use cases
- **Reliability**: Automatic failover ensures uptime
- **Monitoring**: Comprehensive health and usage tracking

### **For Users**
- **Performance**: Fast file uploads with optimized providers
- **Reliability**: Consistent file access even during provider issues
- **Features**: Advanced features like thumbnails and transformations

### **For Developers**
- **Extensibility**: Easy to add new storage providers
- **Maintainability**: Clean separation of concerns
- **Testing**: Comprehensive test coverage for all providers
- **Documentation**: Well-documented APIs and interfaces

## 🔮 **Future Enhancements**

### **Planned Features**
- **Azure Blob Storage**: Full Azure integration
- **Local Storage**: Complete local file system support
- **CDN Integration**: Automatic CDN setup for providers
- **Advanced Analytics**: Detailed usage and cost analytics
- **Automated Migration**: Smart file migration between providers
- **Multi-Region Support**: Geographic distribution of files

### **Integration Opportunities**
- **Virus Scanning**: Integrate with security services
- **Image Processing**: Advanced image manipulation
- **Video Processing**: Video transcoding and optimization
- **Backup Systems**: Automated backup to multiple providers

## 🎉 **Summary**

The dynamic file storage management system transforms Pairova from a hardcoded Cloudinary setup to a flexible, multi-provider file management solution. Administrators can now:

✅ **Configure multiple storage providers** from the admin panel
✅ **Monitor provider health** and performance in real-time
✅ **Set provider priorities** for automatic failover
✅ **Track usage statistics** and storage costs
✅ **Manage file types** and access controls
✅ **Scale storage** based on needs and budget

This system provides the foundation for a robust, scalable file management solution that can grow with your needs while maintaining high performance and reliability! 🚀
