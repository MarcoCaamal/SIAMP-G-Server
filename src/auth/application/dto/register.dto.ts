import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User\'s full name',
    example: 'John Doe'
  })
  name: string;

  @ApiProperty({
    description: 'User\'s email address',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User\'s password',
    example: 'Str0ngP@ssw0rd'
  })
  password: string;

  @ApiProperty({
    description: 'User\'s timezone',
    example: 'Europe/Madrid',
    required: false
  })
  timezone?: string;
}
