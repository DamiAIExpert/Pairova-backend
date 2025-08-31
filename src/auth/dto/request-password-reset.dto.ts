import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({
    example: 'user@pairova.com',
    description: 'The email address to send the password reset code to.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
