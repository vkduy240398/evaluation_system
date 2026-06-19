import { ApiProperty } from '@nestjs/swagger';

export class DepartmentDto {
  id?: number;
  code?: string;
  name?: string;
}

export class GetDepartmentApproved {
  @ApiProperty()
  active: number;
  @ApiProperty()
  class: number;
  @ApiProperty()
  code: string;
  @ApiProperty()
  createdTime: string;
  @ApiProperty()
  divisionId: number | null;
  @ApiProperty()
  groupId: number | null;
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  setting: number;
  @ApiProperty()
  type: number;
  @ApiProperty()
  updatedTime: string;
}

export class ListDepartment {
  @ApiProperty()
  counts: number;

  @ApiProperty({
    type: Array,
    example: [
      {
        active: 1,
        class: 1,
        code: 'GNW-000001',
        createdTime: '2023-11-16T02:09:12.385Z',
        divisionId: null,
        divisionSubclass: [
          {
            department: {
              active: 1,
              class: 1,
              code: 'GNW-00001',
              createdTime: '2023-11-16T02:12:34.787Z',
              divisionId: null,
              groupId: null,
              id: 4,
              name: 'department_thai_no_ 1',
              setting: 1,
              type: 0,
              updatedTime: '2023-11-20T06:07:16.059Z',
            },
            departmentId: 4,
            division: {
              active: 1,
              class: 1,
              code: 'GNW-000001',
              createdTime: '2023-11-16T02:09:12.385Z',
              divisionId: null,
              groupId: null,
              id: 2,
              name: 'division_thai_no_1',
              setting: 1,
              type: 1,
              updatedTime: '2023-11-16T09:27:59.603Z',
            },
            divisionId: 2,
            id: 1,
          },
        ],
        groupId: null,
        id: 2,
        name: 'division_thai_no_1',
        setting: 1,
        type: 1,
        updatedTime: '2023-11-16T09:27:59.603Z',
      },
    ],
  })
  data: {
    active: number;
    class: number;
    code: string;
    createdTime: string;
    divisionId: number | null;
    divisionSubclass: [
      {
        department: {
          active: number;
          class: number;
          code: string;
          createdTime: string;
          divisionId: number | null;
          groupId: number | null;
          id: number;
          name: string;
          setting: number;
          type: number;
          updatedTime: string;
        };
        departmentId: number;
        division: {
          active: number;
          class: number;
          code: string;
          createdTime: string;
          divisionId: number | null;
          groupId: number | null;
          id: number;
          name: string;
          setting: number;
          type: number;
          updatedTime: string;
        };
        divisionId: number;
        id: number;
      },
    ];
    groupId: number | null;
    id: number;
    name: string;
    setting: number;
    type: number;
    updatedTime: string;
  }[];

  @ApiProperty({
    type: Array,
    example: [
      {
        active: 1,
        class: 1,
        code: 'GNW-1209',
        createdTime: '2023-11-16T06:13:40.049Z',
        divisionId: null,
        groupId: null,
        id: 23,
        name: 'Division Hung',
        setting: 1,
        type: 1,
        updatedTime: '2023-11-20T04:38:56.027Z',
      },
    ],
  })
  fullData: {
    active: number;
    class: number;
    code: string;
    createdTime: string;
    divisionId: number | null;
    groupId: number | null;
    id: number;
    name: string;
    setting: number;
    type: number;
    updatedTime: string;
  }[];
}

export class GetDepartmentGnw {
  @ApiProperty()
  active: number;
  @ApiProperty()
  class: number;
  @ApiProperty()
  code: string;
  @ApiProperty()
  createdTime: string;
  @ApiProperty()
  divisionId: number | null;
  @ApiProperty()
  groupId: number | null;
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  setting: number | null;
  @ApiProperty()
  type: number;
  @ApiProperty()
  updatedTime: string;
}

export class GetListDepartment {
  @ApiProperty()
  active: number;
  @ApiProperty()
  class: number;
  @ApiProperty()
  code: string;
  @ApiProperty()
  createdTime: string;
  @ApiProperty()
  divisionId: number | null;
  @ApiProperty()
  groupId: number | null;
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  setting: number | null;
  @ApiProperty()
  type: number;
  @ApiProperty()
  updatedTime: string;
}

export class ResultsAddDepartment {
  @ApiProperty()
  active: number;
  @ApiProperty()
  class: number;
  @ApiProperty()
  code: string;
  @ApiProperty()
  createdTime: string;
  @ApiProperty()
  divisionId: number | null;
  @ApiProperty()
  groupId: number | null;
  @ApiProperty()
  id: number | null;
  @ApiProperty()
  name: string;
  @ApiProperty()
  setting: number | null;
  @ApiProperty()
  type: number;
  @ApiProperty()
  updatedTime: string;
}

export class ListDepartmentOracle {
  @ApiProperty()
  departmentId: number;
  @ApiProperty()
  departmentName: string;
}

export class ListDepartmentOracleMerge {
  @ApiProperty()
  code: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}

export class ListDepartmentSub {
  @ApiProperty()
  active: number;
  @ApiProperty()
  class: number;
  @ApiProperty()
  code: string;
  @ApiProperty()
  createdTime: string;
  @ApiProperty()
  divisionId: number | null;
  @ApiProperty()
  groupId: number | null;
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  setting: number | null;
  @ApiProperty()
  type: number;
  @ApiProperty()
  updatedTime: string;
}
export class SelectedDivision {
  @ApiProperty()
  code: string;
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
export class ResponseFindSubDepartment {
  @ApiProperty()
  counts: number;
  @ApiProperty({ isArray: true })
  data: ListDepartmentSub;
  @ApiProperty({ isArray: true })
  fullData: ListDepartmentSub;
  @ApiProperty()
  selectedDivision: SelectedDivision;
}
