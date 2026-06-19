import { HttpStatus } from '@nestjs/common';
import { DateResponseDto } from './DateResponseDto';
import { ApiProperty } from '@nestjs/swagger';

export class VersionSettingConflictUpdateDto extends DateResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.CONFLICT })
  code: number;
}
