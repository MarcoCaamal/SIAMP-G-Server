import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadProfilePictureDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile picture file (JPEG, PNG, JPG, WebP)',
    example: 'profile.jpg',
  })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Optional custom filename',
    example: 'my-profile-picture',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customFilename?: string;
}
