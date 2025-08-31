// src/common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @interface Response
 * @description Defines the shape of the standardized successful response.
 */
export interface Response<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

/**
 * @class TransformInterceptor
 * @description An interceptor that wraps all successful responses in a standardized JSON structure.
 * This ensures a consistent response format across the entire API.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  /**
   * Intercepts the successful response and wraps it in a standard format.
   * @param context - The execution context.
   * @param next - The next handler.
   * @returns An observable of the transformed response.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next
      .handle()
      .pipe(map((data) => ({ success: true, statusCode, data })));
  }
}
