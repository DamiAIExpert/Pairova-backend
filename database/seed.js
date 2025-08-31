"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const user_service_1 = require("../src/users/shared/user.service");
const role_enum_1 = require("../src/common/enums/role.enum");
const bcrypt_1 = require("bcrypt");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(user_service_1.UsersService);
    const configService = app.get(config_1.ConfigService);
    const logger = app.get(Logger);
    logger.log('Starting database seeding process...');
    const adminEmail = configService.get('ADMIN_EMAIL', 'admin@pairova.com');
    const adminPassword = configService.get('ADMIN_PASSWORD', 'supersecret');
    const existingAdmin = await usersService.findByEmailWithPassword(adminEmail);
    if (!existingAdmin) {
        const salt = await (0, bcrypt_1.genSalt)();
        const passwordHash = await (0, bcrypt_1.hash)(adminPassword, salt);
        await usersService.create({
            email: adminEmail,
            passwordHash,
            role: role_enum_1.Role.ADMIN,
            isVerified: true,
        });
        logger.log(`Default admin user created: ${adminEmail}`);
    }
    else {
        logger.log('Admin user already exists. Skipping creation.');
    }
    await app.close();
    logger.log('Seeding process finished.');
}
bootstrap().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map