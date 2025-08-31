// src/profiles/uploads/dto/upload.dto.ts
import { ApiProperty } from '@nestjs/swagger';

/**
 * @class UploadDto
 * @description Represents the response after a successful file upload.
 */
export class UploadDto {
  @ApiProperty({ description: 'The unique ID of the upload record in the database.', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  id: string;

  @ApiProperty({ description: 'The URL where the file can be accessed.', example: 'https://res.cloudinary.com/demo/image/upload/v1582222222/pairova/sample.jpg' })
  url: string;

  @ApiProperty({ description: 'The public ID of the file in the storage provider (e.g., Cloudinary).', example: 'pairova/sample' })
  publicId: string;

  @ApiProperty({ description: 'The MIME type of the uploaded file.', example: 'image/jpeg' })
  mimeType: string;

  @ApiProperty({ description: 'The size of the file in bytes.', example: 102400 })
  sizeBytes: number;
}
