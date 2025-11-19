// src/common/interceptors/timeout.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * @class TimeoutInterceptor
 * @description An interceptor that terminates a request if it takes too long to process.
 * This prevents long-running requests from holding up server resources.
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  /**
   * @param {number} [timeoutDuration=15000] - The timeout in milliseconds. Defaults to 15 seconds.
   */
  constructor(private readonly timeoutDuration: number = 15000) {}

  /**
   * Intercepts the request and applies a timeout.
   * @param context - The execution context.
   * @param next - The next handler.
   * @returns An observable of the response.
   * @throws {RequestTimeoutException} If the request processing time exceeds the configured duration.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const url = request.url || '';
    const method = request.method || '';
    
    // Use longer timeout for file uploads (Cloudinary can be slow)
    const isUpload = url.includes('/upload');
    // Use longer timeout for job creation (can be slow with many fields and database operations)
    const isJobCreation = url.includes('/ngos/me/jobs') && method === 'POST';
    // Use longer timeout for registration, saved-jobs, and chat endpoints (database operations can be slow)
    const isRegistration = url.includes('/register');
    const isSavedJobs = url.includes('/saved-jobs');
    const isNonprofitJobs = url.includes('/ngos/me/jobs');
    const isChat = url.includes('/chat');
    
    let timeoutDuration = this.timeoutDuration;
    if (isUpload) {
      timeoutDuration = 60000; // 60 seconds for uploads
    } else if (isJobCreation) {
      timeoutDuration = 45000; // 45 seconds for job creation
    } else if (isRegistration || isSavedJobs || isNonprofitJobs || isChat) {
      timeoutDuration = 30000; // 30 seconds for other database operations
    }
    
    return next.handle().pipe(
      timeout(timeoutDuration),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException(
            `Request timed out after ${timeoutDuration}ms`,
          );
        }
        throw err;
      }),
    );
  }
}
