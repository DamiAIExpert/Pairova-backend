"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Pairova API')
        .setDescription('Pairova backend API documentation')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const doc = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, doc, {
        swaggerOptions: { persistAuthorization: true },
    });
}
//# sourceMappingURL=swagger.config.js.map