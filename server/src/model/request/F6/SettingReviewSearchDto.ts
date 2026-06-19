import {
    IsString,
    MaxLength,
    IsNumberString,
    IsEmpty,

  } from 'class-validator';
export class SettingReivewSearch {
  @IsEmpty()
  @IsString({ message: '閲覧対象者 must be a string' })
  @MaxLength(30)
  targetAudience: string;

  @IsEmpty()
  @IsNumberString()
  depDivAudience: number | string;

  @IsEmpty()
  @IsString({ message: '閲覧者 must be a string' })
  @MaxLength(30)
  viewer: string;

  @IsEmpty()
  @IsNumberString()
  matchDepartment: number | string;

  @IsEmpty()
  @IsNumberString()
  depDivViewer: number | string;
}