import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class EditProskillDto {
  @IsString({ message: 'skillName must be a string' })
  @MaxLength(100)
  @IsNotEmpty({ message: 'skillName cannot be blank' })
  skillName: string;

  @IsNumber({}, { each: true })
  @ArrayMinSize(1, { message: 'setters cannot be an empty array' })
  skillSetters: number[];

  @IsNumber({}, { each: true })
  @ArrayMinSize(1, { message: 'approvers cannot be an empty array' })
  skillApprovers: number[];

  @IsNumber({}, { each: true })
  @ArrayMinSize(0)
  departments: number[];

  @IsNumber({}, { each: true })
  @ArrayMinSize(0)
  divisions: number[];
}
