import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EditUserRequestDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  company: { id: number; name: string };

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  department: { id: number; codeName: string };

  @ApiProperty()
  @ValidateNested()
  @IsOptional()
  division: {
    id: number;
    codeName: string;
    divisionId: number;
  };

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  level: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  levelOld: number;

  @ApiProperty()
  @IsOptional()
  roles: number[];

  @ApiProperty()
  @IsBoolean()
  isChangeRoleF2: boolean;

  @ApiProperty()
  @IsBoolean()
  isChangeRoleF3: boolean;

  @ApiProperty()
  @IsBoolean()
  isChangeRoleF4: boolean;

  @ApiProperty()
  @IsNumber()
  typeChangeRoleF1: number;

  @ApiProperty()
  updatedTime: any;
  @ApiProperty()
  @IsNumber()
  radioLevelvalue: number;
  @ApiProperty()
  @IsNumber()
  flagSkillValue: number;
  @ApiProperty()
  @IsNumber()
  oldFlagSkill: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fullName: string;
}
