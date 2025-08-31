"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: req?.url ?? '',
            method: req?.method ?? '',
            message: 'Internal server error',
            errors: null,
        };
        if (exception instanceof common_1.HttpException) {
            const body = exception.getResponse();
            if (typeof body === 'string') {
                errorResponse.message = body;
            }
            else if (body && typeof body === 'object') {
                const rawMessage = body.message ?? exception.message;
                errorResponse.message = Array.isArray(rawMessage)
                    ? rawMessage.join(', ')
                    : String(rawMessage ?? 'Error');
                errorResponse.errors = body.errors ?? null;
            }
            else {
                errorResponse.message = exception.message;
            }
        }
        else if (exception instanceof Error) {
            errorResponse.message = exception.message || 'Unexpected error';
        }
        else {
            errorResponse.message = 'Unexpected error';
        }
        if (status >= 500) {
            this.logger.error(`HTTP ${status} ${req?.method ?? ''} ${req?.url ?? ''} -> ${errorResponse.message}`, exception instanceof Error ? exception.stack : JSON.stringify(exception));
        }
        res.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map