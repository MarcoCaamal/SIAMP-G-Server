import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProfilePictureService {
  private readonly uploadsDir: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadsDir = path.join(process.cwd(), 'uploads', 'profile-pictures');
    this.baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');
    
    // Crear directorio si no existe
    this.ensureUploadsDirectoryExists();
  }

  private ensureUploadsDirectoryExists(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Guarda una imagen en disco y retorna el nombre del archivo
   */
  async saveProfilePicture(file: Express.Multer.File): Promise<string> {
    // Validar tipo de archivo
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten JPEG, PNG y WebP.');
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo 5MB permitido.');
    }

    // Generar nombre único
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadsDir, fileName);

    // Guardar archivo
    await fs.promises.writeFile(filePath, file.buffer);

    return fileName;
  }

  /**
   * Elimina una foto de perfil del disco
   */
  async deleteProfilePicture(fileName: string): Promise<void> {
    if (!fileName) return;

    const filePath = path.join(this.uploadsDir, fileName);
    
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error(`Error deleting profile picture: ${fileName}`, error);
      // No lanzar error para no afectar la operación principal
    }
  }

  /**
   * Obtiene la URL pública de una foto de perfil
   */
  getPublicUrl(fileName: string): string {
    if (!fileName) return '';
    return `${this.baseUrl}/uploads/profile-pictures/${fileName}`;
  }

  /**
   * Verifica si un archivo existe en disco
   */
  fileExists(fileName: string): boolean {
    if (!fileName) return false;
    const filePath = path.join(this.uploadsDir, fileName);
    return fs.existsSync(filePath);
  }
}
