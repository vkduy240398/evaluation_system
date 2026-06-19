import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/entity/User';
import { Roles } from 'src/enum/Roles';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { ManagementEvaluationRepository } from 'src/repository/managementEvaluation.repository';

@Injectable()
export class ManagementEvaluationService {
  @Inject(ManagementEvaluationRepository)
  private managementEvaluationRepo: ManagementEvaluationRepository;

  async getSettingEvaluationSkills(
    props: {
      skillId: number | undefined;
      detailed: boolean;
      limit: number | undefined;
      offset: number;
    },
    companyGroupCode: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { skillId, limit, offset, detailed } = props;

    const skills: {
      skillId: number;
      skillName: string;
      skillSetters: { fullName: string; id: number }[] | undefined;
      skillApprovers: { fullName: string; id: number }[] | undefined;
      skillDepartments:
        | { departmentId: number; departmentName: string }[]
        | undefined;
      key: string;
    }[] = [];

    const { results, count } = await this.managementEvaluationRepo.getAllSkills(
      skillId,
      detailed,
      limit,
      offset,
      companyGroupCode,
    );

    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const sk = results[i];
        const item: {
          skillId: number;
          skillName: string;
          skillSetters: { fullName: string; id: number }[];
          skillApprovers: { fullName: string; id: number }[];
          skillDepartments: {
            departmentId: number;
            departmentName: string;
            departmentType: number;
          }[];
          key: string;
        } = {
          skillId: sk.id,
          skillName: `${sk.name}`,
          skillSetters:
            sk.skillRoles
              ?.filter((x) => x.role === 1)

              .map((skr) => ({
                id: skr.user?.id,
                fullName: skr.user?.fullName,
              }))
              // TODO : Sort with DB
              .sort((a, b) => Number(a.id) - Number(b.id)) ?? [],
          skillApprovers:
            sk.skillRoles
              ?.filter((x) => x.role === 2)
              .map((skr) => ({
                id: skr.user.id,
                fullName: skr.user.fullName,
              }))
              // TODO : Sort with DB
              .sort((a, b) => Number(a.id) - Number(b.id)) ?? [],
          skillDepartments:
            sk.skills?.map((dep) => ({
              departmentId: dep.department?.id,
              departmentName: dep.department?.name,
              departmentType: dep.department?.type,
            })) ?? [],
          key: `skills-key-${sk.id}`,
        };

        skills.push(item);
      }
    }
    return { dataList: skills, count };
  }

  async deleteAdminEvalutionSkill(skillId: number) {
    const countSkillVersions =
      await this.managementEvaluationRepo.countSkillVersions(skillId);

    if (countSkillVersions > 0) {
      return {
        code: 400,
        reason: "Can't delete because user or department uses this skill!",
      };
    }

    await this.managementEvaluationRepo.deleteAdminEvalutionSkill(skillId);

    return {
      code: 200,
      reason: true,
    };
  }

  convertArrayDepartmentApproverSetter(results: any[]) {
    const settingProList: {
      departmentId: number;
      departmentName: string;
      skillSetters: { fullName: string; id: number }[];
      skillApprovers: { fullName: string; id: number }[];
      isCheckedDep: boolean;
      isCheckedDiv: boolean;
      isCheckedGroup: boolean;
      group: number;
      key: string;
      typeD: number;
    }[] = [];
    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const element = results[i];
        const types = [];
        if (element.setting === 1) types.push('課');
        if (element.divisionId !== null) types.push('部署');
        if (element.groupId !== null) types.push('グループ');
        const item: {
          id: number;
          departmentId: number;
          departmentName: string;
          type: string;
          skillSetters: { fullName: string; id: number }[];
          skillApprovers: { fullName: string; id: number }[];
          isCheckedDep: boolean;
          isCheckedDiv: boolean;
          isCheckedGroup: boolean;
          group: number;
          groups: number[][] | null;
          key: string;
          typeD: number;
        } = {
          typeD: element.type,
          id: element.id,
          departmentName: `${element.code}: ${element.name}`,
          departmentId: element.id,
          type: types?.join('、'),
          skillSetters: [],
          skillApprovers: [],
          key: `department-roles-key-${element.id}`,
          isCheckedDep: element.setting === 1,
          isCheckedDiv: element.divisionId !== null,
          isCheckedGroup: element.groupId !== null,
          group: element.groupId || undefined,
          groups: element.groupId
            ? element?.groups?.map((v) =>
                v.groupId === null ? [] : [v.groupId],
              )
            : [],
        };

        if (element.departmentRoles?.length > 0) {
          const skillSetters = element.departmentRoles.filter(
            (f) => f.role === 1,
          );
          const skillApprovers = element.departmentRoles.filter(
            (f) => f.role === 2,
          );
          item.skillSetters.push(
            ...skillSetters.map((v) => ({
              fullName: v.user?.fullName,
              id: v.user?.id,
            })),
          );
          item.skillApprovers.push(
            ...skillApprovers.map((v) => ({
              fullName: v.user?.fullName,
              id: v.user?.id,
            })),
          );
        }
        if (
          item.groups.filter((f) => f.length === 0).length ===
          item.groups.length
        ) {
          item.isCheckedGroup = false;
          item.type = item.type
            .replace('、グループ', '')
            .replace('グループ', '');
        }

        settingProList.push(item);
      }
    }

    return settingProList;
  }

  async getUserActive(companyGroupCode: string) {
    const users = await this.managementEvaluationRepo.getUserActive(
      companyGroupCode,
    );

    const setters: any[] = users.filter((f) => f.roles.some((s) => s.id === 3));
    const approvers: any[] = users.filter((f) =>
      f.roles.some((s) => s.id === 4),
    );
    return { setters, approvers };
  }
}
