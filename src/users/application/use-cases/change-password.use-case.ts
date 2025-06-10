import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Result } from '../../../shared/result/result';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { ChangePasswordDto } from '../dto/get-user-profile.dto';
import { UserErrors } from '../../domain/errors/user.errors';
import { ChangePasswordResponseDto } from '../dto/user-response.dto';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, changePasswordData: ChangePasswordDto): Promise<Result<ChangePasswordResponseDto>> {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return Result.fail(UserErrors.USER_NOT_FOUND);
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordData.currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        return Result.fail(UserErrors.INVALID_CURRENT_PASSWORD);
      }

      // Validar nueva contraseña (longitud mínima, etc.)
      if (changePasswordData.newPassword.length < 8) {
        return Result.fail(UserErrors.WEAK_PASSWORD);
      }

      // Verificar que la nueva contraseña sea diferente
      const isSamePassword = await bcrypt.compare(
        changePasswordData.newPassword,
        user.password
      );

      if (isSamePassword) {
        return Result.fail(UserErrors.SAME_PASSWORD_ERROR);
      }

      // Hash de la nueva contraseña
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(changePasswordData.newPassword, saltRounds);      // Actualizar contraseña
      const updatedUser = user.updatePassword(hashedNewPassword);
      await this.userRepository.update(updatedUser);
      
      const responseDto = new ChangePasswordResponseDto('Contraseña actualizada exitosamente');
      return Result.ok(responseDto);
    } catch (error) {
      return Result.fail(UserErrors.internalError('Error al cambiar la contraseña'));
    }
  }
}
