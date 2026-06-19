import { Inject, Injectable } from '@nestjs/common';
import EntityConstant from 'src/constant/EntityConstant';
import { SettingPointBasicBehaviorPro } from 'src/entity/SettingPointBasicBehaviorPro';
import { VersionSetting } from 'src/entity/VersionSetting';
type PointSkillType = 1 | 2 | 3;

@Injectable()
export class PointRepository {
  @Inject(EntityConstant.SETTING_POINT_BASIC_BEHAVIOR_PRO)
  private settingPointEntity: typeof SettingPointBasicBehaviorPro;

  @Inject(EntityConstant.VERSION_SETTING)
  private versionSettingEntity: typeof VersionSetting;

  /**
   * @description type have value 1 is basic, 2 is behavior, 3 is pro skill
   * @param type number
   * @returns
   */
  async getPointSkill(
    type: PointSkillType,
    companyGroupCode: string,
  ): Promise<{ value: number; label: any }[]> {
    const pointSkills: { value: number; label: any }[] = [];
    const results = await this.versionSettingEntity.findOne({
      attributes: ['id'],
      where: {
        type: 1,
        status: 4,
        companyGroupCode: companyGroupCode,
      },
      include: [
        {
          model: SettingPointBasicBehaviorPro,
          as: 'settingPointBasicBehaviorPros',
          where: { type },
          separate: true,
          order: [['point', 'ASC']],
        },
      ],
    });

    if (results && results.settingPointBasicBehaviorPros.length > 0) {
      pointSkills.push(
        ...results.settingPointBasicBehaviorPros.map((v) => ({
          label: v.point,
          value: v.point,
        })),
      );
    }

    return pointSkills;
  }
}
