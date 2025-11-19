import { ExecutionContext } from '@nestjs/common';
declare const LinkedInAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class LinkedInAuthGuard extends LinkedInAuthGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
