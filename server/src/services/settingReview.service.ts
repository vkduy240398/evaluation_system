import { Inject, Injectable } from '@nestjs/common';
import { SettingReviewRepository } from 'src/repository/settingReview.repository';
@Injectable()
export class SettingReviewService {
  @Inject(SettingReviewRepository)
  private settingReviewRepository: SettingReviewRepository;
  async searchListUserToSettingEvaluationHistoryReference(query: any) {
    return await this.settingReviewRepository.searchListUserToSettingEvaluationHistoryReference(
      query,
    );
  }

  async getAllUser(companyGroupCode: string) {
    return await this.settingReviewRepository.getAllUser(companyGroupCode);
  }

  async addEditUser(data: any, companyGroupCode: string) {
    return await this.settingReviewRepository.addEditUser(
      data,
      companyGroupCode,
    );
  }

  async getListDepartmentRepository(companyGroupCode: string) {
    return await this.settingReviewRepository.getListDepartment(
      companyGroupCode,
    );
  }

  async getListSettingReviewHistoryReference(
    condition: {
      depDivAudience: number | string;
      depDivViewer: number | string;
      matchDepartment: number | string;
      targetAudience?: string;
      viewer?: string;
      page: number;
    },
    companyGroupCode: string,
    timeZone: string,
  ) {
    return await this.settingReviewRepository.getListSettingReviewHistory(
      condition,
      companyGroupCode,
      timeZone,
    );
  }

  async deleteHistoryReference(
    arrayIds: number[],
    condition: {
      depDivAudience: number | string;
      depDivViewer: number | string;
      matchDepartment: number | string;
      targetAudience?: string;
      viewer?: string;
      page: number;
    },
    companyGroupCode: string,
    timeZone: string,
  ) {
    await this.settingReviewRepository.deleteSettingHistoryReference(arrayIds);

    return await this.settingReviewRepository.getListSettingReviewHistory(
      condition,
      companyGroupCode,
      timeZone,
    );
  }
}
