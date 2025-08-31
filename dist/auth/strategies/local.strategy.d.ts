import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '../../users/shared/user.entity';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<Omit<User, 'passwordHash'>>;
}
export {};
