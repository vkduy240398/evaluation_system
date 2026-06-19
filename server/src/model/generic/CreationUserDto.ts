import { ApiProperty } from '@nestjs/swagger';

export class CreationUserDto {
  @ApiProperty({ type: Number, example: 97 })
  id: number;

  @ApiProperty({ type: String, example: 'Tran LeHaNam' })
  fullName: string;
}
