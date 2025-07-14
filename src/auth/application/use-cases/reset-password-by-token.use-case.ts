import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import { ResetPasswordByTokenDto } from '../dto/reset-password-by-token.dto';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResetPasswordByTokenUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(
    resetPasswordDto: ResetPasswordByTokenDto,
  ): Promise<Result<{ message: string }>> {
    try {
      // Find user by reset token
      const user = await this.authRepository.findUserByResetToken(
        resetPasswordDto.token,
      );

      if (!user) {
        return Result.fail<{ message: string }>(AuthErrors.INVALID_RESET_TOKEN);
      }

      // Check if reset token is expired
      if (
        user.resetToken &&
        new Date() > user.resetToken.expiresAt
      ) {
        return Result.fail<{ message: string }>(AuthErrors.RESET_TOKEN_EXPIRED);
      }

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        resetPasswordDto.newPassword,
        saltRounds,
      );

      // Update user password and clear reset token
      const userWithNewPassword = user.updatePassword(hashedPassword);
      await this.authRepository.updateUser(userWithNewPassword);

      return Result.ok<{ message: string }>({
        message: 'Password reset successfully. You can now log in with your new password.',
      });
    } catch (error) {
      return Result.fail<{ message: string }>(
        AuthErrors.internalError(
          error instanceof Error ? error.message : 'Unknown error',
        ),
      );
    }
  }
}
