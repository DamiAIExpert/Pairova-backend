import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register User entity for DI
  providers: [UsersService],                   // Provide UsersService globally
  exports: [UsersService, TypeOrmModule],      // Export UsersService + Entity for other modules
})
export class UsersModule {}
