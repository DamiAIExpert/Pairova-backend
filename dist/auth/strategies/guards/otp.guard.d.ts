declare const OtpGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class OtpGuard extends OtpGuard_base {
    handleRequest(err: any, user: any, info: any): any;
}
export {};
