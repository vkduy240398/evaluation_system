export declare class CompanyService {
    private companyRepo;
    getAllCompany(): Promise<import("../entity/Company").Company[]>;
    getOptionCompany(): Promise<{
        label: string;
        value: any;
    }[]>;
}
