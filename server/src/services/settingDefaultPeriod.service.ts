import { Inject, Injectable } from '@nestjs/common';
import { SettingDefaultPeriodRepository } from 'src/repository/settingDefaultPeriod.repository';
@Injectable()
export class SettingDefaultPeriodServices {
  @Inject(SettingDefaultPeriodRepository)
  private settingReviewRepository: SettingDefaultPeriodRepository;

  async findOneSettingDefaultService(companyGroupCode: string | null) {
    return await this.settingReviewRepository.findOneSettingDefault(
      companyGroupCode,
    );
  }

  async updateOrCreateSetting(defaultPeriod: number, companyGroupCode: string) {
    return await this.settingReviewRepository.updateSettingDefaultPeriod(
      defaultPeriod,
      companyGroupCode,
    );
  }
}
