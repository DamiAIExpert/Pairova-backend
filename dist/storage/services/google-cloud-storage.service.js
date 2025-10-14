"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCloudStorageService = void 0;
const common_1 = require("@nestjs/common");
const storage_1 = require("@google-cloud/storage");
let GoogleCloudStorageService = class GoogleCloudStorageService {
    storage;
    config;
    constructor() { }
    initialize(config) {
        this.config = config;
        const serviceAccount = JSON.parse(config.serviceAccountKey);
        this.storage = new storage_1.Storage({
            projectId: config.projectId,
            credentials: serviceAccount,
        });
    }
    async upload(file, options = {}) {
        try {
            const folder = options.folder || this.config.defaultFolder || 'pairova';
            const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
            const bucket = this.storage.bucket(this.config.bucketName);
            const fileUpload = bucket.file(fileName);
            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        originalName: file.originalname,
                        ...options.metadata,
                    },
                },
                public: options.isPublic || false,
                resumable: false,
            });
            return new Promise((resolve, reject) => {
                stream.on('error', (error) => {
                    reject(new Error(`Google Cloud Storage upload failed: ${error.message}`));
                });
                stream.on('finish', async () => {
                    try {
                        const [url] = await fileUpload.getSignedUrl({
                            action: 'read',
                            expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
                        });
                        const [metadata] = await fileUpload.getMetadata();
                        resolve({
                            url: options.isPublic ? fileUpload.publicUrl() : url,
                            publicId: fileName,
                            size: parseInt(metadata.size),
                            metadata: {
                                bucket: this.config.bucketName,
                                name: fileName,
                                contentType: metadata.contentType,
                            },
                        });
                    }
                    catch (error) {
                        reject(new Error(`Failed to get file metadata: ${error.message}`));
                    }
                });
                stream.end(file.buffer);
            });
        }
        catch (error) {
            throw new Error(`Google Cloud Storage upload failed: ${error.message}`);
        }
    }
    async delete(publicId) {
        try {
            const bucket = this.storage.bucket(this.config.bucketName);
            await bucket.file(publicId).delete();
            return true;
        }
        catch (error) {
            throw new Error(`Google Cloud Storage delete failed: ${error.message}`);
        }
    }
    generateUrl(publicId, transformations = {}) {
        const bucket = this.storage.bucket(this.config.bucketName);
        return `https://storage.googleapis.com/${this.config.bucketName}/${publicId}`;
    }
    async healthCheck() {
        const startTime = Date.now();
        try {
            const bucket = this.storage.bucket(this.config.bucketName);
            const [exists] = await bucket.exists();
            const responseTime = Date.now() - startTime;
            return {
                isHealthy: exists,
                responseTime,
                status: {
                    bucket: this.config.bucketName,
                    projectId: this.config.projectId,
                    status: exists ? 'connected' : 'bucket_not_found',
                },
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            return {
                isHealthy: false,
                responseTime,
                error: error.message,
                status: {
                    bucket: this.config.bucketName,
                    projectId: this.config.projectId,
                    status: 'error',
                },
            };
        }
    }
    async getUsage() {
        try {
            const bucket = this.storage.bucket(this.config.bucketName);
            const [files] = await bucket.getFiles();
            let totalSize = 0;
            for (const file of files) {
                const [metadata] = await file.getMetadata();
                totalSize += parseInt(metadata.size || '0');
            }
            return {
                totalStorage: totalSize,
                fileCount: files.length,
                bandwidthUsed: 0,
            };
        }
        catch (error) {
            throw new Error(`Failed to get Google Cloud Storage usage: ${error.message}`);
        }
    }
};
exports.GoogleCloudStorageService = GoogleCloudStorageService;
exports.GoogleCloudStorageService = GoogleCloudStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleCloudStorageService);
//# sourceMappingURL=google-cloud-storage.service.js.map