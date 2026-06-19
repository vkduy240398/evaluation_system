import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ConditionSearchPaging } from 'src/model/generic/ConditionSearchPaging';

export class ListVersionNotificationParam extends ConditionSearchPaging {
  @ApiProperty({ type: String, example: 2 })
  @IsNotEmpty({ message: 'status cannot be blank' })
  status: string;
}
