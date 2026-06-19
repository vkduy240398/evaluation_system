import { ListPeriods } from '../../../page/admin/review-management/interfaces/InterfacesProps';
import { EvaluationByPeriodType, PeriodType } from '../../../types/api/adminPeriodType';
import HttpAxios from '../../http';

const listPeriodByYear = async (
  url: string,
  condition: any,
  callBack: (data: ListPeriods[]) => void,
  errorsCallback: (bool: boolean) => void,
) => {
  errorsCallback(true);

  return await HttpAxios.Get(url, { params: condition }).then((res) => {
    if (res && res?.status === 200) {
      callBack(res?.data);
      errorsCallback(false);
    } else {
      errorsCallback(false);
    }
  });
};

const getCompany = async (props: { callback: (data: any) => void; errorCallback?: () => void }) => {
  const { callback, errorCallback } = props;

  return await HttpAxios.Get('/api/v1/f5/management-evaluation-history/company').then((res) => {
    if (res && res.status === 200) {
      //
      callback(res.data);
    } else errorCallback && errorCallback();
  });
};

const getDepartment = async (
  year: number,
  periodIndex: number,
  props: { callback: (data: any) => void; errorCallback?: () => void },
) => {
  const { callback, errorCallback } = props;

  return await HttpAxios.Get('/api/v1/f5/management-evaluation-history/department', {
    params: {
      year,
      periodIndex,
    },
  }).then((res) => {
    if (res && res.status === 200) {
      //
      callback(res.data);
    } else errorCallback && errorCallback();
  });
};

const getUserActiveByCondition = async (props: {
  departmentId: number | undefined;
  companyId: number | undefined;
  periodId: number | undefined;
  searchField: string;
  callback: (data: any) => void;
  errorCallback?: () => void;
  limit?: number;
  offset?: number;
}) => {
  const { departmentId, companyId, periodId, searchField, limit, offset, callback, errorCallback } = props;

  return await HttpAxios.Get('/api/v1/f7/management-evaluation-setting/user', {
    params: {
      limit,
      offset,
      departmentId,
      companyId,
      periodId,
      searchField,
    },
  }).then((res) => {
    if (res && res.status === 200) {
      callback(res.data);
    } else errorCallback && errorCallback();
  });
};

const getEvaluationPeriod = async (props: {
  userId: number;
  year: number;
  periodIndex: number;
  callback: (data: { evaluations: EvaluationByPeriodType[]; period: PeriodType }) => void;
  errorCallback?: () => void;
}) => {
  const { userId, year, periodIndex, callback, errorCallback } = props;

  return await HttpAxios.Get('/api/v1/f5/management-evaluation-history/exception/get-evaluation-by-period', {
    params: {
      userId,
      year,
      periodIndex,
    },
  }).then((res) => {
    if (res && res.status === 200) {
      callback(res.data);
    } else errorCallback && errorCallback();
  });
};

const getEvaluatorUsers = async (props: {
  evaluationCreatorId: number | undefined;
  callback: (data: any) => void;
  errorCallback?: () => void;
}) => {
  const { evaluationCreatorId, callback, errorCallback } = props;

  return await HttpAxios.Get('/api/v1/f5/management-evaluation-history/user/evaluator', {
    params: { evaluationCreatorId },
  }).then((res) => {
    if (res && res.status === 200) {
      callback(res.data);
    } else errorCallback && errorCallback();
  });
};

const updateEvaluationPeriodException = async (props: {
  evaluations: EvaluationByPeriodType[];
  userId: number;
  deleteIds: number[];
  year: number;
  periodIndex: number;
  callback: (data: any) => void;
  errorCallback?: () => void;
}) => {
  const { evaluations, userId, deleteIds, year, periodIndex, callback, errorCallback } = props;

  return await HttpAxios.Put('/api/v1/f5/management-evaluation-history/exception', {
    evaluations,
    userId,
    deleteIds,
    year,
    periodIndex,
  }).then((res) => {
    if (res && res.status === 200) {
      callback(res.data);
    } else errorCallback && errorCallback();
  });
};

const getUserPeriodException = async (props: {
  year: number;
  periodIndex: number;
  callback: (data: any) => void;
  errorCallback?: () => void;
  limit?: number;
  offset?: number;
}) => {
  const { year, periodIndex, limit, offset, callback, errorCallback } = props;

  return await HttpAxios.Get('/api/v1/f7/management-evaluation-setting/get-user-period-exception', {
    params: { year, periodIndex, limit, offset },
  }).then((res) => {
    if (res && res.status === 200) {
      callback(res.data);
    } else errorCallback && errorCallback();
  });
};
const AdminPeriodApiService = {
  listPeriodByYear,
  getCompany,
  getDepartment,
  getUserActiveByCondition,
  getEvaluatorUsers,
  getEvaluationPeriod,
  updateEvaluationPeriodException,
  getUserPeriodException,
};
export default AdminPeriodApiService;
