import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class OtpGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
