import { CompanyGroup } from 'src/entity/CompanyGroup';
import { CompanyGroupRepoI } from 'src/interfaces/repository/companyGroup.repository.interface';
export declare class CompanyGroupRepo implements CompanyGroupRepoI {
    private companyGroupRepository;
    getAllCompanyGroup(): Promise<CompanyGroup[]>;
    getCompanyByRawQuery(sql: string, params: any): Promise<any[]>;
}
