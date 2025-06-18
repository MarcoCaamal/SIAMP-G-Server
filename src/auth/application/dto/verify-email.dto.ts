import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: '4-digit verification code',
    example: '1234',
    required: false
  })
  code?: string;

  @ApiProperty({
    description: 'Verification token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false
  })
  token?: string;
}
