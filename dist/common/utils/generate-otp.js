"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
const crypto_1 = require("crypto");
function generateOTP(length = 6) {
    if (length <= 0) {
        throw new Error('OTP length must be a positive number.');
    }
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return (0, crypto_1.randomInt)(min, max).toString().padStart(length, '0');
}
//# sourceMappingURL=generate-otp.js.map