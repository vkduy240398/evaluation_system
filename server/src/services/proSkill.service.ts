import { Inject, Injectable } from '@nestjs/common';
import { ListProSkill } from 'src/entity/ListProSkill';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { VersionProSkillDto } from 'src/model/response/VersionProSkillDto';
import { ProSkillRepository } from 'src/repository/proSkill.repository';
import { ProSkillSettingRepository } from 'src/repository/proSkillSetting.repository';
import { MailService } from './mail.service';
import { isFormatDate } from 'src/common/util';
import * as moment from 'moment';
@Injectable()
export class ProSkillServices {
  @Inject(ProSkillRepository)
  private proSkillRepository: ProSkillRepository;

  @Inject(ProSkillSettingRepository)
  private proSkillSettingRepository: ProSkillSettingRepository;

  @Inject(MailService)
  private mailService: MailService;
  async searchListApprovalProSkill(
    query: any,
    userId: any,
    companyGroupCode: string,
  ) {
    return await this.proSkillRepository.searchListApprovalProSkill(
      query,
      userId,
      companyGroupCode,
    );
  }

  async getSkillByRoleUser(userId: number, companyGroupCode: string) {
    return await this.proSkillRepository.getSkillByRoleUser(
      userId,
      companyGroupCode,
    );
  }

  async getDetailProSkillVersion(
    versionId: number,
    role: string,
    skillId: number,
    userId: number,
    companyGroupCode: string,
  ) {
    const checkRole =
      await this.proSkillRepository.checkPermissionApproverOfSkill(
        userId,
        skillId,
      );

    if (checkRole === null)
      throw new RuntimeException('User not permission approve', 406);

    const datas =
      await this.proSkillSettingRepository.getDetailProSkillByVersionId(
        versionId,
      );

    const rejectComment = await this.proSkillSettingRepository.getRejectComment(
      versionId,
    );

    const dataSettersAndApprovers =
      await this.proSkillSettingRepository.getProskillSettersAndApproversForSkillId(
        skillId,
      );

    const listSettersAndApprovers = dataSettersAndApprovers.reduce(
      (acc: { setters: string[]; approvers: string[] }, current) => {
        if (current.role == 1) {
          acc['setters'].push(current.user.fullName);
        } else if (current.role == 2) {
          acc['approvers'].push(current.user.fullName);
        }

        return acc;
      },
      { setters: [], approvers: [] },
    );
    const skill = await this.proSkillSettingRepository.findOneVersionProSkill({
      id: versionId,
    });

    if (datas.length > 0) {
      // merge array same key versionProSkill => id

      const arrays = datas.reduce((acc: any, current: any) => {
        acc[current.versionId] = {
          skill: current.versionProSkill.skill.name,
          versionId: current.versionId,
          userUpdated: current.versionProSkill.user.fullName,
          updated: current.versionProSkill.updatedTime,
          publicStatus: current.versionProSkill.publicStatus,
          status: current.versionProSkill.status,
          version: `${current.versionProSkill.version}.${current.versionProSkill.subVersion}`,
          publicDate: current.versionProSkill.publicDate,
          reason: current.versionProSkill.reason,
          versionMain: current.versionProSkill.version,
          versionSub: current.versionProSkill.subVersion,
          lastUpdatedTime: current.versionProSkill.lastUpdatedTime,
          listSettersAndApprovers,
          rejectComment: rejectComment?.comment || '',
          children: [],
        };
        return acc;
      }, {});

      for (let index = 0; index < datas.length; index++) {
        arrays[`${versionId}`]?.children.push({
          itemId: datas[index].itemId,
          content: datas[index].content,
          difficulty: datas[index].difficulty,
          note: datas[index].note,
          mediumClass: datas[index].mediumClass,
          smallClass: datas[index].smallClass,
          versionId: datas[index].versionId,
          jobType: datas[index].jobType,
        });
      }

      const arrayDeletes = [];
      const results = (await Object(arrays[`${versionId}`])) as {
        versionId: number;
        userUpdated: string;
        updated: string;
        publicStatus: number;
        status: number;
        version: string;
        publicDate: string;
        reason: string;
        versionMain: number;
        versionSub: number;
        lastUpdatedTime: string;
        children: any[];
      };

      if (results && results.status === 3 && role === 'f4') {
        const versionPublics =
          await this.proSkillSettingRepository.getVersionPublicProSkill(
            skill.skillId,
            companyGroupCode,
          );

        for (let index = 0; index < versionPublics.length; index++) {
          const filter = results.children.find(
            (v: any) => v.itemId === versionPublics[index].itemId,
          );
          const findIndex = results.children.findIndex(
            (v: any) => v.itemId === versionPublics[index].itemId,
          );
          // 0 => change job,
          // 1 => change medium class,
          // 2 => change small class,
          // 3 => change content,
          // 4 => change difficulty ,
          // 5 => change note
          if (filter) {
            //  change job
            if (filter.jobType !== versionPublics[index].jobType) {
              results.children[findIndex].typeJob = 'change';
              results.children[findIndex].jobOld =
                versionPublics[index].jobType;
            }
            // ========================
            if (filter.mediumClass !== versionPublics[index].mediumClass) {
              results.children[findIndex].typeMediumClass = 'change';
              results.children[findIndex].mediumClassOld =
                versionPublics[index].mediumClass;
            }
            // ========================
            if (filter.smallClass !== versionPublics[index].smallClass) {
              results.children[findIndex].typeSmallClass = 'change';
              results.children[findIndex].smallClassOld =
                versionPublics[index].smallClass;
            }
            // ========================
            if (filter.content !== versionPublics[index].content) {
              results.children[findIndex].typeContent = 'change';
              results.children[findIndex].contentOld =
                versionPublics[index].content;
            }
            // ========================
            if (filter.difficulty !== versionPublics[index].difficulty) {
              results.children[findIndex].typedifficulty = 'change';
              results.children[findIndex].difficultyOld =
                versionPublics[index].difficulty;
            }
            // ========================
            if (filter.note !== versionPublics[index].note) {
              results.children[findIndex].typeNote = 'change';
              results.children[findIndex].noteOld = versionPublics[index].note;
            }
            results.children[findIndex].sort = index;
          } else {
            delete versionPublics[index].versionProSkill;
            arrayDeletes.push({
              itemId: versionPublics[index].itemId,
              versionId: versionPublics[index].versionId,
              smallClass: versionPublics[index].smallClass,
              mediumClass: versionPublics[index].mediumClass,
              jobType: versionPublics[index].jobType,
              difficulty: versionPublics[index].difficulty,
              content: versionPublics[index].content,
              note: versionPublics[index].note,
              delete: true,
              sort: versionPublics[index].id,
            });
          }
        }
        if (versionPublics.length > 0) {
          for (let index = 0; index < results.children.length; index++) {
            const filterAdd = versionPublics?.find(
              (v) => v.itemId === results.children[index].itemId,
            );
            if (!filterAdd) {
              results.children[index].isAdd = true;
              results.children[index].sort =
                versionPublics?.length + results.children.length + index;
            }
          }
        }

        results.children.push(...arrayDeletes);

        // results.children = [
        //   ...results.children.sort((n1, n2) => {
        //     if (n1?.sort > n2?.sort) {
        //       return 1;
        //     }

        //     if (n1?.sort < n2?.sort) {
        //       return -1;
        //     }

        //     return 0;
        //   }),
        // ];

        return {
          ...results,
        };
      } else {
        return {
          ...(arrays[`${versionId}`] || []),
        };
      }
    } else {
      const arraySteps =
        await this.proSkillSettingRepository.findOneVersionProSkill({
          id: versionId,
        });

      return {
        ...arraySteps.dataValues,
        version: `${arraySteps.dataValues.version}.${arraySteps.dataValues.subVersion}`,
        userUpdated: arraySteps.dataValues.user.fullName,
        children: [],
      };
    }
  }

  async approveProSkill(
    versionId: number,
    comment: string,
    statusProSkill: string,
    creationUser: number,
    updateTime: string,
    hostName: string,
    skillId: number,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const checkRole =
      await this.proSkillRepository.checkPermissionApproverOfSkill(
        creationUser,
        skillId,
      );

    if (checkRole === null)
      throw new RuntimeException('User not permission approve', 406);

    const proSkillDetail = await this.proSkillRepository.getProSkillDetailById(
      versionId,
    );

    if (updateTime !== proSkillDetail.updatedTime.toISOString())
      throw new RuntimeException('Pro skill is duplicate', 409);

    const checkListProSkillPendingToApproves =
      await this.proSkillRepository.checkProSkillPendingStatusInDepartmentToApprove(
        proSkillDetail.skillId,
        companyGroupCode,
      );

    if (checkListProSkillPendingToApproves.length === 0) {
      await this.proSkillRepository.changeCurrentStatusProSkillToApproved(
        versionId,
        creationUser,
      );
      const dates = new Date(
        isFormatDate(new Date(), 'YYYY-M-D HH:mm:ss', timeZone),
      );

      await this.proSkillRepository.createHistoryApproveOrRejectProSkill(
        versionId,
        comment,
        statusProSkill,
        creationUser,
        dates,
      );
      await this.mailService.sendMailApproveProSkillToAdmin(
        proSkillDetail,
        hostName,
        companyGroupCode,
      );
      await this.mailService.sendMailApproveProSkillToOther(
        proSkillDetail,
        creationUser,
        hostName,
        companyGroupCode,
      );
      return { result: 'approved' };
    } else {
      return { result: 'notApproved' };
    }
  }

  async rejectProSkill(
    versionId: number,
    comment: string,
    statusProSkill: string,
    creationUser: number,
    updateTime: string,
    hostName: string,
    skillId: number,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const checkRole =
      await this.proSkillRepository.checkPermissionApproverOfSkill(
        creationUser,
        skillId,
      );

    if (checkRole === null)
      throw new RuntimeException('User not permission approve', 406);

    const proSkillDetail = await this.proSkillRepository.getProSkillDetailById(
      versionId,
    );

    if (updateTime !== proSkillDetail.updatedTime.toISOString())
      throw new RuntimeException('Pro skill is duplicate', 409);

    await this.proSkillRepository.changeCurrentStatusProSkillToRejected(
      versionId,
      creationUser,
    );
    const dates = new Date(
      isFormatDate(new Date(), 'YYYY-M-D HH:mm:ss', timeZone),
    );
    await this.proSkillRepository.createHistoryApproveOrRejectProSkill(
      versionId,
      comment,
      statusProSkill,
      creationUser,
      dates,
    );
    await this.mailService.sendMailRejectProSkill(
      proSkillDetail,
      creationUser,
      hostName,
      companyGroupCode,
    );

    return true;
  }

  async getDetailProSkillPublicOfSkill(
    skillId: number,
    companyGroupCode: string,
  ) {
    let listProSkills: ListProSkill[];
    const versionProSkillDto = new VersionProSkillDto();
    const skillInfo = await this.proSkillRepository.getSkilltById(
      skillId,
      companyGroupCode,
    );
    const skill = skillInfo.name;

    const versionProSkill =
      await this.proSkillRepository.getVersionProSkillPublicOfSkill(
        skillId,
        companyGroupCode,
      );

    if (versionProSkill?.id) {
      const dataSettersAndApprovers =
        await this.proSkillSettingRepository.getProskillSettersAndApproversForSkillId(
          skillId,
        );

      const listSettersAndApprovers = dataSettersAndApprovers.reduce(
        (acc: { setters: string[]; approvers: string[] }, current) => {
          if (current.role == 1) {
            acc['setters'].push(current.user.fullName);
          } else if (current.role == 2) {
            acc['approvers'].push(current.user.fullName);
          }

          return acc;
        },
        { setters: [], approvers: [] },
      );

      listProSkills =
        await this.proSkillSettingRepository.getListProSkillByVersionId(
          versionProSkill?.id,
        );

      versionProSkillDto.id = versionProSkill.id;
      versionProSkillDto.skill = versionProSkill.skill?.name;
      versionProSkillDto.userUpdated = versionProSkill.user?.fullName;
      versionProSkillDto.lastUpdatedTime = versionProSkill.lastUpdatedTime;
      versionProSkillDto.publicStatus = versionProSkill.publicStatus;
      versionProSkillDto.status = versionProSkill.status;
      versionProSkillDto.version = `${versionProSkill.version}.${versionProSkill.subVersion}`;
      versionProSkillDto.publicDate = versionProSkill.publicDate;
      versionProSkillDto.reason = versionProSkill.reason;
      versionProSkillDto.versionMain = versionProSkill.version;
      versionProSkillDto.versionSub = versionProSkill.subVersion;
      versionProSkillDto.settersAndApprovers = listSettersAndApprovers;
      versionProSkillDto.children = [];

      if (listProSkills.length > 0) {
        listProSkills.map((item: any, index) => {
          versionProSkillDto.children.push({
            itemId: item.itemId,
            versionId: item.versionId,
            jobType: item.jobType,
            mediumClass: item.mediumClass,
            smallClass: item.smallClass,
            content: item.content,
            difficulty: item.difficulty,
            note: item.note,
            key: index,
          });
        });
      }
    }

    return {
      result: versionProSkillDto,
      skill: skill,
      // listDepartmentOfGroup: listDepartmentOfGroup,
      // departmentType: departmentInfo.type,
    };
  }

  async checkPermissionApproverOfDepartment(
    userId: number,
    departmentId: number,
  ) {
    return await this.proSkillRepository.checkPermissionApproverOfSkill(
      userId,
      departmentId,
    );
  }

  async getListDep_TempExport(
    year: number,
    periodIndex: number,
    role: string,
    companyGroupCode: string,
  ) {
    return await this.proSkillRepository.getListDep_TempExport(
      year,
      periodIndex,
      role,
      companyGroupCode,
    );
  }

  async dep_TempProSkillExport(
    year: number,
    periodIndex: number,
    role: string,
    listSelected: [],
    companyGroupCode: string,
  ) {
    if (role == 'f3' || role == 'f4') {
      //get data
      return await this.proSkillRepository.getDataExportProSkill(
        year,
        periodIndex,
        role,
        listSelected,
        companyGroupCode,
      );
    } else if (role == 'f6') {
      //get data
      return await this.proSkillRepository.getDataExportProSkill(
        year,
        periodIndex,
        role,
        listSelected,
        companyGroupCode,
      );
    }
  }

  async getItemsTemplateProSkill(versionId: number) {
    return await this.proSkillRepository.listItemTemplate(versionId);
  }
}
