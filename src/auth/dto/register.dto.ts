import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @ApiProperty({
    example: 'jane.doe@example.com',
    description: 'The email address for the new account. Must be unique and valid.',
    format: 'email',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    minLength: 5,
    maxLength: 255,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'The password for the new account. Must be at least 8 characters long and contain uppercase, lowercase, number, and special character.',
    minLength: 8,
    maxLength: 128,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    enum: [Role.APPLICANT, Role.NONPROFIT],
    example: Role.APPLICANT,
    description: 'The role of the new user. APPLICANT for job seekers, NONPROFIT for organizations posting jobs.',
    enumName: 'UserRole',
  })
  @IsEnum(Role, { message: 'Role must be either APPLICANT or NONPROFIT' })
  @IsNotEmpty({ message: 'Role is required' })
  role: Role;
}
