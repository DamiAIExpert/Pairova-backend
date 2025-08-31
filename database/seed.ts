// /database/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/shared/user.service';
import { Role } from '../src/common/enums/role.enum';
import { genSalt, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

/**
 * @function bootstrap
 * @description A standalone NestJS application to seed the database with initial data.
 * This script is intended to be run from the command line (e.g., `npm run db:seed`).
 * It creates a default admin user if one does not already exist.
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  logger.log('Starting database seeding process...');

  const adminEmail = configService.get<string>('ADMIN_EMAIL', 'admin@pairova.com');
  const adminPassword = configService.get<string>('ADMIN_PASSWORD', 'supersecret');

  const existingAdmin = await usersService.findByEmailWithPassword(adminEmail);

  if (!existingAdmin) {
    const salt = await genSalt();
    const passwordHash = await hash(adminPassword, salt);

    await usersService.create({
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      isVerified: true, // Admins are verified by default
    });
    logger.log(`Default admin user created: ${adminEmail}`);
  } else {
    logger.log('Admin user already exists. Skipping creation.');
  }

  await app.close();
  logger.log('Seeding process finished.');
}

bootstrap().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
