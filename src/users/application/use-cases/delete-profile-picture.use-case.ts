import { Injectable } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { FileStorageService } from '../../domain/services/file-storage.service';
import { FileErrors } from '../../domain/errors/file.errors';
import { UpdateUserProfileUseCase } from './update-user-profile.use-case';
import { GetUserProfileUseCase } from './get-user-profile.use-case';

@Injectable()
export class DeleteProfilePictureUseCase {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  async execute(userId: string): Promise<Result<void>> {
    try {
      // Obtener perfil del usuario para obtener la URL de la foto actual
      const userResult = await this.getUserProfileUseCase.execute(userId);
      
      if (userResult.isFailure) {
        return Result.fail(userResult.error!);
      }

      const user = userResult.value!;
      
      // Verificar si el usuario tiene foto de perfil
      if (!user.profilePicture) {
        return Result.ok(undefined);
      }

      // Extraer el path del archivo de la URL
      const filePath = this.extractFilePathFromUrl(user.profilePicture);
      
      if (!filePath) {      // Si no se puede extraer el path, solo actualizar la base de datos
      const updateResult = await this.updateUserProfileUseCase.execute(userId, {
        profilePicture: undefined,
      });
      
      return updateResult.isSuccess ? Result.ok(undefined) : Result.fail(updateResult.error!);
      }

      // Verificar si el archivo existe antes de intentar eliminarlo
      const fileExists = await this.fileStorageService.fileExists(filePath);
      
      if (fileExists) {
        // Eliminar archivo físico
        const deleteResult = await this.fileStorageService.deleteFile(filePath);
        
        if (deleteResult.isFailure) {
          return deleteResult;
        }
      }

      // Actualizar usuario para quitar la foto de perfil
      const updateResult = await this.updateUserProfileUseCase.execute(userId, {
        profilePicture: undefined,
      });

      if (updateResult.isFailure) {
        return Result.fail(updateResult.error!);
      }

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        FileErrors.deleteError(error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  private extractFilePathFromUrl(url: string): string | null {
    try {
      // Extraer el path de la URL (asumiendo estructura: /uploads/profiles/filename)
      const urlPath = new URL(url).pathname;
      const uploadsIndex = urlPath.indexOf('/uploads/');
      
      if (uploadsIndex === -1) {
        return null;
      }
      
      return urlPath.substring(uploadsIndex + 9); // +9 para remover '/uploads/'
    } catch {
      return null;
    }
  }
}
