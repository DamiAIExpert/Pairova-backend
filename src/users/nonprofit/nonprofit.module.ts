// src/users/nonprofit/nonprofit.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NonprofitController } from './nonprofit.controller';
import { NonprofitService } from './nonprofit.service';
import { NonprofitOrg } from './nonprofit.entity';

/**
 * @class NonprofitModule
 * @description Encapsulates all logic related to non-profit organization profiles.
 */
@Module({
  imports: [TypeOrmModule.forFeature([NonprofitOrg])],
  controllers: [NonprofitController],
  providers: [NonprofitService],
  exports: [NonprofitService],
})
export class NonprofitModule {}
