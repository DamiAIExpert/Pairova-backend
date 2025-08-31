// src/common/enums/otp-channel.enum.ts

/**
 * @enum OtpChannel
 * @description Defines the channels through which an OTP can be sent and verified.
 */
export enum OtpChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  APP = 'APP', // For future use with authenticator apps
}

