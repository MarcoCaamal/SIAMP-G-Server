import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationTokenDto {
  @ApiProperty({
    description: 'Email address to send verification token to',
    example: 'user@example.com'
  })
  email: string;
}
