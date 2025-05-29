import { Injectable } from '@nestjs/common';
import { IEmailService } from '../../application/interfaces/email.service.interface';

@Injectable()
export class ConsoleEmailService implements IEmailService {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    console.log(`
    📧 Verification Email
    To: ${email}
    Subject: Verify your email address
    
    Click the following link to verify your email:
    ${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}
    
    This link will expire in 24 hours.
    `);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    console.log(`
    📧 Password Reset Email
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
