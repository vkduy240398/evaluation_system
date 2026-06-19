import { ApiProperty } from '@nestjs/swagger';

export class ProskillChildren {
  key: any;

  @ApiProperty({ type: Number, example: 13 })
  id: number;

  @ApiProperty({ type: String, example: '5zmm' })
  itemId: string;

  @ApiProperty({ type: String, example: 'Webマーケター' })
  jobType: string;

  @ApiProperty({ type: String, example: '媒体理解' })
  smallClass: string;

  @ApiProperty({ type: String, example: 'Web広告ディレクション_プランニング_' })
  mediumClass: string;

  @ApiProperty({ type: String, example: '目的にそった効率的な広告媒体とターゲティングを提案・判断できているか。' })
  content: string;

  @ApiProperty({ type: Number, example: 5 })
  difficulty: number;

  @ApiProperty({ type: String, example: 'ﾏｰｹﾃｨﾝｸﾞ部' })
  note: string;
}

export class SettersAndApproversDto {
  key: any;

  @ApiProperty({ type: [String], example: ['ベトナム システム', 'vo.thi.huyen.trang'] })
  setters: string[];

  @ApiProperty({ type: [String], example: ['tran.dang.khoa', 'huynh.ngoc.hung'] })
  approvers: string[];

}

export class VersionProSkillDetail {

  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: '215ca4c8dede7742ca1f2fd0469c6668' })
  key: number;

  @ApiProperty({ type: String, example: 'GNW-000001' })
  departmentCode: string;

  @ApiProperty({ type: String, example: 'department_1' })  
  departmentName: string;

  @ApiProperty({ type: String, example: '1.0' })
  version: string;

  @ApiProperty({ type: Number, example: 0 })
  versionSub: number;

  @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
  publicDate: Date;

  @ApiProperty({ type: Number, example: 0 })
  publicStatus: number;

  @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
  lastUpdatedTime: Date;

  @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
  updatedTime: Date;

  @ApiProperty({ type: String, example: 'huynh.ngoc.hung' })
  userUpdated: string;

  @ApiProperty({ type: Number, example: 4 })
  status: number;

  @ApiProperty({ type: Number, example: 1 })
  departmentId: number;
}

class ProFormula {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: 1 })
  versionId: number;

  @ApiProperty({ type: Number, example: 1 })
  point: number;

  @ApiProperty({ type: String, example: "note" })
  note: string;
}

export class ListPoint {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: 1 })
  type: number;

  @ApiProperty({ type: Number, example: 1 })
  version: number;

  @ApiProperty({ type: String, example: 0 })
  subVersion: string;

  @ApiProperty({ type: Number, example: 4 })
  status: number;

  @ApiProperty({ type: Number, example: 1 })
  creationUser: number;

  @ApiProperty({ type: String, example: 'reason' })
  reason: string;

  @ApiProperty({ type: Number, example: 1 })
  basicMaxDifficulty: number;

  @ApiProperty({ type: Number, example: 1 })
  behaviorMaxWeight: number;

  @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
  publicDate: Date;

  @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
  lastUpdatedTime: Date;

  @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
  createTime: Date;

  @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
  updatedTime: Date;

  @ApiProperty({ type: [ProFormula] })
  settingProFormula: ProFormula[];
}

export class VersionDto {

  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'GNW-000001: Department-01' })
  department: string;

  @ApiProperty({ type: String, example: 'huynh.ngoc.hung' })
  userUpdated: string;

  @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
  updatedTime: Date;

  @ApiProperty({ type: Number, example: 0 })
  publicStatus: number;

  @ApiProperty({ type: Number, example: 4 })
  status: number;

  @ApiProperty({ type: String, example: '1.0' })
  version: string;

  @ApiProperty({ type: Number, example: 0 })
  versionSub: number;

  @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
  publicDate: Date;

  @ApiProperty({ type: String, example: "reason" })
  reason: string;
}