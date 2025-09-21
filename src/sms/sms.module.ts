import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSmsController } from './controllers/admin-sms.controller';
import { SmsService } from './services/sms.service';
import { SmsProviderFactory } from './services/sms-provider-factory.service';
import { SmsProvider } from './entities/sms-provider.entity';
import { SmsLog } from './entities/sms-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SmsProvider,
      SmsLog,
    ]),
  ],
  controllers: [AdminSmsController],
  providers: [SmsService, SmsProviderFactory],
  exports: [SmsService, SmsProviderFactory],
})
export class SmsModule {}
