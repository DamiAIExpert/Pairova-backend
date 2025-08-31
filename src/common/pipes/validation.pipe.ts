// src/common/pipes/validation.pipe.ts
import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * @class ValidationPipe
 * @description A custom validation pipe that uses `class-validator` and `class-transformer`.
 * Note: NestJS provides a built-in `ValidationPipe` which is highly configurable and
 * generally recommended. This custom implementation is provided for educational purposes
 * or for cases where very specific custom logic is required. It is configured globally in `main.ts`.
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  /**
   * Transforms and validates the incoming data.
   * @param value - The value to be processed.
   * @param metadata - The metadata of the argument.
   * @returns The validated and transformed value.
   * @throws {BadRequestException} If validation fails.
   */
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessages = this.formatErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.map((err) => {
      for (const property in err.constraints) {
        return err.constraints[property];
      }
    });
  }
}
