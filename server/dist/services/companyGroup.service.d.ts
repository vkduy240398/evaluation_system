export declare class CompanyGroupService {
    private companyGroupRepo;
    getAllCompanyGroup(): Promise<import("../entity/CompanyGroup").CompanyGroup[]>;
    getCompanyByHour(hour: number[]): Promise<any[]>;
}
