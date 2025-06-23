import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User\'s full name',
    example: 'John Doe'
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User\'s email address',
    example: 'user@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User\'s password',
    example: 'Str0ngP@ssw0rd'
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User\'s timezone',
    example: 'Europe/Madrid',
    required: false
  })
  @IsNotEmpty()
  timezone?: string;
}
