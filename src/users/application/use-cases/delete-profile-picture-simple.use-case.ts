import { Inject, Injectable } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { ProfilePictureService } from '../services/profile-picture.service';

@Injectable()
export class DeleteProfilePictureUseCase2 {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly profilePictureService: ProfilePictureService,
  ) {}

  async execute(userId: string): Promise<Result<{ message: string }>> {
    try {
      // Buscar el usuario
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return Result.fail({
          code: 'USER_NOT_FOUND',
          message: 'Usuario no encontrado',
          statusCode: 404
        });
      }

      // Verificar si tiene foto de perfil
      if (!user.profilePicture) {
        return Result.ok({
          message: 'El usuario no tiene foto de perfil'
        });
      }

      // Eliminar archivo del disco
      await this.profilePictureService.deleteProfilePicture(user.profilePicture);

      // Actualizar usuario (quitar referencia a la foto)
      const updatedUser = user.updateProfile(
        undefined, 
        undefined, 
        undefined, 
        undefined, 
        '' // Vaciar el campo profilePicture
      );
      
      await this.userRepository.update(updatedUser);

      return Result.ok({
        message: 'Foto de perfil eliminada exitosamente'
      });

    } catch (error) {
      console.error('Error deleting profile picture:', error);
      
      return Result.fail({
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
        statusCode: 500
      });
    }
  }
}
