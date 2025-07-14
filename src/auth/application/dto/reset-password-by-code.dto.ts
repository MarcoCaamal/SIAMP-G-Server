import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ResetPasswordByCodeDto {
  @ApiProperty({
    description: '4-digit password reset code',
    example: '1234'
  })
  @IsString()
  @IsNotEmpty({ message: 'Reset code is required' })
  @Matches(/^\d{4}$/, { message: 'Reset code must be exactly 4 digits' })
  code: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewPassword123!'
  })
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  newPassword: string;
}
