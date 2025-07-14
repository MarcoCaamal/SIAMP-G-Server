import { Inject, Injectable } from '@nestjs/common';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/repositories/auth.repository.interface';
import { ResetPasswordByCodeDto } from '../dto/reset-password-by-code.dto';
import { Result } from '../../../shared/result/result';
import { AuthErrors } from '../../domain/errors/auth.errors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResetPasswordByCodeUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(
    resetPasswordDto: ResetPasswordByCodeDto,
  ): Promise<Result<{ message: string }>> {
    try {
      // Find user by reset code
      const user = await this.authRepository.findUserByResetCode(
        resetPasswordDto.code,
      );

      if (!user) {
        return Result.fail<{ message: string }>(AuthErrors.INVALID_RESET_CODE);
      }

      // Check if reset code is expired
      if (
        user.resetToken &&
        new Date() > user.resetToken.expiresAt
      ) {
        return Result.fail<{ message: string }>(AuthErrors.RESET_CODE_EXPIRED);
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
