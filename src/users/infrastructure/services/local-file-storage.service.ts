import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Result } from '../../../shared/result/result';
import { FileStorageService, FileUploadOptions } from '../../domain/services/file-storage.service';
import { UploadedFile } from '../../domain/entities/uploaded-file.entity';
import { FileErrors } from '../../domain/errors/file.errors';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class LocalFileStorageService extends FileStorageService {
  private readonly uploadsDir: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.uploadsDir = this.configService.get<string>('UPLOADS_DIR', './uploads');
    this.baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');
  }

  async uploadFile(
    file: Express.Multer.File,
    options?: FileUploadOptions
  ): Promise<Result<UploadedFile>> {
    try {
      // Validar opciones
      if (options?.maxSize && file.size > options.maxSize) {
        return Result.fail(FileErrors.FILE_TOO_LARGE);
      }

      if (options?.allowedMimeTypes && !options.allowedMimeTypes.includes(file.mimetype)) {
        return Result.fail(FileErrors.INVALID_FILE_TYPE);
      }

      // Crear directorio si no existe
      const uploadFolder = options?.folder || 'general';
      const fullUploadDir = path.join(this.uploadsDir, uploadFolder);
      
      await this.ensureDirectoryExists(fullUploadDir);

      // Generar nombre de archivo
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const filename = options?.filename 
        ? `${options.filename}${extension}`
        : `${timestamp}${extension}`;

      // Ruta completa del archivo
      const filePath = path.join(fullUploadDir, filename);
      const relativePath = path.join(uploadFolder, filename).replace(/\\/g, '/');

      // Guardar archivo
      await fs.writeFile(filePath, file.buffer);

      // Crear URL del archivo
      const fileUrl = `${this.baseUrl}/uploads/${relativePath}`;

      // Crear entidad UploadedFile
      const uploadedFile = new UploadedFile(
        relativePath,
        fileUrl,
        {
          filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        }
      );

      return Result.ok(uploadedFile);
    } catch (error) {
      return Result.fail(
        FileErrors.uploadError(error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  async deleteFile(filePath: string): Promise<Result<void>> {
    try {
      const fullPath = path.join(this.uploadsDir, filePath);
      
      // Verificar si el archivo existe
      const exists = await this.fileExists(filePath);
      if (!exists) {
        return Result.fail(FileErrors.FILE_NOT_FOUND);
      }

      // Eliminar archivo
      await fs.unlink(fullPath);
      
      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        FileErrors.deleteError(error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  getFileUrl(filePath: string): string {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return `${this.baseUrl}/uploads/${normalizedPath}`;
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.uploadsDir, filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }
}
