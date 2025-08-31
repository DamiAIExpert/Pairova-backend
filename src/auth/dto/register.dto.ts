import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @ApiProperty({
    example: 'jane.doe@pairova.com',
    description: 'The email address for the new account.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'NewP@ssword123!',
    description: 'The password for the new account.',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    enum: [Role.APPLICANT, Role.NONPROFIT],
    example: Role.APPLICANT,
    description: 'The role of the new user.',
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
