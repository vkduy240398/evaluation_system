import { Inject, Injectable } from '@nestjs/common';
import { Evaluation17Repository } from 'src/repository/evaluation17.repository';

@Injectable()
export class Evaluation17Service {
  // ** Inject repository
  @Inject(Evaluation17Repository)
  private evaluation17Repo: Evaluation17Repository;

  async getBasicBehaviorProOptionPublic(
    companyGroupCode: string,
    isNoSkill?: boolean,
  ) {
    //
    const basicSkillPointOptions: { label: any; value: any }[] = [];
    const behaviorSkillPointOptions: { label: any; value: any }[] = [];
    const proSkillPointOptions: { label: any; value: any }[] = [];

    const results = await this.evaluation17Repo.getBasicBehaviorProPointPublic(
      companyGroupCode,
      isNoSkill,
    );

    /**
     * type : 1 is basic skill point
     * type: 2 is behavior skill point
     * type: 3 is pro skill point
     */

    if (results.length > 0) {
      results.map((v) => {
        if (v.type === 1)
          basicSkillPointOptions.push({ label: v.point, value: v.point });
        else if (v.type === 2)
          behaviorSkillPointOptions.push({ label: v.point, value: v.point });
        else proSkillPointOptions.push({ label: v.point, value: v.point });
      });
    }

    return {
      basicSkillPointOptions,
      behaviorSkillPointOptions,
      proSkillPointOptions,
    };
  }

  async getMaxPointProBasicSkillPublic(companyGroupCode: string) {
    return await this.evaluation17Repo.getMaxPointProBasicSkillPublic(
      companyGroupCode,
    );
  }
}
