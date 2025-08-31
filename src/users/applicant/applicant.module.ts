// src/users/applicant/applicant.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicantController } from './applicant.controller';
import { ApplicantService } from './applicant.service';
import { ApplicantProfile } from './applicant.entity';

/**
 * @class ApplicantModule
 * @description Encapsulates all logic related to applicant profiles.
 */
@Module({
  imports: [TypeOrmModule.forFeature([ApplicantProfile])],
  controllers: [ApplicantController],
  providers: [ApplicantService],
  exports: [ApplicantService],
})
export class ApplicantModule {}
