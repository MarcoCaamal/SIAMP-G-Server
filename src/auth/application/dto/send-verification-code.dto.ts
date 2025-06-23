import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationCodeDto {
  @ApiProperty({
    description: 'Email address to send verification code to',
    example: 'user@example.com'
  })
  email: string;
}
