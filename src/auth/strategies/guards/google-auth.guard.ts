import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../../common/enums/role.enum';

// Temporary storage for OAuth roles (keyed by session ID)
// This allows the strategy to access the role when creating the user
const oauthRoleStore = new Map<string, Role>();

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    // Store role from query
    const roleParam = request.query?.role as string;
    if (roleParam && (roleParam === 'applicant' || roleParam === 'nonprofit')) {
      const role = roleParam === 'nonprofit' ? Role.NONPROFIT : Role.APPLICANT;
      
      // Store in session for callback handler
      if (!request.session) {
        request.session = {} as any;
      }
      request.session.oauthRole = roleParam;
      
      // Store role in temporary store using session ID as key
      // The strategy will retrieve it via the request object
      const sessionId = request.sessionID || `temp_${Date.now()}_${Math.random()}`;
      oauthRoleStore.set(sessionId, role);
      (request as any).oauthRoleKey = sessionId;
      
      console.log('📝 Stored OAuth role for Google:', roleParam, 'sessionId:', sessionId);
    }
    
    return super.canActivate(context) as Promise<boolean>;
  }
}

// Export the store for strategy to access
export { oauthRoleStore };



