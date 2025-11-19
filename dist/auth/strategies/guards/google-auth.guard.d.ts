import { ExecutionContext } from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';
declare const oauthRoleStore: Map<string, Role>;
declare const GoogleAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GoogleAuthGuard extends GoogleAuthGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export { oauthRoleStore };
