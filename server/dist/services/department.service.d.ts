import { DepartmentUpdateRequestDto } from 'src/model/request/DepartmentRequestDto';
import { PeriodDTO } from 'src/model/request/ExceptionPeriodRequestDto';
export declare class DepartmentService {
    private departmentRepo;
    createNewDivisionDepartment(department: any, companyGroupCode?: string): Promise<import("../entity/Department").Department>;
    addDivisionSub(data: any): Promise<import("../entity/DivisionSubclass").DivisionSubclass>;
    updateDepartmentForGNW(id: any, department: DepartmentUpdateRequestDto, companyGroupCode: string, timeZone: string): Promise<[affectedCount: number]>;
    findListDepartment(query: any, companyGroupCode?: string): Promise<{
        data: import("../entity/Department").Department[];
        counts: number;
        fullData: import("../entity/Department").Department[];
    }>;
    getAllDepartment(companyGroupCode: string): Promise<import("../entity/Department").Department[]>;
    getAllDepartmentNotSetDivision(companyGroupCode: string): Promise<import("../entity/Department").Department[]>;
    getAllDepartmentGNW(companyGroupCode: string): Promise<import("../entity/Department").Department[]>;
    getAllDepartmentTypeDepartment(companyGroupCode: string): Promise<import("../entity/Department").Department[]>;
    getAllDepartmentNotGroup(companyGroupCode: string): Promise<import("../entity/Department").Department[]>;
    getAllDepartmentTypeDivision(companyGroupCode: string): Promise<import("../entity/Department").Department[]>;
    getAllDivisionDepartment(companyGroupCode: string): Promise<{
        divisionId: number;
        code: string;
        name: string;
        childrens: any[];
    }[]>;
    getUserDivisionAndDepartment(userId: number): Promise<{
        division: import("../entity/Department").Department;
        department: import("../entity/Department").Department[];
    } | {
        division: import("../entity/Department").Department;
        department: import("../entity/Department").Department;
    }>;
    mergeDivision(companyGroupCode: string): Promise<import("../entity/Department").Department[]>;
    deleteDepartment(id: any, department: any, companyGroupCode?: string): Promise<{
        result: number;
    }>;
    getDepartmentById(id: any): Promise<import("../entity/Department").Department>;
    getOptionDepartment(query: PeriodDTO, companyGroupCode: string, timeZone: string): Promise<any[]>;
    getListSubDepartment(query: any, id: number, companyGroupCode?: string): Promise<{
        data: import("../entity/Department").Department[];
        counts: number;
        selectedDivision: import("../entity/Department").Department;
        fullData: import("../entity/Department").Department[];
    }>;
    getSubDepartmentListByDivisionId(id: number): Promise<import("../entity/Department").Department[]>;
    getAllSkill(companyGroupCode: string): Promise<import("../entity/Skill").Skill[]>;
}
