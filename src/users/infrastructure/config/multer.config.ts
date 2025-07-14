import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // El LocalFileRepository se encargará de crear los directorios
      cb(null, './uploads/temp');
    },
    filename: (req, file, cb) => {
      // Generar nombre temporal, el repositorio lo manejará
      const timestamp = Date.now();
      const extension = extname(file.originalname);
      cb(null, `temp-${timestamp}${extension}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, // Solo un archivo a la vez
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed'), false);
    }
  },
};

// Configuración específica para perfiles (usando memory storage para mayor control)
export const profilePictureMulterConfig: MulterOptions = {
  storage: 'memory' as any, // Usar memory storage para tener control total
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Invalid file type. Only JPEG, PNG, JPG, and WebP are allowed'), false);
    }
  },
};
