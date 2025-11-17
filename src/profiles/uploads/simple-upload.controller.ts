// src/profiles/uploads/simple-upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@ApiTags('File Uploads - Simple')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('uploads/simple')
export class SimpleUploadController {
  constructor(private readonly configService: ConfigService) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  @Post()
  @ApiOperation({ summary: 'Simple file upload directly to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    console.log('🎯 [SimpleUploadController] Endpoint hit!');
    console.log('📦 File:', file ? `${file.originalname} (${file.mimetype}, ${file.size} bytes)` : 'NO FILE');
    console.log('👤 User:', user?.id);

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!file.buffer) {
      throw new BadRequestException('File buffer is empty');
    }

    try {
      console.log('⬆️  Uploading to Cloudinary...');
      
      // Upload directly to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'pairova/logos',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary error:', error);
              reject(error);
            } else {
              console.log('✅ Cloudinary upload success:', result?.secure_url);
              resolve(result);
            }
          }
        );
        
        uploadStream.end(file.buffer);
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }
}












