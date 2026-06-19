/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { ApiProperty } from '@nestjs/swagger';

const setters = [
  {
    id: 2,
    employeeNumber: '0000001',
    fullName: 'User1',
    email: 'user1@geonet.co.jp',
    departmentId: 503,
    divisionId: 502,
    companyId: 2,
    active: 1,
    level: 2,
    flagSkill: 1,
    createdTime: '2023-10-09T02:50:49.710Z',
    updatedTime: '2023-10-16T06:16:16.443Z',
    department_id: 503,
    division_id: 502,
    company_id: 2,
    roles: [
      {
        id: 4,
        name: 'PRO_SKILL_APPROVAL',
        createdTime: '2023-10-09T01:34:56.074Z',
        updatedTime: '2023-10-09T01:34:56.074Z',
        Permission: {
          userId: 2,
          roleId: 4,
          createdTime: '2023-10-09T02:59:25.083Z',
          updatedTime: '2023-10-09T02:59:25.083Z',
          user_id: 2,
          role_id: 4,
        },
      },
      {
        id: 3,
        name: 'PRO_SKILL_SETTING',
        createdTime: '2023-10-09T01:34:56.074Z',
        updatedTime: '2023-10-09T01:34:56.074Z',
        Permission: {
          userId: 2,
          roleId: 3,
          createdTime: '2023-10-09T02:59:25.083Z',
          updatedTime: '2023-10-09T02:59:25.083Z',
          user_id: 2,
          role_id: 3,
        },
      },
    ],
  },
  {
    id: 3,
    employeeNumber: '0000002',
    fullName: 'User2',
    email: 'user2@geonet.co.jp',
    departmentId: 503,
    divisionId: 502,
    companyId: 2,
    active: 1,
    level: 2,
    flagSkill: 1,
    createdTime: '2023-10-09T02:50:49.710Z',
    updatedTime: '2023-10-24T03:52:29.351Z',
    department_id: 503,
    division_id: 502,
    company_id: 2,
    roles: [
      {
        id: 3,
        name: 'PRO_SKILL_SETTING',
        createdTime: '2023-10-09T01:34:56.074Z',
        updatedTime: '2023-10-09T01:34:56.074Z',
        Permission: {
          userId: 3,
          roleId: 3,
          createdTime: '2023-10-24T03:52:27.411Z',
          updatedTime: '2023-10-24T03:52:27.411Z',
          user_id: 3,
          role_id: 3,
        },
      },
      {
        id: 4,
        name: 'PRO_SKILL_APPROVAL',
        createdTime: '2023-10-09T01:34:56.074Z',
        updatedTime: '2023-10-09T01:34:56.074Z',
        Permission: {
          userId: 3,
          roleId: 4,
          createdTime: '2023-10-24T03:52:27.411Z',
          updatedTime: '2023-10-24T03:52:27.411Z',
          user_id: 3,
          role_id: 4,
        },
      },
    ],
  },
];

const approvers = [
  {
    id: 2,
    employeeNumber: '0000001',
    fullName: 'User1',
    email: 'user1@geonet.co.jp',
    departmentId: 503,
    divisionId: 502,
    companyId: 2,
    active: 1,
    level: 2,
    flagSkill: 1,
    createdTime: '2023-10-09T02:50:49.710Z',
    updatedTime: '2023-10-16T06:16:16.443Z',
    department_id: 503,
    division_id: 502,
    company_id: 2,
    roles: [
      {
        id: 4,
        name: 'PRO_SKILL_APPROVAL',
        createdTime: '2023-10-09T01:34:56.074Z',
        updatedTime: '2023-10-09T01:34:56.074Z',
        Permission: {
          userId: 2,
          roleId: 4,
          createdTime: '2023-10-09T02:59:25.083Z',
          updatedTime: '2023-10-09T02:59:25.083Z',
          user_id: 2,
          role_id: 4,
        },
      },
      {
        id: 3,
        name: 'PRO_SKILL_SETTING',
        createdTime: '2023-10-09T01:34:56.074Z',
        updatedTime: '2023-10-09T01:34:56.074Z',
        Permission: {
          userId: 2,
          roleId: 3,
          createdTime: '2023-10-09T02:59:25.083Z',
          updatedTime: '2023-10-09T02:59:25.083Z',
          user_id: 2,
          role_id: 3,
        },
      },
    ],
  },
  {
    id: 3,
    employeeNumber: '0000002',
    fullName: 'User2',
    email: 'user2@geonet.co.jp',
    departmentId: 503,
    divisionId: 502,
    companyId: 2,
    active: 1,
    level: 2,
    flagSkill: 1,
    createdTime: '2023-10-09T02:50:49.710Z',
    updatedTime: '2023-10-24T03:52:29.351Z',
    department_id: 503,
    division_id: 502,
    company_id: 2,
    roles: [
      {
        id: 3,
        name: 'PRO_SKILL_SETTING',
        createdTime: '2023-10-09T01:34:56.074Z',
        updatedTime: '2023-10-09T01:34:56.074Z',
        Permission: {
          userId: 3,
          roleId: 3,
          createdTime: '2023-10-24T03:52:27.411Z',
          updatedTime: '2023-10-24T03:52:27.411Z',
          user_id: 3,
          role_id: 3,
        },
      },
      {
        id: 4,
        name: 'PRO_SKILL_APPROVAL',
        createdTime: '2023-10-09T01:34:56.074Z',
        updatedTime: '2023-10-09T01:34:56.074Z',
        Permission: {
          userId: 3,
          roleId: 4,
          createdTime: '2023-10-24T03:52:27.411Z',
          updatedTime: '2023-10-24T03:52:27.411Z',
          user_id: 3,
          role_id: 4,
        },
      },
    ],
  },
];

export class GetUserActiveDto {
  @ApiProperty({ type: [], example: setters })
  setters: any[];

  @ApiProperty({ type: [], example: approvers })
  approvers: any[];
}
