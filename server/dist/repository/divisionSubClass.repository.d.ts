import { DivisionSubclass } from 'src/entity/DivisionSubclass';
export declare class DivisionSubClassRepository {
    private divisionSubclassEntity;
    getDepartmentIdByCondition(where: {
        [x: string]: any;
    }): Promise<DivisionSubclass[]>;
    findOneDepartmentIdByCondition(where: {
        [x: string]: any;
    }): Promise<DivisionSubclass>;
    getParentOfDepartment(id: any): Promise<DivisionSubclass>;
}
