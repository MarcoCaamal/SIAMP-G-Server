import {
  Controller,
  Post,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  ParseFilePipeBuilder,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { UploadProfilePictureUseCase } from '../../application/use-cases/upload-profile-picture.use-case';
import { DeleteProfilePictureUseCase } from '../../application/use-cases/delete-profile-picture.use-case';
import { UploadedFileResponseDto } from '../../application/dtos/uploaded-file-response.dto';
import { profilePictureMulterConfig } from '../../infrastructure/config/multer.config';

@ApiTags('User Profile Files')
@Controller('users/profile/files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserProfileFilesController {
  constructor(
    private readonly uploadProfilePictureUseCase: UploadProfilePictureUseCase,
    private readonly deleteProfilePictureUseCase: DeleteProfilePictureUseCase,
  ) {}

  @Post('profile-picture')
  @ApiOperation({ 
    summary: 'Upload profile picture',
    description: 'Upload a new profile picture for the authenticated user. Accepts JPEG, PNG, JPG, and WebP files up to 5MB.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile picture uploaded successfully',
    type: UploadedFileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file type, file too large, or no file provided',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to upload file',
  })
  @UseInterceptors(FileInterceptor('file', profilePictureMulterConfig))
  async uploadProfilePicture(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Query('customFilename') customFilename: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = (req as any).user?.id || '';
    
    const result = await this.uploadProfilePictureUseCase.execute(
      userId,
      file,
      customFilename,
    );

    if (result.isFailure) {
      return res.status(result.error?.statusCode || 500).json({
        error: result.error,
      });
    }

    const uploadedFile = result.value!;

    const response: UploadedFileResponseDto = {
      url: uploadedFile.url,
      path: uploadedFile.path,
      originalName: uploadedFile.metadata.originalName,
      filename: uploadedFile.metadata.filename,
      mimetype: uploadedFile.metadata.mimetype,
      size: uploadedFile.metadata.size,
      uploadedAt: uploadedFile.metadata.uploadedAt,
    };

    return res.status(200).json(response);
  }

  @Delete('profile-picture')
  @ApiOperation({ 
    summary: 'Delete profile picture',
    description: 'Delete the current profile picture of the authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile picture deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to delete profile picture',
  })
  async deleteProfilePicture(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    const userId = (req as any).user?.id || '';
    
    const result = await this.deleteProfilePictureUseCase.execute(userId);

    if (result.isFailure) {
      return res.status(result.error?.statusCode || 500).json({
        error: result.error,
      });
    }

    return res.status(200).json({
      message: 'Profile picture deleted successfully',
    });
  }
}
