import { CompanyGroup } from 'src/entity/CompanyGroup';
export interface CompanyGroupRepoI {
    getAllCompanyGroup(): Promise<CompanyGroup[]>;
}
