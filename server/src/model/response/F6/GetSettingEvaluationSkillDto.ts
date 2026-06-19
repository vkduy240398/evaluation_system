import { ApiProperty } from '@nestjs/swagger';

class Department {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'ER#' })
  name: string;
}

class User {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'Username' })
  fullName: string;
}

class Skill {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'Skill 1' })
  name: string;

  @ApiProperty({ type: User, example: [] })
  skillApprovers: User[];

  @ApiProperty({ type: User, example: [] })
  skillSetters: User[];

  @ApiProperty({ type: [Department] })
  skillDepartments: Department[];

  @ApiProperty({ type: String, example: 'skill-key-2' })
  key: string;
}

export class GetSettingEvaluationSkillDto {
  @ApiProperty({ type: [Skill] })
  dataList: Department[];

  @ApiProperty({ type: Number, example: 1 })
  count: number;
}
