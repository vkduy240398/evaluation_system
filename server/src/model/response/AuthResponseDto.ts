import { ApiProperty } from '@nestjs/swagger';
import { Mock } from 'src/enum/Mock';
import { RoleName } from '../../constant/RoleName';

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidmlldG5hbS5zeXN0ZW1AZ2VvbmV0LmNvLmpwIiwiZnVsbE5hbWUiOiLjg5njg4jjg4rjg6Ag44K344K544OG44OgIiwiZW1wbG95ZWVOdW1iZXIiOiIyMDA0MDQ1IiwiYWN0aXZlIjoxLCJyb2xlcyI6W3sibmFtZSI6IlVTRVIifSx7Im5hbWUiOiJFVkFMVUFUT1IifSx7Im5hbWUiOiJQUk9fU0tJTExfU0VUVElORyJ9LHsibmFtZSI6IlBST19TS0lMTF9BUFBST1ZBTCJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfQkFTSUNfQkVIQVZJT1JfU0VUVElORyJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfRVZBTFVBVElPTiJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfRVZBTFVBVElPTl9TRVRUSU5HIn0seyJuYW1lIjoiTUFOQUdFTUVOVF9VU0VSIn1dLCJkZXBhcnRtZW50SWQiOjEsImRlcGFydG1lbnROYW1lIjoi776N776e776E776F776R6ZaL55m66KqyIiwiY29tcGFueUlkIjoxLCJjb21wYW55TmFtZSI6IuagquW8j-S8muekvuOCsuOCquODm-ODvOODq-ODh-OCo-ODs-OCsOOCuSIsImxldmVsIjoxLCJpYXQiOjE2ODE4MDM4ODIsImV4cCI6MTY4MTgwNTY4Mn0.cTWoZ5AF5zTN1YNckT1kAlBGumPUW8jsMU4AG73gXAI';
const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidmlldG5hbS5zeXN0ZW1AZ2VvbmV0LmNvLmpwIiwiZnVsbE5hbWUiOiLjg5njg4jjg4rjg6Ag44K344K544OG44OgIiwiZW1wbG95ZWVOdW1iZXIiOiIyMDA0MDQ1IiwiYWN0aXZlIjoxLCJyb2xlcyI6W3sibmFtZSI6IlVTRVIifSx7Im5hbWUiOiJFVkFMVUFUT1IifSx7Im5hbWUiOiJQUk9fU0tJTExfU0VUVElORyJ9LHsibmFtZSI6IlBST19TS0lMTF9BUFBST1ZBTCJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfQkFTSUNfQkVIQVZJT1JfU0VUVElORyJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfRVZBTFVBVElPTiJ9LHsibmFtZSI6Ik1BTkFHRU1FTlRfRVZBTFVBVElPTl9TRVRUSU5HIn0seyJuYW1lIjoiTUFOQUdFTUVOVF9VU0VSIn1dLCJkZXBhcnRtZW50SWQiOjEsImRlcGFydG1lbnROYW1lIjoi776N776e776E776F776R6ZaL55m66KqyIiwiY29tcGFueUlkIjoxLCJjb21wYW55TmFtZSI6IuagquW8j-S8muekvuOCsuOCquODm-ODvOODq-ODh-OCo-ODs-OCsOOCuSIsImxldmVsIjoxLCJpYXQiOjE2ODE4MDM4ODIsImV4cCI6MTY4MjQwODY4Mn0.jRorLUI7JJT2Hfh-ojbpbIR4pCkFGC7b8VIm1HBG54Q';

const roles = [{ name: RoleName[1] }, { name: RoleName[2] }];

class RoleDto {
  @ApiProperty({
    type: String,
    description: 'Role of user',
  })
  name: string;
}

export class UserResponseDto {
  @ApiProperty({
    type: Number,
    description: 'userId',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    type: String,
    description: 'email',
    example: Mock.email,
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Full name',
    example: Mock.fullName,
  })
  fullName: string;

  @ApiProperty({
    type: String,
    description: 'Employee number',
    example: Mock.employeeNumber,
  })
  employeeNumber: string;

  @ApiProperty({
    type: Number,
    description: 'Active',
    example: Mock.active,
  })
  active: number;

  @ApiProperty({
    type: [RoleDto],
    description: 'Roles for user',
    example: roles,
  })
  roles: RoleDto[];

  @ApiProperty({
    type: Number,
    description: 'Department id of user',
    example: Mock.departmentId,
  })
  departmentId: number;

  @ApiProperty({
    type: String,
    description: 'Department name of user',
    example: Mock.departmentName,
  })
  departmentName: string;

  @ApiProperty({
    type: Number,
    description: 'Company id of user',
    example: Mock.companyId,
  })
  companyId: number;

  @ApiProperty({
    type: String,
    description: 'Company id of user',
    example: Mock.companyName,
  })
  companyName: string;

  @ApiProperty({
    type: Number,
    description: 'Salary level of user',
    example: Mock.level,
  })
  level: number;

  @ApiProperty({
    type: String,
    description: 'Email for HR',
    example: '',
  })
  emailHR: string;
}

export class AuthResponseDto {
  @ApiProperty({
    type: String,
    description: 'access token',
    example: accessToken,
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'refresh token',
    example: refreshToken,
  })
  refreshToken: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'user credential',
  })
  user: UserResponseDto;
}
