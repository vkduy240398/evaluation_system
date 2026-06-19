import { FormInstance, message } from 'antd';
import httpAxios from '../../../common/http';
import { t } from 'i18next';
import proSkillApiService from '../../../common/api/proSkill';
import { DataState } from '../../../model/DataState';
import { NavigateFunction } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';

export const handleRejectedProSkill = async (
  form: FormInstance<any>,
  dataState: DataState<any>,
  id: string,
  skillId: string,
  hostName: string,
  dataCallback: (data: any) => void,
  errorCallback: (bool: boolean) => void,
  navigate: NavigateFunction,
) => {
  const comment = form.getFieldValue('commentReject');

  return await form
    .validateFields()
    .then(async () => {
      const updateTime = dataState.dataSource?.updatedTime || dataState.dataSource?.updated;
      await httpAxios
        .Put(`/api/v1/f4/pro-skill-approval/rejected/${id}`, {
          comment,
          updateTime,
          hostName,
          skillId,
        })
        .then((res: any) => {
          if (res && res.status === 200) {
            message.success(t('MESSAGE.COMMON.IDM_REJECT_SUCCESS'));
            proSkillApiService.detailProSkill(
              `/api/v1/f4/pro-skill-approval/detail-pro-skill-approve`,
              id,
              dataCallback,
              errorCallback,
              skillId,
              navigate,
            );
          }
        });
    })
    .catch((err: any) => {
      console.log({ err });
    });
};

export const handleApprovedProSkill = async (
  form: FormInstance<any>,
  isOpenApprovateGoal: boolean,
  dataState: DataState<any>,
  hostName: string,
  id: string,
  skillId: string,
  setOpenApprovateGoal: Dispatch<SetStateAction<boolean>>,
  dataCallback: (data: any) => void,
  errorCallback: (bool: boolean | undefined) => void,
  navigate: NavigateFunction,
) => {
  const comment = form.getFieldValue('commentReject');
  if ((comment && comment.length <= 500) || !comment) {
    if (isOpenApprovateGoal) {
      const updateTime = dataState.dataSource?.updatedTime || dataState.dataSource?.updated;
      await httpAxios
        .Put(`/api/v1/f4/pro-skill-approval/approved/${id}`, {
          comment,
          updateTime,
          hostName,
          skillId,
        })
        .then((res) => {
          if (res && res.status === 200) {
            if (res.data.result === 'notApproved') {
              setOpenApprovateGoal(false);
              message.error(t('MESSAGE.COMMON.IDM_NOT_ALLOW_APPROVE'));
            } else {
              setOpenApprovateGoal(false);
              proSkillApiService.detailProSkill(
                `/api/v1/f4/pro-skill-approval/detail-pro-skill-approve`,
                id,
                dataCallback,
                errorCallback,
                skillId,
                navigate,
              );
              message.success(t('MESSAGE.COMMON.IDM_APPROVE_SUCCESS'));
            }
          }
        });
      setOpenApprovateGoal(false);
    }
  }
};

export const loadData = async (
  skillId: string,
  id: string,
  dataCallback: (data: any) => void,
  errorCallback: (bool: boolean | undefined) => void,
  navigate: NavigateFunction,
) => {
  proSkillApiService.detailProSkill(
    `/api/v1/f4/pro-skill-approval/detail-pro-skill-approve`,
    id,
    dataCallback,
    errorCallback,
    skillId,
    navigate,
  );
};
