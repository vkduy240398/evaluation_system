import { Typography } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListComponent from './components/ListComponent';
import SearchComponent from './components/SearchComponent';
import { EvaluationPeriodHelper } from '../../common/utils/datetime/EvaluationPeriodHelper';
import PaginationV2 from '../../common/PaginationV2';
import dayjs from 'dayjs';
import { urlCompanyCode } from '../../common/util';
import referenceReviewService from '../../common/api/reference-review';
import { useAuth } from '../../hooks/useAuth';

const ReferenceReviewScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const [condition, setCondition] = useState(
    location.state || {
      email: '',
      department: t('IDS_ALL'),
      salaryRank: '1,2,3,4,5,6,7,8,9,10',
      year: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      periodEvaluate:
        EvaluationPeriodHelper.getCurrentPeriodIndex(auth.user?.timeZone || 'Asia/Tokyo') === '上期' ? 1 : 2,
      yearDisplayCalendar: EvaluationPeriodHelper.getCurrentPeriodYear(auth.user?.timeZone || 'Asia/Tokyo'),
      typeReference: '1,2,3,4,5,6',
      sortBy: 'periodStart',
      sortType: 'ASC',
      current: 1,
      limit: 20,
      offset: 0,
    },
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dataSources, setDataSources] = useState<{
    counts: number;
    data: any[];
  }>({
    counts: 0,
    data: [],
  });
  const [departmentList, setDepartmentList] = useState<any>([]);

  const callback = (data: any) => {
    setDataSources(data);
  };

  const handleSearch = async (conditions: any) => {
    // call API, set dataSource, update condition, update location.state
    await referenceReviewService.getReferenceReview(conditions, callback, setIsLoading);
    setCondition({ ...conditions, search: true });
    navigate(urlCompanyCode() + '/reference-review', {
      replace: true,
      state: {
        ...conditions,
        search: true,
      },
    });
  };

  const handleFinish = (values: any) => {
    const newCondition = {
      ...values,
      year: dayjs(values.year, 'YYYY').format('YYYY'),
      yearDisplayCalendar: dayjs(values.year, 'YYYY').format('YYYY'),
      current: 1,
      offset: 0,
      limit: 20,
      departmentSearch: departmentList
        .filter((v: any) => v.value === values.department)
        .map((v: any) => ({ name: v.name, type: v.type }))[0],
    };
    handleSearch(newCondition);
  };

  useEffect(() => {
    if (condition?.search && location.state) {
      handleSearch(location.state);
    } else {
      setDataSources({
        counts: 0,
        data: [],
      });
      setCondition({ ...condition, search: false });
      navigate(urlCompanyCode() + '/reference-review', {
        replace: true,
        state: {
          ...condition,
          search: false,
        },
      });
    }
  }, []);

  return (
    <>
      <Typography.Title level={3}>{t('IDS_LIST_REFERENCE_REVIEW')}</Typography.Title>
      <SearchComponent
        key="search-component"
        conditions={condition}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setDataSources={setDataSources}
        onFinish={handleFinish}
        setDepartmentList={setDepartmentList}
      />
      {condition?.search && <ListComponent key="list-component" dataSources={dataSources} isLoading={isLoading} />}
      {condition?.search && dataSources?.data?.length > 0 && (
        <PaginationV2
          conditions={location.state || condition}
          currents={condition.current}
          limit={condition.limit}
          url={'/api/v1/common/list-reference-review'}
          setDataSources={setDataSources}
          errorCallBack={setIsLoading}
          location={location}
          navigates={navigate}
          dataSources={dataSources}
          loading={isLoading}
          setLoading={setIsLoading}
        />
      )}
    </>
  );
};

export default ReferenceReviewScreen;
