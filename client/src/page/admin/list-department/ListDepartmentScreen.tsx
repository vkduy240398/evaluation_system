/* eslint-disable react/jsx-no-undef */
/* eslint-disable prefer-const */
import { Form, Typography } from 'antd';
import { useEffect, useState } from 'react';
import DepartmentSearchForm from './DepartmentSearchForm';
import { useLocation, useNavigate } from 'react-router-dom';
import DepartmentTable from './DepartmentTable';
import departmentApiService from '../../../common/api/department.api';
import { t } from 'i18next';
import PaginationV2 from '../../../common/PaginationV2';
import { DivisionListResponse, DivisionType, conditionsDepartment } from './interfaces/interfaces';
import { urlCompanyCode } from '../../../common/util';
interface Props {
  type: number;
}
const ListDepartmentScreen: React.FC<Props> = (props: Props) => {
  const { type } = props;
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const [conditions, setConditions] = useState<conditionsDepartment>(
    location.state || {
      offset: 0,
      limit: 20,
      sortBy: 'periodIndex',
      sortType: 'ASC',
      catergory: type,
      departmentCodeAndName: '',
      classification: t('IDS_ALL'),
      current: 1,
      divisionId: null,
    },
  );

  //handle 2 screens
  const url =
    type === 1 ? '/api/v1/f8/management-user/find-department' : '/api/v1/f8/management-user/find-sub-department';
  if (type === 0 && !location.state) navigate(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + '/list-division');

  const [dataSources, setDataSources] = useState({} as DivisionListResponse);

  const [selectedDivision, setSelectedDivision] = useState<DivisionType>({
    code: '',
    name: '',
    id: null,
  });

  const [isLoading, setLoading] = useState<boolean>(false);

  const callBack = async (dataSource: DivisionListResponse) => {
    setDataSources(dataSource);
    if (dataSource.data?.length === 0 && location?.state?.current > 1 && dataSource?.counts > 0) {
      setConditions({
        ...conditions,
        offset: location.state.offset - location.state.limit,
        current: location.state.current - 1,
      });

      await navigate(location.pathname, {
        replace: true,
        state: {
          ...conditions,
        },
      });
    }
  };

  const errorCallBack = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (conditions?.search && location.state) {
      handleSearch(location.state);
      navigate(location.pathname, {
        replace: true,
        state: location.state,
      });
    } else if (!location.state || (type == 1 && location.state?.divisionId)) {
      setDataSources({} as any);
      setConditions({...location.state, search: false});
      navigate(urlCompanyCode() + '/admin-user/list-division', {
        replace: true,
        state: {
          ...location.state,
          search: false
        },
      });
    }
  }, [type]);

  const handleOnchange = async () => {
    if (type == 1) {
      await departmentApiService.listDepartment(location.state, callBack, setLoading);
    } else {
      await departmentApiService.listSubDepartment(
        location.state,
        callBack,
        setLoading,
        location.state?.divisionId,
        setSelectedDivision,
      );
    }
  };

  const handleSearch = (searchConditions: conditionsDepartment) => {
    if (type == 1) {
      departmentApiService.listDepartment(searchConditions, callBack, setLoading);
    } else {
      departmentApiService.listSubDepartment(
        searchConditions,
        callBack,
        setLoading,
        location.state?.divisionId,
        setSelectedDivision,
      );
    }
  };

  return (
    <div>
      <Typography.Title level={3}>{type == 1 ? t('IDS_LIST_DIVISION') : t('IDS_LIST_DEPARTMENT')}</Typography.Title>
      <DepartmentSearchForm
        form={form}
        conditions={conditions}
        setConditions={setConditions}
        setDataSources={setDataSources}
        isLoading={isLoading}
        listCatergories={[]}
        listClassifications={[]}
        type={type}
        divisionId={location.state?.divisionId}
        handleSearch={handleSearch}
        selectedDivision={selectedDivision}
      />

      {conditions?.search && (
        <DepartmentTable
          tableData={dataSources}
          isLoading={isLoading}
          handleOnchange={handleOnchange}
          type={type}
          form={form}
          setConditions={setConditions}
          selectedDivision={selectedDivision}
        />
      )}
      {dataSources?.data && dataSources?.data.length > 0 && (
        <PaginationV2
          limit={conditions.limit}
          conditions={location.state ? location.state : conditions}
          currents={location.state ? location.state.current : conditions.current}
          url={url}
          setDataSources={setDataSources}
          errorCallBack={errorCallBack}
          navigates={navigate}
          location={location}
          dataSources={dataSources}
          loading={isLoading}
          setLoading={setLoading}
        />
      )}
    </div>
  );
};

export default ListDepartmentScreen;
