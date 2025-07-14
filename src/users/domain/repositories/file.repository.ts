import { Result } from '../../../shared/result/result';
import { UploadedFile } from '../entities/uploaded-file.entity';

export interface FileUploadOptions {
  folder?: string;
  filename?: string;
  maxSize?: number;
  allowedMimeTypes?: string[];
}

export abstract class FileStorageService {
  abstract uploadFile(
    file: Express.Multer.File,
    options?: FileUploadOptions
  ): Promise<Result<UploadedFile>>;

  abstract deleteFile(filePath: string): Promise<Result<void>>;

  abstract getFileUrl(filePath: string): string;

  abstract fileExists(filePath: string): Promise<boolean>;
}
