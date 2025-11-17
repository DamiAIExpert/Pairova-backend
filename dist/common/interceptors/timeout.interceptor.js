"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let TimeoutInterceptor = class TimeoutInterceptor {
    timeoutDuration;
    constructor(timeoutDuration = 15000) {
        this.timeoutDuration = timeoutDuration;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const url = request.url || '';
        const method = request.method || '';
        const isUpload = url.includes('/upload');
        const isJobCreation = url.includes('/ngos/me/jobs') && method === 'POST';
        const isRegistration = url.includes('/register');
        const isSavedJobs = url.includes('/saved-jobs');
        const isNonprofitJobs = url.includes('/ngos/me/jobs');
        let timeoutDuration = this.timeoutDuration;
        if (isUpload) {
            timeoutDuration = 60000;
        }
        else if (isJobCreation) {
            timeoutDuration = 45000;
        }
        else if (isRegistration || isSavedJobs || isNonprofitJobs) {
            timeoutDuration = 30000;
        }
        return next.handle().pipe((0, operators_1.timeout)(timeoutDuration), (0, operators_1.catchError)((err) => {
            if (err instanceof rxjs_1.TimeoutError) {
                throw new common_1.RequestTimeoutException(`Request timed out after ${timeoutDuration}ms`);
            }
            throw err;
        }));
    }
};
exports.TimeoutInterceptor = TimeoutInterceptor;
exports.TimeoutInterceptor = TimeoutInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Number])
], TimeoutInterceptor);
//# sourceMappingURL=timeout.interceptor.js.map