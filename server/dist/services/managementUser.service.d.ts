import { AddUser } from 'src/model/getUserDataOracleDto';
import { UpdateListUserType } from 'src/interfaces/service/managementUser.interface';
export declare class ManagemantUserServices {
    private userRepo;
    private managementUserRepository;
    private departmentRepository;
    private companyRepository;
    private userHistoryUpdateRepo;
    addUser(body: AddUser[], companyGroupCode: string): Promise<{
        message: string;
    }>;
    getUniqueListBy(arr: any[], key: string): any[];
    updateListUserProcedure(query: UpdateListUserType, companyGroupCode: string, timeZone: string, createationUserId: number): Promise<void>;
    updateOneUserProcedure(userId: number, company: {
        id: number;
        name: string;
    }, department: {
        id: number;
        codeName: string;
    }, division: {
        id: number;
        codeName: string;
        divisionId: number;
    }, level: number, levelOld: number, roles: number[], isChangeRoleF2: boolean, isChangeRoleF3: boolean, isChangeRoleF4: boolean, typeChangeRole1: number, updatedTime: any, radioLevelvalue: number, flagSkillValue: number, oldFlagSkill: number, companyGroupCode: string, timeZone: string, createationUserId: number, fullName: string): Promise<{
        role05: string;
        role1: string;
        role2: string;
    }>;
    processes(userId: number, roleChangeError: any, order: string, statusList: any, listEvaluationId: any[], companyGroupCode: string): Promise<void>;
    handleListTextChangeUserInforEvaluation(list: any[]): Promise<string>;
    confirmEditOneUser(userId: number, company: {
        id: number;
        name: string;
    }, department: {
        id: number;
        codeName: string;
    }, division: {
        id: number;
        codeName: string;
        divisionId: number;
    }, level: number, levelOld: number, roles: number[], radioLevelvalue: number, flagSkillValue: number, oldFlagSkill: number, companyGroupCode: string, timeZone: string): Promise<any[]>;
    getStringChangeItem(dataCheck: any): Promise<string>;
    confirmEditListUser(query: any, companyGroupCode: string, timeZone: string): Promise<any[]>;
    historyUpdateUserList(companyGroupCode: string, userId: string): Promise<import("../entity/User").User>;
    changeRoleUserManagement(userId: number, roles: any[], companyGroupCode: string, isChangeRoleF2: boolean, isChangeRoleF3: boolean, isChangeRoleF4: boolean, typeChangeRoleF1: number, timeZone: any): Promise<[unknown[], unknown] | {
        role05: string;
        role1: string;
        role2: string;
    }>;
    updateFullNameUser(userId: number, fullName: string): Promise<[affectedCount: number]>;
}
