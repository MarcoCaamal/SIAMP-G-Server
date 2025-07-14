import { Injectable } from '@nestjs/common';
import { IEmailService } from '../../application/interfaces/email.service.interface';

@Injectable()
export class ConsoleEmailService implements IEmailService {
  async sendVerificationCode(email: string, code: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    console.log(`
    📧 Verification Email (Code)
    To: ${email}
    Subject: Verify your email address
    
    Your verification code is: ${code}
    
    Enter this code in the app to verify your email address.
    This code will expire in 15 minutes.
    `);
  }

  async sendVerificationToken(email: string, token: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    console.log(`
    📧 Verification Email (Token)
    To: ${email}
    Subject: Verify your email address
    
    Click the following link to verify your email:
    ${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}
    
    This link will expire in 24 hours.
    `);
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    console.log(`
    📧 Password Reset Code
    To: ${email}
    Subject: Your password reset code
    
    Your password reset code is: ${code}
    
    Enter this code in the app to reset your password.
    This code will expire in 15 minutes.
    `);
  }

  async sendPasswordResetToken(email: string, token: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    console.log(`
    📧 Password Reset Token
    To: ${email}
    Subject: Reset your password
    
    Click the following link to reset your password:
    ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}
    
    This link will expire in 1 hour.
    `);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    console.log(`
    📧 Password Reset Email (Legacy)
    To: ${email}
    Subject: Reset your password
    
    Click the following link to reset your password:
    ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}
    
    This link will expire in 1 hour.
    `);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    console.log(`
    📧 Welcome Email
    To: ${email}
    Subject: Welcome to our platform!
    
    Hi ${name},
    
    Welcome to our platform! Your account has been successfully verified.
    You can now start using all the features available.
    
    Best regards,
    The Team
    `);
  }
}
