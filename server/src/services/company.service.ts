import { Inject, Injectable } from '@nestjs/common';
import { CompanyRepository } from 'src/repository/company.repository';

@Injectable()
export class CompanyService {
  @Inject(CompanyRepository)
  private companyRepo: CompanyRepository;

  async getAllCompany() {
    return await this.companyRepo.getAllCompany();
  }

  async getOptionCompany() {
    const results: { label: string; value: any }[] = [];
    const companies = await this.companyRepo.getAllCompany();

    if (companies) {
      results.push(...companies.map((v) => ({ label: v.name, value: v.id })));
    }

    return results;
  }
}
