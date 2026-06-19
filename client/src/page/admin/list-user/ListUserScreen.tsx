/* eslint-disable prefer-const */
import { Form, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ListUserTable from './components/ListUserTable';
import UserSearchFormComponent from './components/UserSearchFormComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import userApiService from '../../../common/api/user.api';
import { t } from 'i18next';
import { conditionsUser, listUsers } from '../../../model/Conditions';
import PaginationV2 from '../../../common/PaginationV2';

const ListUserScreen: React.FC = () => {
  const roleList = [
    { id: 1, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1] },
    { id: 2, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[2] },
    { id: 3, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[3] },
    { id: 4, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[4] },
    { id: 5, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[5] },
    { id: 6, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[6] },
    { id: 7, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[7] },
    { id: 8, name: (t('IDL_LIST_ROLE', { returnObjects: true }) as any)[8] },
  ];

  const [listRole, setListRole] = useState([]) as any;
  const [form] = Form.useForm();
  const [listDepartmentTypeDepartment, setListDepartmentTypeDepartment] = useState([]) as any;
  const [listDepartmentTypeDivision, setListDepartmentTypeDivision] = useState([]) as any;
  const [listCompany, setListCompany] = useState([]) as any;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    /**Set all role */
    const temps = [{ id: t('IDS_ALL'), roleName: t('IDS_ALL') }];
    roleList.forEach((item: any) => {
      temps.push({ id: item.id, roleName: item.name });
    });
    setListRole(temps);
    userApiService.getAllDepartmentTypeDepartment({ callBackTypeDepartment, errorCallBack }); // get department type department
    userApiService.getAllDepartmentTypeDivision({ callBackTypeDivision, errorCallBack }); // get department type division
    userApiService.getAllCompany({ callBackCompany, errorCallBack }); // get department type division
  }, []);

  // get listdepartment type department
  const callBackTypeDepartment = (data: any) => {
    setListDepartmentTypeDepartment(data);
  };

  const callBackTypeDivision = (data: any) => {
    setListDepartmentTypeDivision(data);
  };

  const callBackCompany = (data: any) => {
    setListCompany(data);
  };

  const [conditions, setConditions] = useState<conditionsUser>(
    location.state || {
      offset: 0,
      limit: 20,
      sortBy: 'periodIndex',
      sortType: 'ASC',
      nameAndEmail: '',
      department: t('IDS_ALL'),
      role: t('IDS_ALL'),
      division: t('IDS_ALL'),
      company: t('IDS_ALL'),
      current: 1,
    },
  );
  const [dataSources, setDataSources] = useState<listUsers>();

  const callBack = (dataSource: listUsers) => {
    setDataSources(dataSource);
    setLoading(false);
  };
  const errorCallBack = () => {
    setLoading(false);
  };
  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      state: conditions,
    });
    if (conditions?.search) {
      userApiService.listUser(conditions, callBack, setLoading);
    }
  }, [conditions]);

  const handleOnchange = async () => {
    userApiService.listUser(location.state, callBack, setLoading);
  };

  return (
    <div>
      <Typography.Title level={3}>{t('IDS_LIST_USER')}</Typography.Title>
      <UserSearchFormComponent
        form={form}
        conditions={conditions}
        setConditions={setConditions}
        setDataSources={setDataSources}
        isLoading={isLoading}
        departments={listDepartmentTypeDepartment}
        divisions={listDepartmentTypeDivision}
        companys={listCompany}
        roleList={listRole}
        setSelectedRowKeys={setSelectedRowKeys}
      />

      {conditions?.search && (
        <ListUserTable
          dataState={dataSources?.data}
          isLoading={isLoading}
          handleOnchange={handleOnchange}
          setSelectedRowKeys={setSelectedRowKeys}
          selectedRowKeys={selectedRowKeys}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          condition={conditions}
        />
      )}
      {dataSources?.data && dataSources?.data.length > 0 && (
        <PaginationV2
          conditions={conditions}
          currents={conditions.current}
          dataSources={dataSources}
          errorCallBack={errorCallBack}
          limit={conditions.limit}
          location={location}
          navigates={navigate}
          setDataSources={setDataSources}
          url={'/api/v1/f8/management-user/find-user'}
          loading={isLoading}
          setLoading={setLoading}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      )}
    </div>
  );
};

export default ListUserScreen;
