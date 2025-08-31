import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@pairova.com',
    description: 'The user\'s email address.',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The 6-digit OTP code sent to the user\'s email.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  token: string;

  @ApiProperty({
    example: 'NewSecureP@ssword!',
    description: 'The new password for the account.',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
