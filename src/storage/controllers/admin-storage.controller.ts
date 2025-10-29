// src/storage/controllers/admin-storage.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/strategies/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/strategies/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../users/shared/user.entity';
import { StorageProviderService } from '../services/storage-provider.service';
import { FileStorageService } from '../services/file-storage.service';
import { StorageProviderFactoryService } from '../services/storage-provider-factory.service';
import {
  CreateStorageProviderDto,
  UpdateStorageProviderDto,
  StorageProviderResponseDto,
  StorageProviderHealthDto,
  FileUploadDto,
  FileUploadResponseDto,
} from '../dto/storage-provider.dto';
import { FileType } from '../../common/enums/file-type.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Admin')
@Controller('admin/storage')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@Roles(Role.ADMIN)
export class AdminStorageController {
  constructor(
    private readonly storageProviderService: StorageProviderService,
    private readonly fileStorageService: FileStorageService,
    private readonly storageProviderFactory: StorageProviderFactoryService,
  ) {}

  @Get('providers')
  @ApiOperation({ summary: 'Get all storage providers' })
  @ApiResponse({ status: 200, description: 'Storage providers retrieved successfully', type: [StorageProviderResponseDto] })
  async getStorageProviders(): Promise<StorageProviderResponseDto[]> {
    const providers = await this.storageProviderService.getAllProviders();
    return providers.map(provider => this.mapToResponseDto(provider));
  }

  @Get('providers/:id')
  @ApiOperation({ summary: 'Get storage provider by ID' })
  @ApiResponse({ status: 200, description: 'Storage provider retrieved successfully', type: StorageProviderResponseDto })
  @ApiResponse({ status: 404, description: 'Storage provider not found' })
  async getStorageProvider(@Param('id') id: string): Promise<StorageProviderResponseDto> {
    const provider = await this.storageProviderService.getProviderById(id);
    return this.mapToResponseDto(provider);
  }

  @Post('providers')
  @ApiOperation({ summary: 'Create new storage provider' })
  @ApiResponse({ status: 201, description: 'Storage provider created successfully', type: StorageProviderResponseDto })
  async createStorageProvider(
    @Body() createDto: CreateStorageProviderDto,
    @CurrentUser() user: User,
  ): Promise<StorageProviderResponseDto> {
    const provider = await this.storageProviderService.createProvider(createDto, user.id);
    return this.mapToResponseDto(provider);
  }

  @Put('providers/:id')
  @ApiOperation({ summary: 'Update storage provider' })
  @ApiResponse({ status: 200, description: 'Storage provider updated successfully', type: StorageProviderResponseDto })
  @ApiResponse({ status: 404, description: 'Storage provider not found' })
  async updateStorageProvider(
    @Param('id') id: string,
    @Body() updateDto: UpdateStorageProviderDto,
    @CurrentUser() user: User,
  ): Promise<StorageProviderResponseDto> {
    const provider = await this.storageProviderService.updateProvider(id, updateDto, user.id);
    return this.mapToResponseDto(provider);
  }

  @Delete('providers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete storage provider' })
  @ApiResponse({ status: 204, description: 'Storage provider deleted successfully' })
  @ApiResponse({ status: 404, description: 'Storage provider not found' })
  async deleteStorageProvider(@Param('id') id: string): Promise<void> {
    await this.storageProviderService.deleteProvider(id);
  }

  @Post('providers/:id/test')
  @ApiOperation({ summary: 'Test storage provider connection' })
  @ApiResponse({ status: 200, description: 'Connection test completed', type: StorageProviderHealthDto })
  async testStorageProvider(@Param('id') id: string): Promise<StorageProviderHealthDto> {
    const provider = await this.storageProviderService.getProviderById(id);
    const storageService = this.storageProviderFactory.getProvider(provider.type, provider.configuration);
    
    const startTime = Date.now();
    const healthStatus = await storageService.healthCheck();
    const responseTime = Date.now() - startTime;

    // Update provider health status
    await this.storageProviderService.updateProviderHealth(id, healthStatus.isHealthy, healthStatus.error);

    return {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      isHealthy: healthStatus.isHealthy,
      responseTime,
      error: healthStatus.error,
      checkedAt: new Date(),
      status: healthStatus.status,
    };
  }

  @Post('providers/:id/health-check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform health check on storage provider' })
  @ApiResponse({ status: 200, description: 'Health check completed' })
  async performHealthCheck(@Param('id') id: string): Promise<void> {
    await this.fileStorageService.performHealthCheck(id);
  }

  @Post('providers/health-check-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform health check on all storage providers' })
  @ApiResponse({ status: 200, description: 'Health checks completed' })
  async performHealthCheckAll(): Promise<void> {
    await this.fileStorageService.performHealthCheck();
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get storage usage statistics' })
  @ApiResponse({ status: 200, description: 'Storage usage retrieved successfully' })
  async getStorageUsage() {
    return await this.fileStorageService.getStorageUsage();
  }

  @Get('supported-types')
  @ApiOperation({ summary: 'Get supported storage types' })
  @ApiResponse({ status: 200, description: 'Supported storage types retrieved successfully' })
  async getSupportedStorageTypes() {
    const types = this.storageProviderFactory.getSupportedTypes();
    return types.map(type => ({
      type,
      description: this.storageProviderFactory.getTypeDescription(type),
    }));
  }

  @Get('files')
  @ApiOperation({ summary: 'Get all uploaded files with pagination' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  async getFiles(
    @Query() paginationDto: PaginationDto,
    @Query('fileType') fileType?: FileType,
    @Query('userId') userId?: string,
  ) {
    // Implementation for getting files with filters
    // This would be implemented in the file storage service
    return {
      message: 'Files retrieved successfully',
      pagination: paginationDto,
      filters: { fileType, userId },
    };
  }

  @Post('upload/test')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Test file upload with current storage provider' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully', type: FileUploadResponseDto })
  async testUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: FileUploadDto,
    @CurrentUser() user: User,
  ): Promise<FileUploadResponseDto> {
    const fileType = uploadDto.fileType ? FileType[uploadDto.fileType.toUpperCase()] : FileType.OTHER;
    
    const uploadedFile = await this.fileStorageService.uploadFile(
      file,
      user.id,
      fileType,
      {
        folder: uploadDto.folder,
        isPublic: uploadDto.isPublic,
        metadata: uploadDto.metadata,
      },
    );

    return {
      id: uploadedFile.id,
      url: uploadedFile.url,
      thumbnailUrl: uploadedFile.thumbnailUrl,
      size: uploadedFile.size,
      mimeType: uploadedFile.mimeType,
      fileType: uploadedFile.fileType,
      storageProvider: uploadedFile.storageProvider.name,
      uploadedAt: uploadedFile.createdAt,
    };
  }

  @Put('providers/:id/activate')
  @ApiOperation({ summary: 'Activate storage provider' })
  @ApiResponse({ status: 200, description: 'Storage provider activated successfully' })
  async activateProvider(@Param('id') id: string): Promise<StorageProviderResponseDto> {
    const provider = await this.storageProviderService.activateProvider(id);
    return this.mapToResponseDto(provider);
  }

  @Put('providers/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate storage provider' })
  @ApiResponse({ status: 200, description: 'Storage provider deactivated successfully' })
  async deactivateProvider(@Param('id') id: string): Promise<StorageProviderResponseDto> {
    const provider = await this.storageProviderService.deactivateProvider(id);
    return this.mapToResponseDto(provider);
  }

  @Put('providers/:id/priority')
  @ApiOperation({ summary: 'Update storage provider priority' })
  @ApiResponse({ status: 200, description: 'Storage provider priority updated successfully' })
  async updateProviderPriority(
    @Param('id') id: string,
    @Body('priority') priority: number,
  ): Promise<StorageProviderResponseDto> {
    const provider = await this.storageProviderService.updateProviderPriority(id, priority);
    return this.mapToResponseDto(provider);
  }

  private mapToResponseDto(provider: any): StorageProviderResponseDto {
    return {
      id: provider.id,
      name: provider.name,
      type: provider.type,
      isActive: provider.isActive,
      priority: provider.priority,
      description: provider.description,
      usageCount: provider.usageCount,
      totalStorageUsed: provider.totalStorageUsed,
      isHealthy: provider.isHealthy,
      lastHealthCheck: provider.lastHealthCheck,
      healthCheckError: provider.healthCheckError,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
      metadata: provider.metadata,
    };
  }
}
