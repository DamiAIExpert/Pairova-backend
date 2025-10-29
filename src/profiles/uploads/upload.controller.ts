// src/profiles/uploads/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { UploadDto } from './dto/upload.dto';

import {
  configureCloudinary,
  getMulterMemoryStorage,
} from './cloudinary.storage';

@ApiTags('File Uploads')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('profiles/uploads')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {
    // Configure Cloudinary once per process using env vars
    configureCloudinary(this.configService);
  }

  @Post()
  @ApiOperation({ summary: 'Upload a file for the current user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiQuery({
    name: 'kind',
    type: 'string',
    required: false,
    description: "Type of upload (e.g., 'avatar', 'resume')",
    example: 'resume',
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully.',
    type: UploadDto,
  })
  @UseInterceptors(FileInterceptor('file', getMulterMemoryStorage()))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 10 MB max (adjust as needed)
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          // Validate MIME type (images including SVG, and PDF)
          new FileTypeValidator({
            fileType: /(image\/jpeg|image\/jpg|image\/png|image\/svg\+xml|application\/pdf)/,
          }),
        ],
        fileIsRequired: false, // Make file optional to debug
      }),
    )
    file: Express.Multer.File, // memory storage -> file.buffer is set
    @CurrentUser() user: User,
    @Query('kind') kind: string = 'general',
  ) {
    console.log('🎯 [UploadController] Upload endpoint hit!');
    console.log('📦 File received:', file ? `${file.originalname} (${file.mimetype}, ${file.size} bytes)` : 'NO FILE');
    console.log('👤 User:', user?.id);
    console.log('🏷️  Kind:', kind);
    
    try {
      const result = await this.uploadService.processAndRecordUpload(file, user, kind);
      console.log('✅ [UploadController] Upload completed successfully');
      return result;
    } catch (error) {
      console.error('❌ [UploadController] Upload failed:', error.message);
      console.error(error.stack);
      throw error;
    }
  }
}
