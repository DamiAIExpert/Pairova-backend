import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../users/shared/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: User, _loginDto: LoginDto): Promise<{
        accessToken: string;
    }>;
    register(registerDto: RegisterDto): Promise<User>;
    forgotPassword(dto: RequestPasswordResetDto): Promise<void>;
    resetPassword(dto: ResetPasswordDto): Promise<void>;
    getProfile(user: User): User;
}
