"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const timeout_interceptor_1 = require("./common/interceptors/timeout.interceptor");
const swagger_config_1 = require("./common/swagger/swagger.config");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const configService = app.get(config_1.ConfigService);
        app.use((0, helmet_1.default)());
        app.use((0, cookie_parser_1.default)());
        const clientUrl = configService.get('CLIENT_URL', 'http://localhost:3001');
        app.enableCors({
            origin: [clientUrl],
            credentials: true,
        });
        logger.log(`CORS enabled for origin: ${clientUrl}`);
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
        app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new transform_interceptor_1.TransformInterceptor(), new timeout_interceptor_1.TimeoutInterceptor(15000));
        (0, swagger_config_1.setupSwagger)(app);
        app.enableShutdownHooks();
        const port = configService.get('PORT', 3000);
        await app.listen(port);
        logger.log(`🚀 Pairova API is running on: http://localhost:${port}`);
        logger.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
    }
    catch (error) {
        const stack = error instanceof Error ? error.stack : String(error);
        logger.error('❌ Failed to bootstrap the application', stack);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map