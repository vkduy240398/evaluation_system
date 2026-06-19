import { FormInstance, message } from 'antd';
import { departmentCommon, skillCommon, skillLists } from '../../../types/api/commonType';
import HttpAxios from '../../http';
import { t } from 'i18next';
import { conditionsSearchSettingEvaluator } from '../../../model/Conditions';

const getDepartment = async ({ callBack, errorCallBack }: departmentCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-department').then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.id}:${v.name}: ${v.type}`;

        return v;
      });
      arrays.unshift({
        // Add default value
        type: -1,
        code: '',
        name: 'すべて',
        value: 'すべて',
      });
      callBack(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const getDepartmentNotGroup = async ({ callBack, errorCallBack }: departmentCommon) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/common/get-all-department-not-group').then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.id}:${v.name}: ${v.type}`;

        return v;
      });
      arrays.unshift({
        // Add default value
        type: -1,
        code: '',
        name: 'すべて',
        value: 'すべて',
      });
      callBack(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const searchListSettingEvaluator = async (
  conditions: conditionsSearchSettingEvaluator,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f5/management-evaluation-history/find-user-setting-evaluator`, {
    params: conditions,
  })
    .then((res) => {
      if (res && res.status === 200) {
        callBack && callBack(res?.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};

const checkImportUser = async (
  conditions: any,
  setIsDisplayImportButton: (bool: boolean) => void,
  setLoading: (bool: boolean) => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f5/management-evaluation-history/check-import-user`, {
    params: conditions,
  }).then((res) => {
    if (res && res?.status) {
      if (res?.data.length > 0) {
        setIsDisplayImportButton(false);
      } else {
        setIsDisplayImportButton(true);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  });
};

const importUser = async (
  state: any,
  callBack: (dataSource: any) => void,
  setLoading: (bool: boolean) => void,
  form: FormInstance<any>,
  setConditions: React.Dispatch<React.SetStateAction<conditionsSearchSettingEvaluator>>,
  conditions: conditionsSearchSettingEvaluator,
  handleOpenPopupConfirmImportUser: () => void,
) => {
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f5/management-evaluation-history/import-user`, {
    params: state,
  })
    .then((res) => {
      if (res && res.status === 200) {
        handleOpenPopupConfirmImportUser();
        message.success(t('MESSAGE.COMMON.IDM_ADD_USER_SUCCESS'));
        callBack && callBack(res?.data);
        const department = form.getFieldValue('department');
        const userName = form.getFieldValue('userName');
        const evaluatorName = form.getFieldValue('evaluatorName');
        const exception = form.getFieldValue('exception');
        const skill = form.getFieldValue('skill');
        const level = form.getFieldValue('level');
        const flagSkill = form.getFieldValue('flagSkill');
        setConditions({
          ...conditions,
          state,
          department,
          userName,
          evaluatorName,
          exception,
          skill,
          level,
          flagSkill,
          isSearch: true,
          current: 1,
          offset: 0,
          limit: 20,
        });

        setLoading(false);
      } else {
        handleOpenPopupConfirmImportUser();
        setLoading(false);
      }
    })
    .catch(() => {
      setLoading(false);
    });
};

const findListUserToSettingEvaluation = async (props: {
  department: string;
  division: string;
  nameAndEmail: string;
  callBackListSettingEvaluator: (data: any) => void;
  setLoading: (bool: boolean) => void;
  limit?: number;
  offset?: number;
  state: any;
  tabMode?: string | null;
}) => {
  const { department, division, nameAndEmail, limit, offset, callBackListSettingEvaluator, setLoading, state, tabMode } = props;
  setLoading(true);

  return await HttpAxios.Get(`/api/v1/f5/management-evaluation-history/find-list-user-to-setting-evaluation`, {
    params: {
      limit,
      offset,
      department,
      division,
      nameAndEmail,
      state,
      tabMode,
    },
  })
    .then((res) => {
      if (res && res.status === 200) {
        callBackListSettingEvaluator(res.data);
        setLoading(false);
      } else setLoading(false);
    })
    .catch(() => {});
};

const checkIsFixed = async (conditions: any, setIsFixed: (bool: boolean) => void) => {
  return await HttpAxios.Get(`/api/v1/f5/management-evaluation-history/check-is-fixed`, {
    params: conditions,
  }).then((res) => {
    if (res && res?.status) {
      if (res?.data.length > 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    }
  });
};

const getAllSkill = async ({ callBackListSkill, errorCallBack }: skillLists) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/f5/management-evaluation-history/get-all-skill').then((res) => {
    if (res && res?.status) {
      const arrays = res?.data.map((v: any) => {
        v.name = `${v.name}`;
        v.value = `${v.id}`;

        return v;
      });
      arrays.unshift({
        // Add default value
        type: -1,
        code: '',
        name: 'すべて',
        value: 'すべて',
      });
      callBackListSkill(arrays);
      errorCallBack(false);
    } else {
      errorCallBack(false);
    }
  });
};

const searchListUserToSettingEvaluationHistoryReference = async (props: {
  department: string;
  nameAndEmail: string;
  callBackListSetting: (data: any) => void;
  setLoading: (bool: boolean) => void;
  limit?: number;
  offset?: number;
  state: any;
}) => {
  const { department, nameAndEmail, limit, offset, callBackListSetting, setLoading, state } = props;
  setLoading(true);

  return await HttpAxios.Get(
    `/api/v1/f6/management-evaluation/find-list-user-to-setting-evaluation-history-reference`,
    {
      params: {
        limit,
        offset,
        department,
        nameAndEmail,
        state,
      },
    },
  )
    .then((res) => {
      if (res && res.status === 200) {
        callBackListSetting(res.data);
        setLoading(false);
      } else setLoading(false);
    })
    .catch(() => {});
};

const settingEvaluatorApiService = {
  getDepartment,
  getDepartmentNotGroup,
  searchListSettingEvaluator,
  checkImportUser,
  importUser,
  findListUserToSettingEvaluation,
  checkIsFixed,
  getAllSkill,
  searchListUserToSettingEvaluationHistoryReference,
};
export default settingEvaluatorApiService;
