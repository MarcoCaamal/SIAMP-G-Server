import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyEmailByCodeDto {
  @ApiProperty({
    description: '4-digit verification code',
    example: '1234'
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'El código debe tener exactamente 4 caracteres' })
  code: string;
  
  // Si necesitas incluir el email en esta DTO, descomenta estas líneas:
  // @ApiProperty({
  //   description: 'Email address to verify',
  //   example: 'user@example.com'
  // })
  // @IsEmail()
  // @IsNotEmpty()
  // email: string;
}
