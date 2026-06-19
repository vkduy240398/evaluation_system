import './components/AddUserTable.css';
import { Form, Input, Select, Table, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { OracleUser } from '../../../model/OracleUser';
import { MainButton } from '../../../common/MainButton';
import AddUserApiService from '../../../common/api/addUser';
import CustomPaginationOracle from '../../../common/custom-pagination-oracle';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid } from 'antd';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import { SearchOutlined } from '@ant-design/icons';
const { useBreakpoint } = Grid;
const OracleUserTable: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [defaultDatas, setDefaultDatas] = useState<OracleUser[]>([]);
  const [listDepartment, setListDepartment] = useState<any>();
  const [isLoadingDepartment, setIsLoadingDepartment] = useState<boolean>(true);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [departmentSearch, setDepartmentSearch] = useState<any>();
  const [companySearch, setCompanySearch] = useState<any>();

  const [emailSearch, setEmailSearch] = useState<any>();
  const [isDisableAddButton, setIsDisableAddButton] = useState<boolean>(true);
  const [addUserList, setAddUserList] = useState<any[]>([]);
  const [isDisableSearch, setIsDisableSearch] = useState<boolean>(false);
  const navigates = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const screens = useBreakpoint();
  const [isOpenModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => setOpenModal(!isOpenModal);
  const [listCompany, setListCompany] = useState<any>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [condition, setCondition] = useState(
    location.state || {
      email: '',
      department: null,
      company: null,
      offset: 0,
      limit: 20,
    },
  );

  useEffect(() => {
    const fetchData = async () => {
      const department: any = await AddUserApiService.getDepartmentOracle();
      const company: any = await AddUserApiService.getCompanyOracle();

      setListDepartment(department);

      setListCompany(company);

      setIsLoadingDepartment(false);
    };
    if (!listDepartment) {
      fetchData();
    }
  }, []);
  const columns = [
    {
      title: t('IDS_FULLNAME'),
      dataIndex: 'fullName',
      align: 'left' as const,
      render: (_text: any, _record: any) => {
        return (
          <span>
            {_record.employeeNumber}: {_text}
          </span>
        );
      },
    },
    {
      title: t('IDS_COMPANY'),
      dataIndex: 'company',
      align: 'left' as const,
    },
    {
      title: t('IDS_DEPARTMENT'),
      dataIndex: 'department',
      align: 'left' as const,
      render: (_text: any, _record: any) => {
        return (
          <span>
            {_record.departmentId}: {_text}
          </span>
        );
      },
    },
    {
      title: t('IDS_EMAIL'),
      dataIndex: 'email',
      align: 'left' as const,
    },
  ];
  // xử lý gọi api add user
  const handleAddUser = async () => {
    handleOpenModal();
    setIsLoadingTable(true);
    const callback = async () => {
      message.success(t('MESSAGE.COMMON.IDM_ADD_USER_SUCCESS'));
      setSelectedRowKeys([]);
      setDefaultDatas([]);
      setIsLoadingTable(false);
    };
    const errorCallback = () => {};
    await AddUserApiService.addUser(addUserList, { callback, errorCallback });
    setDefaultDatas([]);
    setTotal(0);

    navigates(location.pathname, {
      replace: true,
      state: {
        email: '',
        department: t('IDS_ALL'),
        offset: 0,
        limit: 20,
      },
    });

    // console.log(condition);
    form.setFieldsValue({ email: '', department: t('IDS_ALL') });
    setIsDisableAddButton(true);

    // setCurrentPage(offset / 20 + 1);
    // await getData(condition.offset, condition.limit, condition.department, condition.email);
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: OracleUser[]) => {
    const selectedRowKeyTemps: any[] = [];
    newSelectedRowKeys
      .sort((a: any, b: any) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }

        return 0;
      })
      .map((item: any) => {
        if (selectedRowKeyTemps.findIndex((v) => v.substring(0, 7) === item.substring(0, 7)) < 0) {
          selectedRowKeyTemps.push(item);
        } else {
          const index = selectedRows.findIndex((v: any) => v.key === item);
          selectedRows.splice(index, 1);
        }
      });

    setAddUserList(selectedRows);
    setSelectedRowKeys(selectedRowKeyTemps);
    if (selectedRows.length > 0) setIsDisableAddButton(false);
    else setIsDisableAddButton(true);
  };
  const getData = async (offset: number, next: number, department: string, email: string, company: string) => {
    navigates(location.pathname, {
      replace: true,
      state: {
        ...condition,
        ...form.getFieldsValue(['email', 'department', 'company']),
        offset: offset,
        next: next,
        search: true,
      },
    });

    setIsLoadingTable(true);
    const result: any = await AddUserApiService.getUserOracle({
      params: {
        email: email ? email : '',
        departmentId: department ? department : '',
        company: company ? company : '',
        offset: offset,
        next: next,
      },
    });
    setIsLoadingTable(false);
    setSelectedRowKeys([]);
    setAddUserList([]);
    setDefaultDatas(result.data.data);
    setTotal(result.data.total);
    setCurrentPage(offset / 20 + 1);
    setIsDisableAddButton(true);
  };

  const rowSelection: any = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
    getCheckboxProps: (record: any) => {
      const rowIndex = selectedRowKeys.findIndex(
        (item: any) => item.substring(0, 7) === record.key.substring(0, 7) && item !== record.key,
      );
      if (rowIndex >= 0) {
        return {
          disabled: true,
        };
      }
    },
  };
  const onFinish = async (values: any) => {
    setDepartmentSearch(values.department);
    setEmailSearch(values.email);
    setCompanySearch(values.company);
    setIsLoadingTable(true);
    getData(0, 20, values.department, values.email, values.company);
  };
  useEffect(() => {
    form.setFieldsValue(condition);
  }, []);
  useEffect(() => {
    navigates(location.pathname, {
      replace: true,
      state: condition,
    });
    if (condition?.search) {
      getData(condition.offset, condition.limit, condition.department, condition.email, condition.company);
    }
  }, [condition]);

  return (
    <div>
      <Typography.Title level={3}>{t('IDS_ADD_USER')}</Typography.Title>
      <Form
        initialValues={{ remember: true }}
        colon={false}
        labelCol={{ span: 1 }}
        style={{ width: '100%' }}
        layout="horizontal"
        labelAlign="left"
        onFinish={onFinish}
        form={form}
      >
        <Form.Item label={t('IDS_COMPANY_NAME')} name={'company'}>
          <Select
            showSearch
            style={{ width: '200px' }}
            loading={isLoadingDepartment}
            options={listCompany}
            filterOption={(input: any, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            disabled={isLoadingTable || isLoadingDepartment}
          />
        </Form.Item>
        <Form.Item label={t('IDS_DEPARTMENT')} name={'department'} initialValue={t('IDS_ALL')}>
          <Select
            showSearch
            style={{ width: '200px' }}
            loading={isLoadingDepartment}
            options={listDepartment}
            filterOption={(input: any, option: any) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            disabled={isLoadingTable || isLoadingDepartment}
          />
        </Form.Item>
        <Form.Item
          label={t('IDS_FULLNAME_EMAIL')}
          name={'email'}
          rules={[
            {
              max: 30,
              message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
            },
          ]}
        >
          <Input
            style={{ width: '200px' }}
            maxLength={31}
            onChange={(e) => {
              if (e.target.value.length > 30) setIsDisableSearch(true);
              else setIsDisableSearch(false);
            }}
            disabled={isLoadingTable || isLoadingDepartment}
          />
        </Form.Item>

        <MainButton
          htmlType="submit"
          type="primary"
          name="Search"
          value="txt_evaluation_search"
          style={{ marginBottom: 20, marginTop: 15 }}
          loading={isLoadingTable || isLoadingDepartment}
          disabled={isDisableSearch}
          icon={<SearchOutlined />}
        >
          {t('IDS_BUTTON_SEARCH')}
        </MainButton>
        {location.state?.search && (
          <MainButton
            disabled={isDisableAddButton || isLoadingTable || isLoadingDepartment}
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            style={{ marginBottom: 20 }}
            onClick={handleOpenModal}
          >
            {t('IDS_BUTTON_ADD_MULTIPLE')}
          </MainButton>
        )}
      </Form>
      {location.state?.search && (
        <Table
          loading={isLoadingTable}
          bordered
          rowSelection={rowSelection}
          dataSource={defaultDatas}
          columns={columns}
          size="small"
          pagination={false}
          locale={{
            emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
          }}
          scroll={{ x: screens.xs ? 1000 : undefined }}
          rowClassName={(rc: any) =>
            selectedRowKeys.findIndex(
              (item: any) => item.substring(0, 7) === rc.key.substring(0, 7) && item !== rc.key,
            ) >= 0
              ? 'table-row-selected-disable'
              : ''
          }
        />
      )}
      {location.state?.search && total ? (
        <CustomPaginationOracle
          isDisable={isLoadingTable}
          departmentSearch={departmentSearch}
          companySearch={companySearch}
          emailSearch={emailSearch}
          fnOnchange={getData}
          total={total}
          defaultCurrentPage={0}
          t={t}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setIsLoadingTable={setIsLoadingTable}
        />
      ) : (
        <div></div>
      )}

      <ModalCustomComponent
        isOpen={isOpenModal}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_ADD_USER')}
        fnHandleOk={handleAddUser}
        fnHandleCancel={handleOpenModal}
        okText={t('IDS_BUTTON_ADD') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoadingTable}
      />
    </div>
  );
};

export default OracleUserTable;
