import { Form, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import SearchFieldComponent from './component/searchFieldComponent';
import { EvaluationPeriodHelper } from '../../common/utils/datetime/EvaluationPeriodHelper';
import moment from 'moment-timezone';
import { useAuth } from '../../hooks/useAuth';
import evaluatorApiService from '../../common/api/evaluator';
import { useTranslation } from 'react-i18next';
import PaginationV2 from '../../common/PaginationV2';
import UserTableProSkillExpertise from './component/userTableProSkillExpertise';
import { listUsersExpertise } from '../../model/Conditions';

const ProSkillExpertise = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [listDepartments, setListDepartment] = useState<{ name: string; id: number }[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const years = new Date();
  years.setFullYear(location.state?.yearDisplayCalendar || years.getFullYear());

  const auth = useAuth();
  const [conditions, setConditions] = useState(
    location.state || {
      department: [],
      fullName: '',
      yearStart: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      yearEnd: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      firstLoad: true,
      current: 1,
      offset: 0,
      limit: 20,
      sortColumns: [],
      sortDirections: [],
      yearEvaluate: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      periodEvaluate:
        EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2,
      yearAndPeriod: `${EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo')}_${
        EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2
      }`,
    },
  );

  const [departmentConditon, setDepartmentCondition] = useState<any>({
    yearEvaluate: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
    periodEvaluate:
      EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2,
  });

  useEffect(() => {
    form.setFieldsValue({
      year: [
        dayjs(moment(conditions.yearStart, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
        dayjs(moment(conditions.yearEnd, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY'),
      ],
      periodEvaluate: `${dayjs(moment(conditions.yearEvaluate, 'YYYY-MM-DD').format('YYYY-MM-DD'), 'YYYY').format(
        'YYYY',
      )}_${EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2}`,
    });
  }, []);

  const handleLoading = (bool: boolean) => {
    setLoading(bool);
  };

  const callBackDivisionAndDepartment = (data: { name: string; id: number }[]) => {
    setListDepartment(data);
  };

  const [dataSources, setDataSources] = useState<listUsersExpertise>();

  const callBack = (dataSource: listUsersExpertise) => {
    setDataSources(dataSource);
    setLoading(false);
  };

  useEffect(() => {
    evaluatorApiService.getDepartmentsProSkillExpertise(
      departmentConditon,
      callBackDivisionAndDepartment,
      handleLoading,
    );
  }, [departmentConditon]);

  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      state: conditions,
    });

    if (conditions?.search) {
      evaluatorApiService.searchListUserProSkillExpertise(conditions, callBack, setLoading);
    }
  }, [conditions]);

  return (
    <div>
      <Typography.Title level={3}>{t('REVIEW_SUMMARY.IDS_TITLE_LIST_USER_SUMMARY_REVIEWS')}</Typography.Title>
      <SearchFieldComponent
        form={form}
        conditions={conditions}
        setConditions={setConditions}
        departmentList={listDepartments}
        isLoading={isLoading}
        setDepartmentCondition={setDepartmentCondition}
        departmentConditon={departmentConditon}
      />

      {conditions?.search && (
        <UserTableProSkillExpertise
          dataState={dataSources?.data}
          isLoading={isLoading}
          conditions={conditions}
          setConditions={setConditions}
          location={location}
          callBack={callBack}
          setLoading={setLoading}
        />
      )}
      {dataSources?.data && dataSources?.data.length > 0 && (
        <PaginationV2
          conditions={conditions}
          currents={conditions.current}
          dataSources={dataSources}
          errorCallBack={handleLoading}
          limit={conditions.limit}
          location={location}
          navigates={navigate}
          setDataSources={setDataSources}
          url={'/api/v1/f2/evaluator/get-list-user-pro-skill-expertise'}
          loading={isLoading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};
export default ProSkillExpertise;
