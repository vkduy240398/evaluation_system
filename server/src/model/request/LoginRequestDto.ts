import { ApiProperty } from '@nestjs/swagger';
import { Mock } from 'src/enum/Mock';

export class LoginRequestDto {
  @ApiProperty({
    type: String,
    description: 'email of user',
    example: Mock.email,
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'password of user',
    example: Mock.password,
  })
  password: string;
}
