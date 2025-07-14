import { Injectable } from '@nestjs/common';
import { Result } from '../../../shared/result/result';
import { FileStorageService } from '../../domain/services/file-storage.service';
import { UploadedFile } from '../../domain/entities/uploaded-file.entity';
import { FileErrors } from '../../domain/errors/file.errors';
import { UpdateUserProfileUseCase } from './update-user-profile.use-case';

@Injectable()
export class UploadProfilePictureUseCase {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ];

  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
  ) {}

  async execute(
    userId: string,
    file: Express.Multer.File,
    customFilename?: string
  ): Promise<Result<UploadedFile>> {
    // Validar que se proporcione un archivo
    if (!file) {
      return Result.fail(FileErrors.NO_FILE_PROVIDED);
    }

    // Validar tipo de archivo
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return Result.fail(FileErrors.INVALID_FILE_TYPE);
    }

    // Validar tamaño del archivo
    if (file.size > this.MAX_FILE_SIZE) {
      return Result.fail(FileErrors.FILE_TOO_LARGE);
    }

    try {
      // Configurar opciones de subida
      const uploadOptions = {
        folder: 'profiles',
        filename: customFilename 
          ? `${userId}-${customFilename}-${Date.now()}`
          : `${userId}-profile-${Date.now()}`,
        maxSize: this.MAX_FILE_SIZE,
        allowedMimeTypes: this.ALLOWED_MIME_TYPES,
      };

      // Subir archivo
      const uploadResult = await this.fileStorageService.uploadFile(file, uploadOptions);
      
      if (uploadResult.isFailure) {
        return uploadResult;
      }

      const uploadedFile = uploadResult.value!;

      // Actualizar usuario con nueva foto de perfil
      const updateResult = await this.updateUserProfileUseCase.execute(userId, {
        profilePicture: uploadedFile.url,
      });

      if (updateResult.isFailure) {
        // Si falla la actualización del usuario, intentar eliminar el archivo subido
        await this.fileStorageService.deleteFile(uploadedFile.path);
        return Result.fail(updateResult.error!);
      }

      return Result.ok(uploadedFile);
    } catch (error) {
      return Result.fail(
        FileErrors.uploadError(error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }
}
