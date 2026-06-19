import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class DepartmentRequestDto {
  code: string;
  name: string;
  class: number;
  type: number;
  active: number;
  division: number;
}

export class DepartmentRequestAdd {
  @ApiProperty()
  code: string;
  name: string;
  @ApiProperty()
  class: number;
  @ApiProperty()
  type: number;
  @ApiProperty()
  active: number;
  @ApiProperty()
  division: number;
}
export class DivisionSubclassRequestDTO {
  divisionId: number;
  departmentId: number;
}

export class DepartmentUpdateRequestDto {
  code: string;
  name: string;
  oldCode: string;
  oldName: string;
  updatedTime: string;
  divisionId: any;
  divisionOldId: any;
  radioPeriod?: number;
}

export class DepartmentSearchRequestDto {
  @ApiProperty()
  @IsString()
  catergory: string;

  @ApiProperty()
  @IsString()
  classification: string;

  @ApiProperty()
  @IsString()
  departmentCodeAndName: string;

  @ApiProperty()
  @IsNumberString()
  offset: any;

  @ApiProperty()
  @IsNumberString()
  limit: any;

  @ApiProperty()
  @IsString()
  sortBy: any;

  @ApiProperty()
  @IsString()
  sortType: any;
}

export class RequestEditDepartmentGnw {
  @ApiProperty()
  code: string;
  @ApiProperty()
  divisionId: number;
  @ApiProperty()
  divisionOldId: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  oldCode: string;
  @ApiProperty()
  oldName: string;
  @ApiProperty()
  updatedTime: string;
  @ApiProperty()
  uptDepName: number;
}

export class DeleteDepartment {
  @ApiProperty()
  updatedTime: string;
}
