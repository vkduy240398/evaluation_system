import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

export class GetMailTemplateListDTO {
  @ApiProperty({
    type: String,
    example: '',
  })
  name: string;
}
export class EditMailTemplateObj {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;
  @ApiProperty({
    type: String,
    example: '',
  })
  name: string;
  @ApiProperty({
    type: String,
    example: '',
  })
  subject: string;
  @ApiProperty({
    type: String,
    example: '',
  })
  note: string;
  @ApiProperty({
    type: String,
    example: '',
  })
  content: string;

  @ApiProperty({
    type: Object,
    example: {
      active: 1,
      days: [0, 1, 2],
    },
  })
  setting: any;
}
