import { Company } from 'src/entity/Company';
export declare class CompanyRepository {
    private companyRepository;
    getAllCompany(): Promise<Company[]>;
    getCompanyById(id: any | undefined): Promise<Company>;
}
