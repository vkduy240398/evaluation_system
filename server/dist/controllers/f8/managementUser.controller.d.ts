import { DepartmentRequestDto, DepartmentSearchRequestDto, DepartmentUpdateRequestDto, DivisionSubclassRequestDTO } from 'src/model/request/DepartmentRequestDto';
import { UserSearchRequestDto } from 'src/model/request/UserRequestDto';
import { DepartmentService } from 'src/services/department.service';
import { ManagemantUserServices } from 'src/services/managementUser.service';
import OracleService from 'src/services/oracle.service';
import { UserService } from 'src/services/user.service';
import { EditUserRequestDto } from 'src/model/request/managementUser.Dto';
import { GetUserDataOracleDto } from 'src/model/getUserDataOracleDto';
import { Request } from 'express';
import { EvaluationPeriodService } from 'src/services/evaluationPeriod.service';
export declare class ManagementUserRoleController {
    private departmentService;
    private evaluationPeriodService;
    private oracleService;
    private managementUserService;
    private userService;
    constructor(departmentService: DepartmentService, evaluationPeriodService: EvaluationPeriodService, oracleService: OracleService, managementUserService: ManagemantUserServices, userService: UserService);
    getData(query: DepartmentSearchRequestDto, req: Request): Promise<{
        data: import("../../entity/Department").Department[];
        counts: number;
        fullData: import("../../entity/Department").Department[];
    }>;
    getAllDepartmentGNW(req: Request): Promise<import("../../entity/Department").Department[]>;
    getAllDepartment(req: Request): Promise<import("../../entity/Department").Department[]>;
    createNewDepartmentOfGNW(newDepartmentGNW: DepartmentRequestDto, req: Request): Promise<import("../../entity/Department").Department>;
    addDivisionSub(data: DivisionSubclassRequestDTO): Promise<import("../../entity/DivisionSubclass").DivisionSubclass>;
    updateNewDepartmentOfGNW(id: string, departmentGNW: DepartmentUpdateRequestDto, req: Request): Promise<[affectedCount: number]>;
    deleteDepartment(id: string, department: any, req: Request): Promise<{
        result: number;
    }>;
    getDepartmentOracleDb(): Promise<any>;
    getDivisionDepartmentOracleDb(req: Request): Promise<import("../../entity/Department").Department[]>;
    getUserDataOracleDb(query: GetUserDataOracleDto, req: Request): Promise<any>;
    addUser(body: any, req: Request): Promise<{
        message: string;
    }>;
    searchListUser(query: UserSearchRequestDto, req: Request): Promise<any>;
    userList(query: any, req: Request): Promise<any>;
    deleteListUser(query: any, req: Request): Promise<any>;
    updateListUser(query: any, req: Request): Promise<void>;
    updateOneUser(body: EditUserRequestDto, req: Request): Promise<{
        role05: string;
        role1: string;
        role2: string;
    }>;
    getUserDetailById(query: any): Promise<import("../../entity/User").User>;
    getEvaluationByUserId(query: any, req: Request): Promise<any>;
    getSubDepartmentData(query: any, req: Request): Promise<{
        data: import("../../entity/Department").Department[];
        counts: number;
        selectedDivision: import("../../entity/Department").Department;
        fullData: import("../../entity/Department").Department[];
    }>;
    getSubDepartmentListByDivisionId(divisionId: number): Promise<import("../../entity/Department").Department[]>;
    getListDivision(req: Request): Promise<import("../../entity/Department").Department[]>;
    getCompanyOracleDb(): Promise<any>;
    exportListUser(query: UserSearchRequestDto, res: any, req: Request): Promise<void>;
    confirmEditOneUser(query: any, req: Request): Promise<any[]>;
    confirmEditListUser(query: any, req: Request): Promise<any[]>;
    getEvaluationPeriod(req: Request): Promise<{
        datePersonal: string;
        dateDepartment: string;
        year: string;
        periodIndex: number;
    }>;
    getHistoryUpdateUser(id: string, req: Request): Promise<import("../../entity/User").User>;
    changeRoleUser(query: any, req: Request): Promise<[unknown[], unknown] | {
        role05: string;
        role1: string;
        role2: string;
    }>;
    updateFullName(query: any, req: Request): Promise<[affectedCount: number]>;
}
