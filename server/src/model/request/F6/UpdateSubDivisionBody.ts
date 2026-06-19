import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubDivisionBody {
  @ApiProperty({ type: Number, example: 1, nullable: true })
  setting: number;
}
