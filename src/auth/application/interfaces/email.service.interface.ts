export interface IEmailService {
  sendVerificationCode(email: string, code: string): Promise<void>; // Send 4-digit verification code
  sendVerificationToken(email: string, token: string): Promise<void>; // Send verification token link
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
  sendWelcomeEmail(email: string, name: string): Promise<void>;
}

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');
