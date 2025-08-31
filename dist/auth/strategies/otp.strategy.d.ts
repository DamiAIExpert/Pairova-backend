import { Strategy } from 'passport-custom';
declare const OtpStrategy_base: new (...args: any[]) => Strategy;
export declare class OtpStrategy extends OtpStrategy_base {
    constructor();
    validate(req: any): Promise<any>;
}
export {};
