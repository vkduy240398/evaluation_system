import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

/**
 * Class validate for id, type: number
 *
 * @author tran.le.ha.nam
 */
export class IdNumberDto {
  @ApiProperty({ type: Number, example: 3 })
  @Matches(/\d+/, { message: 'Id must be a number' })
  @IsNotEmpty({ message: 'Id required' })
  id: number;
}

export class IdDto {
  idEvaluation: number;
  evaluationPeriodId: number;
}

export class ListIdNumberDto {
  @IsNotEmpty({ message: 'Id required' })
  ids: number[];
}
