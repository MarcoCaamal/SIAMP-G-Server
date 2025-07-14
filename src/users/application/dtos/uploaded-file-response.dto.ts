import { ApiProperty } from '@nestjs/swagger';

export class UploadedFileResponseDto {
  @ApiProperty({
    description: 'File URL for accessing the uploaded file',
    example: 'http://localhost:3000/uploads/profiles/user-123-profile.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'File path relative to upload directory',
    example: 'profiles/user-123-profile.jpg',
  })
  path: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'my-picture.jpg',
  })
  originalName: string;

  @ApiProperty({
    description: 'Generated filename',
    example: 'user-123-profile-1640995200000.jpg',
  })
  filename: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'image/jpeg',
  })
  mimetype: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024576,
  })
  size: number;

  @ApiProperty({
    description: 'Upload timestamp',
    example: '2023-12-31T23:59:59.999Z',
  })
  uploadedAt: Date;
}
