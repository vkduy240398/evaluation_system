import { Form, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ListUserEvaluationEvaluatorTable from './components/ListUserEvaluationEvaluatorTable';
import SearchComponent from '../../../views/evaluator/list-evaluation/SearchComponent';
import userEvaluationApiService from '../../../common/api/userEvaluation';
import { listDepartment } from '../../../model/department';
import dayjs from 'dayjs';
import evaluatorApiService from '../../../common/api/evaluator';
import { useLocation, useNavigate } from 'react-router-dom';
import { statusEvaluationObjComboBox, statusEvaluationType } from '../../../common/status';
import { t } from 'i18next';
import { EvaluationPeriodHelper } from '../../../common/utils/datetime/EvaluationPeriodHelper';
import { useAuth } from '../../../hooks/useAuth';

const ListUserEvaluationEvaluatorScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [dataStates, setDataState] = useState<any>({
    data: [],
    counts: 50,
  });
  const [departments, setDepartment] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const years = new Date();
  years.setFullYear(location.state?.yearDisplayCalendar || years.getFullYear());
  const url = `/api/v1/f2/evaluator/list-user-evaluation`;
  const [condition, setCondition] = useState<any>(
    location.state || {
      email: '',
      department: [t('IDS_ALL')],
      evaluator: '0.5,1,2',
      salaryRank: '1,2,3,4,5,6,7,8,9,10',
      year: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      periodEvaluate:
        EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2,
      limit: 20,
      offset: 0,
      sortBy: 'periodStart',
      sortType: 'ASC',
      yearDisplayCalendar: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      current: 1,
      status: [
        [t('IDS_ALL'), 0],
        [t('IDS_ALL'), 1],
        [t('IDS_ALL'), 2],
        [t('IDS_ALL'), 3],
        [t('IDS_ALL'), 4],
        [t('IDS_ALL'), 5],
        [t('IDS_ALL'), 6],
        [t('IDS_ALL'), 7],
        [t('IDS_ALL'), 8],
        [t('IDS_ALL'), 49],
        [t('IDS_ALL'), 50],
        [t('IDS_ALL'), 51],
        [t('IDS_ALL'), 52],
        [t('IDS_ALL'), 53],
        [t('IDS_ALL'), 54],
        [t('IDS_ALL'), 55],
        [t('IDS_ALL'), 56],
        [t('IDS_ALL'), 57],
        [t('IDS_ALL'), 58],
        [t('IDS_ALL'), 59],
        [t('IDS_ALL'), 60],
        [t('IDS_ALL'), 61],
        [t('IDS_ALL'), 98],
        [t('IDS_ALL'), 99],
        [t('IDS_ALL'), 100],
      ],
      stringStatus: Object.keys(statusEvaluationObjComboBox).toString(),
      sortColumns: [],
      sortDirections: [],
    },
  );
  const [listStatus, setListStatus] = useState<any[]>([]);
  const [isFirstLoad, setFirstLoad] = useState<boolean>(false);
  const [departmentConditon, setDepartmentCondition] = useState<any>({
    year: condition.yearDisplayCalendar,
    periodIndex: condition.periodEvaluate,
  });
  const evaluators = [
    { id: '0.5,1,2', name: t('IDS_ALL') },
    { id: '0.5', name: t('IDS_POINT_EVALUATOR_0_5') },
    { id: '1', name: t('IDS_POINT_EVALUATOR_1') },
    { id: '2', name: t('IDS_POINT_EVALUATOR_2') },
  ];

  const levels = [
    { id: '1,2,3,4,5,6,7,8,9,10', name: t('IDS_ALL') },
    { id: '1,2,3,4,5,6,7', name: t('IDS_LEVEL_1_7') },
    { id: '8,9,10', name: t('IDS_LEVEL_8_10') },
  ];

  const [listEvaluators, setListEvaluator] = useState([]) as any;
  const [listLevels, setListLevels] = useState([]) as any;

  // get listdepartment
  const callBack = (data: listDepartment[]) => {
    setDepartment(data);
  };
  const errorCallBack = (bool: boolean | undefined) => {
    setLoading(bool || false);
  };

  const errorCallBackEvaluation = (bool: boolean | undefined) => {
    setLoading(bool || false);
  };

  // get list user evaluation
  const callBackListUserEvaluation = (data: any[]) => {
    setDataState(data);
    setFirstLoad(true);
  };
  useEffect(() => {
    /**set list evaluator */
    const tempEvaluators: { id: any; name: any }[] = [];
    evaluators.forEach((item: any) => {
      tempEvaluators.push({ id: item.id, name: item.name });
    });
    setListEvaluator(tempEvaluators);

    /**set list level */
    const tempLevels: { id: any; name: any }[] = [];
    levels.forEach((item: any) => {
      tempLevels.push({ id: item.id, name: item.name });
    });
    setListLevels(tempLevels);

    const statusSearchs: any[] = condition.status
      .toString()
      .split(',')
      .filter((v: any) => v !== t('IDS_ALL'));

    // userEvaluationApiService.getAllDepartmentEvaluation(
    //   { year: condition.yearDisplayCalendar, periodIndex: condition.periodEvaluate },
    //   { callBack, errorCallBack },
    // ); // get department
    if (location.state && location.state.Reload && location.state.Reload === true) {
      evaluatorApiService.listUserEvaluation(url, callBackListUserEvaluation, errorCallBackEvaluation, {
        // get user list evaluation
        ...condition,
        year: dayjs(condition.year, 'YYYY').format('YYYY'),
        stringStatus:
          condition.status.length > 0 ? statusSearchs.toString() : Object.keys(statusEvaluationObjComboBox).toString(),
      });
    }

    // create status
    const arrayStatus = [];
    const arrayParents = [];
    for (let index = 0; index < Object.keys(statusEvaluationObjComboBox).length; index++) {
      const status: number = parseInt(Object.keys(statusEvaluationObjComboBox)[index]);
      const i: statusEvaluationType = status as statusEvaluationType;
      arrayStatus.push({
        label: statusEvaluationObjComboBox[i],
        value: i,
      });
    }
    arrayParents.push({
      label: t('IDS_ALL'),
      value: t('IDS_ALL'),
      children: arrayStatus,
    });
    setListStatus(arrayParents);
  }, []);
  useEffect(() => {
    userEvaluationApiService.getAllDepartmentEvaluation(departmentConditon, { callBack, errorCallBack }); // get department
  }, [departmentConditon]);
  const setFirsrLoading = () => {
    setFirstLoad(true);
  };

  return (
    <div>
      <Typography.Title level={3}>{t('IDS_LIST_EVALUATION')}</Typography.Title>
      <SearchComponent
        form={form}
        errorCallBack={errorCallBack}
        callBackListUserEvaluation={callBackListUserEvaluation}
        Form={Form}
        setCondition={setCondition}
        conditions={condition}
        departments={departments}
        isLoading={isLoading}
        setDataState={setDataState}
        url={url}
        navigates={navigate}
        location={location}
        listStatus={listStatus}
        setFirsrLoading={setFirsrLoading}
        listEvaluators={listEvaluators}
        listLevels={listLevels}
        setDepartmentCondition={setDepartmentCondition}
        departmentConditon={departmentConditon}
      />
      <ListUserEvaluationEvaluatorTable
        current={condition.current}
        limit={condition.limit}
        url={url}
        conditions={condition}
        isLoading={isLoading}
        dataSources={dataStates}
        setCondition={setCondition}
        setDataState={setDataState}
        errorCallBack={errorCallBack}
        navigates={navigate}
        location={location}
        isFirstLoad={isFirstLoad}
        setLoading={setLoading}
        callBackListUserEvaluation={callBackListUserEvaluation}
        errorCallBackEvaluation={errorCallBackEvaluation}
      />
    </div>
  );
};

export default ListUserEvaluationEvaluatorScreen;
