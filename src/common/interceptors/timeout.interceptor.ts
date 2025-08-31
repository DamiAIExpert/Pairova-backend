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
    return next.handle().pipe(
      timeout(this.timeoutDuration),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException(
            `Request timed out after ${this.timeoutDuration}ms`,
          );
        }
        throw err;
      }),
    );
  }
}
