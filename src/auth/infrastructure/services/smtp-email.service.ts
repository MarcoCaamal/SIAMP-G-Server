import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { IEmailService } from '../../application/interfaces/email.service.interface';

@Injectable()
export class SmtpEmailService implements IEmailService {
  private readonly logger = new Logger(SmtpEmailService.name);
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
    } catch (error) {
      this.logger.error('SMTP connection verification failed:', error);
    }
  }
  async sendVerificationCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'SIAMP-G - Código de Verificación',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8EC5FC;">SIAMP-G</h2>
          <h3>Verifica tu dirección de correo electrónico</h3>
          
          <p>Tu código de verificación es:</p>
          
          <div style="background-color: #f8f9fa; border: 2px solid #8EC5FC; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 8px; margin: 0; color: #130065;">${code}</h1>
          </div>
          
          <p>Ingresa este código en la aplicación para verificar tu dirección de correo electrónico.</p>
          
          <p style="color: #666; font-size: 14px;">
            <strong>Este código expirará en 15 minutos.</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px;">
            Si no solicitaste este código, puedes ignorar este correo electrónico.
          </p>
          
          <p style="color: #888; font-size: 12px;">
            © 2025 SIAMP-G. Todos los derechos reservados.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification code sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification code to ${email}:`, error);
      throw new Error('Failed to send verification email');
    }
  }
  async sendVerificationToken(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'SIAMP-G - Verifica tu cuenta',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8EC5FC;">SIAMP-G</h2>
          <h3>Verifica tu dirección de correo electrónico</h3>
          
          <p>Haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #8EC5FC; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Verificar Email
            </a>
          </div>
          
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
            ${verificationUrl}
          </p>
          
          <p style="color: #666; font-size: 14px;">
            <strong>Este enlace expirará en 24 horas.</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px;">
            Si no creaste esta cuenta, puedes ignorar este correo electrónico.
          </p>
          
          <p style="color: #888; font-size: 12px;">
            © 2025 SIAMP-G. Todos los derechos reservados.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification token sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification token to ${email}:`, error);
      throw new Error('Failed to send verification email');
    }
  }
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'SIAMP-G - Restablece tu contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8EC5FC;">SIAMP-G</h2>
          <h3>Restablece tu contraseña</h3>
          
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Restablecer Contraseña
            </a>
          </div>
          
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
            ${resetUrl}
          </p>
          
          <p style="color: #666; font-size: 14px;">
            <strong>Este enlace expirará en 1 hora.</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px;">
            Si no solicitaste restablecer tu contraseña, puedes ignorar este correo electrónico.
          </p>
          
          <p style="color: #888; font-size: 12px;">
            © 2025 SIAMP-G. Todos los derechos reservados.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      throw new Error('Failed to send password reset email');
    }
  }
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'SIAMP-G - ¡Bienvenido!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8EC5FC;">SIAMP-G</h2>
          <h3>¡Bienvenido a nuestra plataforma!</h3>
          
          <p>Hola <strong>${name}</strong>,</p>
          
          <p>¡Bienvenido a SIAMP-G! Tu cuenta ha sido verificada exitosamente.</p>
          
          <div style="background-color: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>✅ Tu cuenta está lista para usar</strong></p>
            <p style="margin: 5px 0 0 0;">Ahora puedes acceder a todas las funcionalidades disponibles.</p>
          </div>
          
          <p>Gracias por unirte a nosotros. Si tienes alguna pregunta, no dudes en contactarnos.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px;">
            Saludos cordiales,<br>
            El equipo de SIAMP-G
          </p>
          
          <p style="color: #888; font-size: 12px;">
            © 2025 SIAMP-G. Todos los derechos reservados.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      throw new Error('Failed to send welcome email');
    }
  }
}
