import { ApiProperty } from '@nestjs/swagger';
import { ListPoint, ProskillChildren, SettersAndApproversDto, VersionDto, VersionProSkillDetail } from './ProSkillSettingCommon';

export class DetailProSkillResponse {

    @ApiProperty({ type: Number, example: 1 })
    departmentActive: number;
  
    @ApiProperty({ type: Number, example: 1 })
    versionId: number;
  
    @ApiProperty({ type: String, example: 'GNW-000001: department_1' })
    department: string;
  
    @ApiProperty({ type: String, example: 'huynh.ngoc.hung' })
    userUpdated: string;
  
    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    updated: Date;
  
    @ApiProperty({ type: Number, example: 0 })
    publicStatus: number;
  
    @ApiProperty({ type: Number, example: 4 })
    status: number;
  
    @ApiProperty({ type: String, example: '1.0' })
    version: string;
  
    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    publicDate: Date;
  
    @ApiProperty({ type: String, example: 'reason' })
    reason: string;
  
    @ApiProperty({ type: Number, example: 1 })
    versionMain: number;
  
    @ApiProperty({ type: Number, example: 0 })
    versionSub: number;
  
    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    lastUpdatedTime: Date;
  
    @ApiProperty({ type: [ProskillChildren] })
    children: ProskillChildren[];
  
    @ApiProperty({ type: SettersAndApproversDto })
    settersAndApprovers: SettersAndApproversDto;
  
    @ApiProperty({ type: Boolean, example: false })
    editAlready: boolean;
  }

  export class DepartmentDto {

    @ApiProperty({ type: Number, example: 1 })
    id: number;
  
    @ApiProperty({ type: String, example: 'GNW-000001: department_1' })
    code: string;
  
    @ApiProperty({ type: String, example: 'huynh.ngoc.hung' })
    name: string;
  
    @ApiProperty({ type: Number, example: 0 })
    class: number;
  
    @ApiProperty({ type: Number, example: 4 })
    type: number;
  
    @ApiProperty({ type: Number, example: 1 })
    active: number;
  
    @ApiProperty({ type: Number, example: 1 })
    setting: number;
  
    @ApiProperty({ type: Number, example: 1 })
    divisionId: number;
  
    @ApiProperty({ type: Number, example: 1 })
    groupId: number;
  
    @ApiProperty({ type: Date, example: '2023-11-16T06:13:40.049Z' })
    createdTime: Date;
  
    @ApiProperty({ type: Date, example: '2023-11-20T04:38:56.027Z' })
    updatedTime: Date;
  }

  export class VersionProSkillResponse {

    @ApiProperty({ type: [VersionProSkillDetail] })
    data: VersionProSkillDetail[];
  
    @ApiProperty({ type: Number, example: 1 })
    counts: number;
  }

class CreationUser {
    @ApiProperty({ type: String, example: 'dang.hoang.kha' })
    fullName: string;

    @ApiProperty({ type: Number, example: 26 })
    id: number;
}

export class ProSkillSaveDrafReponse {
    @ApiProperty({ type: Number, example: 200 })
    code: number;

    @ApiProperty({ type: Number, example: 26 })
    id: number;

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    updated: Date;

    @ApiProperty({ type: Number, example: 4 })
    status: number;

    @ApiProperty({ type: Number, example: 0 })
    publicStatus: number;

    @ApiProperty({ type: Number, example: 18 })
    departmentId: number;

    @ApiProperty({ type: String, example: '1.0' })
    version: string;

    @ApiProperty({ type: Number, example: 0 })
    subVersion: number;

    @ApiProperty({ type: String, example: 'huynh.ngoc.hung' })
    fullName: string;

    @ApiProperty({ type: String, example: 'reason' })
    reason: string;

    @ApiProperty({ type: Number, example: 1 })
    departmentActive: number;

    @ApiProperty({ type: String, example: 'GNW-000001: department_1' })
    departmentName: string;

    @ApiProperty({ type: CreationUser })
    creationUser: CreationUser;

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    lastUpdatedTime: Date;

    @ApiProperty({ type: String, example: '' })
    listDepartment: string;
}

class Department {
    @ApiProperty({ type: Number, example: 2 })
    id: number;

    @ApiProperty({ type: String, example: 'GNW-000001' })
    code: number;

    @ApiProperty({ type: String, example: 'department_1' })
    name: string;
}

class VersionProSkillDepartment {
    @ApiProperty({ type: Number, example: 26 })
    id: number;

    @ApiProperty({ type: Number, example: 1 })
    version: number;
    
    @ApiProperty({ type: Number, example: 0 })
    subVersion: number;

    @ApiProperty({ type: Number, example: 4 })
    status: number;

    @ApiProperty({ type: Number, example: 0 })
    publicStatus: number;

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    publicDate: Date;

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    updateDate: Date;

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    lastUpdatedTime: Date;

    @ApiProperty({ type: Department })
    department: Department;

    @ApiProperty({ type: Object, example: {
        "fullName": "lieu.hong.thai"
    } })
    user: object;
}

export class VersionProSkillDepartmentResponse {
    @ApiProperty({ type: [VersionProSkillDepartment] })
    data: VersionProSkillDepartment[];

    @ApiProperty({ type: Number, example: 1 })
    total: number;
}

export class VersionSubmitResponse {
    @ApiProperty({ type: Number, example: 26 })
    id: number;

    @ApiProperty({ type: Number, example: 200 })
    code: number;

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    updatedTime: Date;

    @ApiProperty({ type: Number, example: 4 })
    status: number;

    @ApiProperty({ type: Number, example: 0 })
    publicStatus: number;

    @ApiProperty({ type: Number, example: 18 })
    departmentId: number;

    @ApiProperty({ type: Number, example: 1 })
    version: number;

    @ApiProperty({ type: Number, example: 0 })
    subVersion: number;

    @ApiProperty({ type: String, example: 'reason' })
    reason: string;

    @ApiProperty({ type: Number, example: 1 })
    departmentActive: number;
    
    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    lastUpdatedTime: Date;

    @ApiProperty({ type: String, example: 'GNW-000001: department_1' })
    departmentName: string;
}

export class VersionCancelResponse {

    @ApiProperty({ type: Number, example: 402 })
    code: number;

    @ApiProperty({ type: String, example: '1' })
    id: string;
}

class ApprovalHistories {
    @ApiProperty({ type: Object, example: {
        'id': 3,
        'fullName': 'lieu.hong.thai'
    } })
    approverUser: Object

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    createdTime: Date;

    @ApiProperty({ type: String, example: 'public' })
    comment: string;

    @ApiProperty({ type: String, example: '公開' })
    status: string;
}

class Infor {

    @ApiProperty({ type: String, example: '2.0' })
    version: number;

    @ApiProperty({ type: String, example: 'GNW-000001: division_thai_no_1' })
    department: string;
}

export class HistoryApproveResponse {
    @ApiProperty({ type: Infor })
    infor: Infor;

    @ApiProperty({ type: [ApprovalHistories] })
    approvalHistories: ApprovalHistories;
}

export class InitialVersionResponse {

    @ApiProperty({ type: Number, example: 401 })
    code: number;

    @ApiProperty({ type: String, example: 'dang.hoang.kha' })
    fullName: string;

    @ApiProperty({ type: String, example: "85" })
    departmentId: string;

    @ApiProperty({
        type: Object, example:
        {
            "fullName": "dang.hoang.kha",
            "id": 9
        }
    })
    creationUser: object;

}

export class ListPointResponse {
    @ApiProperty({ type: Number, example: 200 })
    code: number;

    @ApiProperty({ type: ListPoint })
    listPoint: ListPoint;

    @ApiProperty({ type: SettersAndApproversDto })
    settersAndApprovers: SettersAndApproversDto

    @ApiProperty({ type: String, example: "GNW-0001: Dep_1" })
    department: string;

    @ApiProperty({ type: String, example: "" })
    listDepartment: string;
}

export class PermissionResponse {

    @ApiProperty({ type: Number, example: 5 })
    status: number;
}

export class VersionPublicResponse {
    @ApiProperty({ type: Number, example: 26 })
    versionId: number;

    @ApiProperty({ type: Number, example: 18 })
    departmentId: number;

    @ApiProperty({ type: String, example: 'GNW-000001: department_1' })
    departmentName: string;

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    updatedTime: Date;

    @ApiProperty({ type: Number, example: 0 })
    publicStatus: number;

    @ApiProperty({ type: Number, example: 4 })
    status: number;

    @ApiProperty({ type: String, example: '1.0' })
    version: string;

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    publicDate: Date;

    @ApiProperty({ type: String, example: 'reason' })
    reason: string;

    @ApiProperty({ type: Number, example: 0 })
    versionMain: number;

    @ApiProperty({ type: Number, example: 0 })
    versionSub: number;

    @ApiProperty({
        type: Object, example: {
            'id': 3,
            'fullName': 'lieu.hong.thai'
        }
    })
    creationUser: Object

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    lastUpdatedTime: Date;

    @ApiProperty({ type: [ProskillChildren] })
    children: ProskillChildren[];
}

export class ProSkillEditResponse {
    
    @ApiProperty({ type: VersionPublicResponse })
    data: VersionPublicResponse;

    @ApiProperty({ type: SettersAndApproversDto })
    settersAndApprovers: SettersAndApproversDto;

    @ApiProperty({ type: Number, example: 0 })
    subVersion: number;

    @ApiProperty({ type: ListPoint })
    listPoint: ListPoint;

    @ApiProperty({ type: Number, example: 1 })
    lengths: number;

    @ApiProperty({ type: Boolean, example: false })
    editAlready: boolean;
}

export class DetailProSkillPublicResponse extends VersionDto {
    @ApiProperty({ type: String, example: 'GNW-1900：Group 1' })
    group: string;

    @ApiProperty({ type: Number, example: 1 })
    departmentType: number;

    @ApiProperty({ type: Number, example: 0 })
    versionMain: number;

    @ApiProperty({ type: Date, example: '2023-11-16T09:38:07.685Z' })
    lastUpdatedTime: number;

    @ApiProperty({ type: [ProskillChildren] })
    children: ProskillChildren[];

    @ApiProperty({ type: SettersAndApproversDto })
    settersAndApprovers: SettersAndApproversDto;
}