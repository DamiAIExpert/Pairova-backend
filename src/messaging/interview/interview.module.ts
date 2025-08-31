// src/messaging/interview/interview.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { Interview } from './entities/interview.entity';
import { Application } from '../../jobs/entities/application.entity';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/shared/user.module';

/**
 * @module InterviewModule
 * @description Manages the scheduling and retrieval of interviews, connecting
 * job applications with scheduled events.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Interview, Application]),
    AuthModule,
    UsersModule,
  ],
  controllers: [InterviewController],
  providers: [InterviewService],
  exports: [InterviewService],
})
export class InterviewModule {}

