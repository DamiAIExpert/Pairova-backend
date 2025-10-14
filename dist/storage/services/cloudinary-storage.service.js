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
exports.CloudinaryStorageService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
let CloudinaryStorageService = class CloudinaryStorageService {
    config;
    constructor() { }
    initialize(config) {
        this.config = config;
        cloudinary_1.v2.config({
            cloud_name: config.cloudName,
            api_key: config.apiKey,
            api_secret: config.apiSecret,
        });
    }
    async upload(file, options = {}) {
        try {
            const folder = options.folder || this.config.defaultFolder || 'pairova';
            const publicId = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary_1.v2.uploader.upload_stream({
                    public_id: publicId,
                    folder: folder,
                    resource_type: 'auto',
                    quality: 'auto',
                    fetch_format: 'auto',
                    ...options.transformations,
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                }).end(file.buffer);
            });
            const result = uploadResult;
            return {
                url: result.secure_url,
                thumbnailUrl: this.generateThumbnailUrl(result.public_id),
                publicId: result.public_id,
                size: result.bytes,
                metadata: {
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    resource_type: result.resource_type,
                },
            };
        }
        catch (error) {
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        }
    }
    async delete(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            return result.result === 'ok';
        }
        catch (error) {
            throw new Error(`Cloudinary delete failed: ${error.message}`);
        }
    }
    generateUrl(publicId, transformations = {}) {
        const defaultTransformations = {
            quality: 'auto',
            fetch_format: 'auto',
            ...this.config.defaultTransformations,
            ...transformations,
        };
        return cloudinary_1.v2.url(publicId, defaultTransformations);
    }
    generateThumbnailUrl(publicId) {
        return cloudinary_1.v2.url(publicId, {
            width: 300,
            height: 300,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto',
        });
    }
    async healthCheck() {
        const startTime = Date.now();
        try {
            const result = await cloudinary_1.v2.api.ping();
            const responseTime = Date.now() - startTime;
            return {
                isHealthy: true,
                responseTime,
                status: {
                    cloudName: this.config.cloudName,
                    status: 'connected',
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
                    cloudName: this.config.cloudName,
                    status: 'error',
                },
            };
        }
    }
    async getUsage() {
        try {
            const usage = await cloudinary_1.v2.api.usage();
            return {
                totalStorage: usage.used_quota?.storage?.used || 0,
                fileCount: usage.used_quota?.requests?.used || 0,
                bandwidthUsed: usage.used_quota?.bandwidth?.used || 0,
                quota: usage.plan?.quota || null,
                remaining: usage.plan?.quota ? usage.plan.quota - (usage.used_quota?.storage?.used || 0) : null,
            };
        }
        catch (error) {
            throw new Error(`Failed to get Cloudinary usage: ${error.message}`);
        }
    }
};
exports.CloudinaryStorageService = CloudinaryStorageService;
exports.CloudinaryStorageService = CloudinaryStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryStorageService);
//# sourceMappingURL=cloudinary-storage.service.js.map