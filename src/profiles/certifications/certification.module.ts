// src/profiles/certifications/certification.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationService } from './certification.service';
import { CertificationController } from './certification.controller';
import { Certification } from './entities/certification.entity';

/**
 * @class CertificationModule
 * @description Encapsulates all logic related to user certifications.
 * It bundles the controller for handling API requests and the service for business logic,
 * and it provides the service with access to the Certification entity's repository via TypeORM.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Certification])],
  controllers: [CertificationController],
  providers: [CertificationService],
  exports: [CertificationService],
})
export class CertificationModule {}

