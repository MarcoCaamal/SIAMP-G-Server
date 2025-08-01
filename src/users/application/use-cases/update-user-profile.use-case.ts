import { Inject, Injectable } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UpdateUserProfileDto } from '../dto/get-user-profile.dto';
import { UserErrors } from '../../domain/errors/user.errors';
import { UserProfileResponseDto } from '../dto/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, updateData: UpdateUserProfileDto): Promise<Result<UserProfileResponseDto>> {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return Result.fail(UserErrors.USER_NOT_FOUND);
      }

      // Validaciones de datos
      if (updateData.name !== undefined) {
        if (updateData.name.trim().length < 2) {
          return Result.fail(UserErrors.NAME_TOO_SHORT);
        }
        if (updateData.name.length > 50) {
          return Result.fail(UserErrors.NAME_TOO_LONG);
        }
      }

      // Validar zona horaria si se proporciona
      if (updateData.timezone !== undefined && updateData.timezone.trim().length === 0) {
        return Result.fail(UserErrors.INVALID_TIMEZONE);
      }

      // Actualizar solo los campos proporcionados
      const updatedUser = user.updateProfile(
        updateData.name,
        updateData.firstLastName,
        updateData.secondLastName,
        updateData.timezone,
      );
      const savedUser = await this.userRepository.update(updatedUser);

      const userProfileDto = UserMapper.toProfileResponse(savedUser);
      return Result.ok(userProfileDto);
    } catch (error) {
      return Result.fail(UserErrors.internalError('Error al actualizar el perfil del usuario'));
    }
  }
}
