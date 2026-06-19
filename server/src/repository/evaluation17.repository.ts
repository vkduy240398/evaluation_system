import { Inject, Injectable } from '@nestjs/common';
import EntityConstant from 'src/constant/EntityConstant';
import { SettingPointBasicBehaviorPro } from 'src/entity/SettingPointBasicBehaviorPro';
import { SettingProFormula } from 'src/entity/SettingProFormula';
import { VersionSetting } from 'src/entity/VersionSetting';

@Injectable()
export class Evaluation17Repository {
  // ** Import Entity
  @Inject(EntityConstant.VERSION_SETTING)
  private versionSettingEntity: typeof VersionSetting;

  @Inject(EntityConstant.SETTING_PRO_FORMULA)
  private settingProFormulaEntity: typeof SettingProFormula;

  @Inject(EntityConstant.SETTING_POINT_BASIC_BEHAVIOR_PRO)
  private settingPointEntity: typeof SettingPointBasicBehaviorPro;

  // ** Functional

  // ** Evaluation f1 - level 1 -> 7
  async getBasicBehaviorProPointPublic(
    companyGroupCode: string,
    isNoSkill?: boolean,
  ): Promise<SettingPointBasicBehaviorPro[]> {
    return await this.versionSettingEntity
      .findOne({
        where: {
          type: isNoSkill ? 3 : 1,
          status: 4,
          companyGroupCode: companyGroupCode,
        },
        include: {
          model: SettingPointBasicBehaviorPro,
          as: 'settingPointBasicBehaviorPros',
        },
      })
      .then((data) => {
        if (data && data.settingPointBasicBehaviorPros.length > 0) {
          return data.settingPointBasicBehaviorPros
            .map((v) => v && v.get({ plain: true }))
            .sort((a, b) => b.point - a.point); // Sắp xếp theo point giảm dần
        }
        return [];
      });
  }

  async getMaxPointProBasicSkillPublic(companyGroupCode:string) {
    const difficultyProMax = await this.settingProFormulaEntity.findOne({
      attributes: ['point'],
      plain: true,
      include: {
        model: VersionSetting,
        attributes: [],
        as: 'versionSetting',
        where: { type: 1, status: 4, companyGroupCode: companyGroupCode },
      },

      order: [['point', 'DESC']],
    });

    const pointProOptionMax = await this.settingPointEntity.findOne({
      attributes: ['point'],
      where: { type: 3 },
      plain: true,
      include: {
        model: VersionSetting,
        attributes: [],
        as: 'versionSetting',
        where: { type: 1, status: 4, companyGroupCode: companyGroupCode },
      },
      order: [['point', 'DESC']],
    });

    const pointBasicOptionMax = await this.settingPointEntity.findOne({
      attributes: ['point'],
      where: { type: 1 },
      plain: true,
      include: {
        model: VersionSetting,
        attributes: ['basicMaxDifficulty'],
        as: 'versionSetting',
        where: { type: 1, status: 4, companyGroupCode: companyGroupCode },
      },
      order: [['point', 'DESC']],
    });
    const maxPointProSkill =
      (difficultyProMax?.point || 0) * (pointProOptionMax?.point || 0);
    const maxPointBasicSkill =
      (pointBasicOptionMax?.versionSetting.basicMaxDifficulty || 0) *
      (pointBasicOptionMax?.point || 0);
    return { maxPointProSkill, maxPointBasicSkill };
  }
}
