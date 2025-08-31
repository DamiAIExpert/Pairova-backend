// src/profiles/uploads/cloudinary.storage.ts
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { memoryStorage } from 'multer';

/**
 * Call this once (e.g., in a module constructor or before first upload)
 * to configure the Cloudinary SDK from ConfigService / env.
 */
export const configureCloudinary = (configService: ConfigService): void => {
  cloudinary.config({
    cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
  });
};

/**
 * Returns Multer options that store files in memory so we can stream them
 * directly to Cloudinary without writing to disk.
 *
 * Usage with FileInterceptor:
 *   @UseInterceptors(FileInterceptor('file', getMulterMemoryStorage()))
 */
export const getMulterMemoryStorage = () => ({
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB (tune as needed)
  },
});

/**
 * Streams a file buffer to Cloudinary.
 * Works for images, pdfs, etc. (resource_type: 'auto').
 *
 * @param file - Express.Multer.File from FileInterceptor (memory storage).
 * @param options - Optional Cloudinary upload options (folder, public_id, tags, etc).
 *                  Defaults to folder 'pairova' and resource_type 'auto'.
 * @returns {Promise<{ url: string; publicId: string; raw: UploadApiResponse }>}
 */
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  options: UploadApiOptions = {},
): Promise<{ url: string; publicId: string; raw: UploadApiResponse }> => {
  if (!file) {
    throw new Error('No file provided for Cloudinary upload');
  }

  const uploadOptions: UploadApiOptions = {
    folder: 'pairova',
    resource_type: 'auto',
    // You can constrain formats if you like:
    // allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    ...options,
  };

  const buffer = file.buffer ?? null;

  // Prefer buffer streaming; if none (unlikely with memoryStorage), fall back to path.
  if (buffer) {
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, res) => {
        if (err) return reject(err);
        if (!res) return reject(new Error('Empty Cloudinary response'));
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

  // Fallback: if FileInterceptor wrote to disk elsewhere (not our default), use file.path
  if ((file as any).path) {
    const result = await cloudinary.uploader.upload((file as any).path, uploadOptions);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      raw: result,
    };
  }

  throw new Error('File has neither buffer nor path to upload');
};
