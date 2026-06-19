export declare class ManagementEvaluationService {
    private managementEvaluationRepo;
    getSettingEvaluationSkills(props: {
        skillId: number | undefined;
        detailed: boolean;
        limit: number | undefined;
        offset: number;
    }, companyGroupCode: string): Promise<{
        dataList: {
            skillId: number;
            skillName: string;
            skillSetters: {
                fullName: string;
                id: number;
            }[] | undefined;
            skillApprovers: {
                fullName: string;
                id: number;
            }[] | undefined;
            skillDepartments: {
                departmentId: number;
                departmentName: string;
            }[] | undefined;
            key: string;
        }[];
        count: number;
    }>;
    deleteAdminEvalutionSkill(skillId: number): Promise<{
        code: number;
        reason: string;
    } | {
        code: number;
        reason: boolean;
    }>;
    convertArrayDepartmentApproverSetter(results: any[]): {
        departmentId: number;
        departmentName: string;
        skillSetters: {
            fullName: string;
            id: number;
        }[];
        skillApprovers: {
            fullName: string;
            id: number;
        }[];
        isCheckedDep: boolean;
        isCheckedDiv: boolean;
        isCheckedGroup: boolean;
        group: number;
        key: string;
        typeD: number;
    }[];
    getUserActive(companyGroupCode: string): Promise<{
        setters: any[];
        approvers: any[];
    }>;
}
