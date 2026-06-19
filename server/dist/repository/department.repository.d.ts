import { Department } from 'src/entity/Department';
import { DivisionSubclass } from 'src/entity/DivisionSubclass';
import { Skill } from 'src/entity/Skill';
import { User } from 'src/entity/User';
import { DepartmentUpdateRequestDto } from 'src/model/request/DepartmentRequestDto';
export declare class DepartmentRepository {
    private departmentEntity;
    private divisionSubEntity;
    private userEntity;
    private evaluationEntity;
    private skillEntity;
    private skillGroupEntity;
    private evaluatorDefault;
    private evaluationPeriodEntity;
    private historyUpdateDepartmentdEntity;
    createNewDivisionDepartment(saveData: {
        code: string;
        name: string;
        class: number;
        type: number;
        active: number;
        division: any;
    }, companyGroupCode?: string): Promise<Department>;
    addDivisionSub(data: any): Promise<DivisionSubclass>;
    updateDepartmentForGNW(id: any, department: DepartmentUpdateRequestDto, data: Department, companyGroupCode: string, timeZone: string): Promise<[affectedCount: number]>;
    findListDepartment(query: any, companyGroupCode?: string): Promise<{
        data: Department[];
        counts: number;
        fullData: Department[];
    }>;
    getAllDepartment(companyGroupCode: string): Promise<Department[]>;
    getHistoryUpdateDepartment(year: number, periodIndex: number, companyGroupCode: string, timeZone: string): Promise<any[]>;
    getAllDepartmentNotSetDivision(companyGroupCode: string): Promise<Department[]>;
    getAllDepartmentTypeDepartment(companyGroupCode: string): Promise<Department[]>;
    getAllDepartmentTypeDivision(companyGroupCode: string): Promise<Department[]>;
    getAllDepartmentNotGroup(companyGroupCode: string): Promise<Department[]>;
    getAllDivisionDepartment(companyGroupCode: string): Promise<Department[]>;
    getAllDepartmentGNW(companyGroupCode: string): Promise<Department[]>;
    getDepartmentUpdateTime(id: any, companyGroupCode?: string): Promise<Department>;
    deleteDepartment(id: any, department: any, companyGroupCode: string): Promise<{
        result: number;
    }>;
    getDepartmentById(id: any | undefined): Promise<Department>;
    getTransactionDepartment(): Promise<import("sequelize").Transaction>;
    findOne(where: {
        [x: string]: any;
    }): Promise<Department>;
    findOnesSkill(where: {
        [x: string]: any;
    }): Promise<Skill>;
    checkIsDivision(id: any): Promise<Department>;
    getVersionProSkillbyDepartment(where: {
        [x: string]: any;
    }): Promise<Department[]>;
    getListSubDepartment(query: any, id: number, companyGroupCode?: string): Promise<{
        data: Department[];
        counts: number;
        selectedDivision: Department;
        fullData: Department[];
    }>;
    getSubDepartmentListByDivisionId(id: number): Promise<Department[]>;
    getList(): Promise<Department[]>;
    getAllSkill(companyGroupCode: string): Promise<Skill[]>;
    getUserDivision(userId: number): Promise<User>;
}
