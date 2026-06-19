export declare class EditUserRequestDto {
    userId: number;
    company: {
        id: number;
        name: string;
    };
    department: {
        id: number;
        codeName: string;
    };
    division: {
        id: number;
        codeName: string;
        divisionId: number;
    };
    level: number;
    levelOld: number;
    roles: number[];
    isChangeRoleF2: boolean;
    isChangeRoleF3: boolean;
    isChangeRoleF4: boolean;
    typeChangeRoleF1: number;
    updatedTime: any;
    radioLevelvalue: number;
    flagSkillValue: number;
    oldFlagSkill: number;
    fullName: string;
}
