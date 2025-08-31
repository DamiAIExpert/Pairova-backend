"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.getMulterMemoryStorage = exports.configureCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = require("multer");
const configureCloudinary = (configService) => {
    cloudinary_1.v2.config({
        cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
        api_key: configService.get('CLOUDINARY_API_KEY'),
        api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
};
exports.configureCloudinary = configureCloudinary;
const getMulterMemoryStorage = () => ({
    storage: (0, multer_1.memoryStorage)(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
exports.getMulterMemoryStorage = getMulterMemoryStorage;
const uploadToCloudinary = async (file, options = {}) => {
    if (!file) {
        throw new Error('No file provided for Cloudinary upload');
    }
    const uploadOptions = {
        folder: 'pairova',
        resource_type: 'auto',
        ...options,
    };
    const buffer = file.buffer ?? null;
    if (buffer) {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream(uploadOptions, (err, res) => {
                if (err)
                    return reject(err);
                if (!res)
                    return reject(new Error('Empty Cloudinary response'));
                resolve(res);
            });
            stream.end(buffer);
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
            raw: result,
        };
    }
    if (file.path) {
        const result = await cloudinary_1.v2.uploader.upload(file.path, uploadOptions);
        return {
            url: result.secure_url,
            publicId: result.public_id,
            raw: result,
        };
    }
    throw new Error('File has neither buffer nor path to upload');
};
exports.uploadToCloudinary = uploadToCloudinary;
//# sourceMappingURL=cloudinary.storage.js.map