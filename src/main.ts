// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { setupSwagger } from './common/swagger/swagger.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // --- Security Middleware ---
    app.use(helmet());
    app.use(cookieParser()); // ✅ now callable

    // --- CORS Configuration ---
    const clientUrl = configService.get<string>('CLIENT_URL', 'http://localhost:3001');
    const allowedOrigins = [
      clientUrl,
      'http://localhost:5173', // Vite dev server (pairova-frontend)
      'http://localhost:3001', // Next.js dev server (pairova-admin)
      'https://pairova.com',
      'https://www.pairova.com',
      'https://admin.pairova.com',
    ];
    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    logger.log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`);

    // --- Global Application Setup ---
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(
      new LoggingInterceptor(),
      new TransformInterceptor(),
      new TimeoutInterceptor(15000),
    );

    // --- API Documentation ---
    setupSwagger(app);

    // --- Graceful Shutdown ---
    app.enableShutdownHooks();

    // --- Start Server ---
    const port = configService.get<number>('PORT', 3000);
    await app.listen(port);

    logger.log(`🚀 Pairova API is running on: http://localhost:${port}`);
    logger.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
  } catch (error) {
    // ✅ handle `unknown` safely
    const stack = error instanceof Error ? error.stack : String(error);
    logger.error('❌ Failed to bootstrap the application', stack);
    process.exit(1);
  }
}

bootstrap();
