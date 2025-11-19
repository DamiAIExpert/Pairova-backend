import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LinkedInAuthGuard extends AuthGuard('linkedin') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    // Store role from query in session for callback handler
    const roleParam = request.query?.role as string;
    if (roleParam && (roleParam === 'applicant' || roleParam === 'nonprofit')) {
      if (!request.session) {
        request.session = {} as any;
      }
      request.session.oauthRole = roleParam;
      console.log('📝 Stored OAuth role in session for LinkedIn:', roleParam);
    }
    
    return super.canActivate(context) as Promise<boolean>;
  }
}



