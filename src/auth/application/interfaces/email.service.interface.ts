export interface IEmailService {
  sendVerificationCode(email: string, code: string): Promise<void>; // Send 4-digit verification code
  sendVerificationToken(email: string, token: string): Promise<void>; // Send verification token link
  sendPasswordResetCode(email: string, code: string): Promise<void>; // Send 4-digit password reset code
  sendPasswordResetToken(email: string, token: string): Promise<void>; // Send password reset token link
  sendPasswordResetEmail(email: string, token: string): Promise<void>; // Legacy method
  sendWelcomeEmail(email: string, name: string): Promise<void>;
}

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');
