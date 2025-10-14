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
exports.AwsS3StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
let AwsS3StorageService = class AwsS3StorageService {
    s3Client;
    config;
    constructor() { }
    initialize(config) {
        this.config = config;
        this.s3Client = new client_s3_1.S3Client({
            region: config.region || 'us-east-1',
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
            },
            endpoint: config.endpoint,
        });
    }
    async upload(file, options = {}) {
        try {
            const folder = options.folder || this.config.defaultFolder || 'pairova';
            const key = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.config.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: options.isPublic ? 'public-read' : 'private',
                Metadata: {
                    originalName: file.originalname,
                    ...options.metadata,
                },
            });
            await this.s3Client.send(command);
            const url = this.generateUrl(key);
            return {
                url,
                publicId: key,
                size: file.size,
                metadata: {
                    bucket: this.config.bucketName,
                    key,
                    contentType: file.mimetype,
                },
            };
        }
        catch (error) {
            throw new Error(`AWS S3 upload failed: ${error.message}`);
        }
    }
    async delete(publicId) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.config.bucketName,
                Key: publicId,
            });
            await this.s3Client.send(command);
            return true;
        }
        catch (error) {
            throw new Error(`AWS S3 delete failed: ${error.message}`);
        }
    }
    generateUrl(publicId, transformations = {}) {
        if (this.config.endpoint) {
            return `${this.config.endpoint}/${this.config.bucketName}/${publicId}`;
        }
        return `https://${this.config.bucketName}.s3.${this.config.region || 'us-east-1'}.amazonaws.com/${publicId}`;
    }
    async healthCheck() {
        const startTime = Date.now();
        try {
            const command = new client_s3_1.HeadObjectCommand({
                Bucket: this.config.bucketName,
                Key: 'health-check-test',
            });
            try {
                await this.s3Client.send(command);
            }
            catch (error) {
                if (error.name !== 'NotFound') {
                    throw error;
                }
            }
            const responseTime = Date.now() - startTime;
            return {
                isHealthy: true,
                responseTime,
                status: {
                    bucket: this.config.bucketName,
                    region: this.config.region,
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
                    bucket: this.config.bucketName,
                    region: this.config.region,
                    status: 'error',
                },
            };
        }
    }
    async getUsage() {
        return {
            totalStorage: 0,
            fileCount: 0,
            bandwidthUsed: 0,
        };
    }
};
exports.AwsS3StorageService = AwsS3StorageService;
exports.AwsS3StorageService = AwsS3StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AwsS3StorageService);
//# sourceMappingURL=aws-s3-storage.service.js.map