import { message } from 'antd';
import HttpAxios from '../../http';
import { t } from 'i18next';

const handleSearchSettingReviewHistory = async (
  condition: {
    depDivAudience: number | string;
    depDivViewer: number | string;
    matchDepartment: number | string;
    targetAudience?: string;
    viewer?: string;
    page: number;
  },
  callBack: (data: any) => void,
  errorCallBack: (isLoading: boolean) => void,
) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/f6/management-evaluation/list-setting-review-history', {
    params: {
      ...condition,
      targetAudience: condition.targetAudience || '',
      viewer: condition.viewer || '',
    },
  })
    .then((res) => {
      if (res?.status) {
        callBack(res.data);
      }
    })
    .catch(() => {
      errorCallBack(false);
    })
    .finally(() => {
      errorCallBack(false);
    });
};

const getAllListDepartment = async (callBack: (data: any) => void, errorCallBack: (isLoading: boolean) => void) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/f6/management-evaluation/list-department')
    .then((res) => {
      if (res?.status) {
        callBack(res.data);
      }
      errorCallBack(false);
    })
    .catch(() => {
      errorCallBack(false);
    })
    .finally(() => {
      errorCallBack(false);
    });
};
const saveNumberPeriod = async (defaultPeriod: number, errorCallBack: (isBool: boolean) => void, setIsEdit: any) => {
  errorCallBack(true);

  return await HttpAxios.Put('/api/v1/f6/management-evaluation/update-number-period', {
    defaultPeriod: Number(defaultPeriod),
  })
    .then((res) => {
      errorCallBack(false);
      message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
      setIsEdit(false);
    })
    .catch(() => {
      errorCallBack(false);
    })
    .finally(() => {
      errorCallBack(false);
    });
};

const findSettingDefaultPeriod = async (callBack: (data: any) => void, errorCallBack: (isBool: boolean) => void) => {
  errorCallBack(true);

  return await HttpAxios.Get('/api/v1/f6/management-evaluation/get-setting-default-period', {})
    .then((res) => {
      errorCallBack(false);
      callBack(res?.data);
    })
    .catch(() => {
      errorCallBack(false);
    })
    .finally(() => {
      errorCallBack(false);
    });
};

const handleDeleteRecordSettingHistoryReference = async (
  condition: {
    depDivAudience: number | string;
    depDivViewer: number | string;
    matchDepartment: number | string;
    targetAudience?: string;
    viewer?: string;
    page: number;
  },
  payload: any[],
  errorCallBack: (isLoading: boolean) => void,
) => {
  errorCallBack(true);

  return await HttpAxios.Delete('/api/v1/f6/management-evaluation/delete-history-reference', {
    data: [...payload],
    params: {
      ...condition,
      targetAudience: condition.targetAudience || '',
      viewer: condition.viewer || '',
    },
  })
    .then((response) => {
      errorCallBack(false);

      return response;
    })
    .catch(() => {
      errorCallBack(false);
    })
    .finally(() => {
      errorCallBack(false);
    });
};
const settingReview = {
  handleSearchSettingReviewHistory,
  getAllListDepartment,
  saveNumberPeriod,
  findSettingDefaultPeriod,
  handleDeleteRecordSettingHistoryReference,
};
export default settingReview;
