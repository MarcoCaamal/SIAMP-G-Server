import { Inject, Injectable } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserErrors } from '../../domain/errors/user.errors';
import { UserProfileResponseDto } from '../dto/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<Result<UserProfileResponseDto>> {
    try {
      const user = await this.userRepository.findById(userId);      
      if (!user) {
        return Result.fail(UserErrors.USER_NOT_FOUND);
      }

      const userProfileDto = UserMapper.toProfileResponse(user);
      return Result.ok(userProfileDto);
    } catch (error) {
      return Result.fail(UserErrors.internalError('Error al obtener el perfil del usuario'));
    }
  }
}
