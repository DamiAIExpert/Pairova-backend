// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { setupSwagger } from './common/swagger/swagger.config';
import { UrlHelper } from './common/utils/url.helper';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // --- Security Middleware ---
    app.use(helmet());
    app.use(cookieParser()); // ✅ now callable
    
    // --- Session Middleware (Required for LinkedIn OAuth with state parameter) ---
    const sessionSecret = configService.get<string>('SESSION_SECRET') || configService.get<string>('JWT_SECRET') || 'dev-session-secret';
    app.use(
      session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
      }),
    );
    logger.log('✅ Session middleware configured');

    // --- CORS Configuration (Dynamic) ---
    const allowedOrigins = UrlHelper.getAllowedOrigins(configService);
    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
      exposedHeaders: ['Authorization'],
      maxAge: 3600,
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
