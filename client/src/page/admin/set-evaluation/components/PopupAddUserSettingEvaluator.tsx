/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button, Cascader, Col, Form, Input, Modal, Row, Table, Tooltip, Typography, message } from 'antd';
import { t } from 'i18next';
import Icon, { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import EmptyComponent from '../../../../common/EmptyComponent';
import settingEvaluatorApiService from '../../../../common/api/settingEvaluator';
import { MainButton } from '../../../../common/MainButton';
import { TableRowSelection } from 'antd/es/table/interface';
import httpAxios from '../../../../common/http';
import PaginationCustom from '../../../../@core/components/pagination-custom';

interface Props {
  state: any;
  handleOnchange: any;
  conditions: any;
  isOpenPopupAddUser: any;
  setOpenPopupAddUser: any;
  divisionList?: any[];
}

const PopupAddUserSettingEvaluator: React.FC<Props> = (props: Props) => {
  const { state, handleOnchange, conditions, setOpenPopupAddUser, isOpenPopupAddUser, divisionList = [] } = props;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [dataSources, setDataSources] = useState<any>();
  const [isSearch, setIsSearch] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(20);
  const [currentPage, getPageCurrent] = useState<number>(1);
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [cascaderValue, setCascaderValue] = useState<any[]>([t('IDS_ALL')]);

  const [conditionSearchPopup, setConditionSearchPopup] = useState<{
    division: any;
    department: any;
    nameAndEmail: any;
  }>();

  const cascaderOptions = [{ label: t('IDS_ALL'), value: t('IDS_ALL'), isLeaf: true }, ...divisionList];

  const columns = [
    {
      title: t('IDS_FULLNAME'),
      dataIndex: 'name',
      width: '13%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ textAlign: 'left' }}>{record.employeeNumber + ': ' + record.fullName}</div>
      ),
    },
    {
      title: t('IDS_COMPANY'),
      dataIndex: 'companyName',
      width: '16%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ textAlign: 'left' }}>{record.company === null ? '' : record.company.name}</div>
      ),
    },
    {
      title: t('IDS_TYPE_DIVISION_NAME'),
      dataIndex: 'divisionName',
      width: '16%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ textAlign: 'left', maxWidth: 200 }}>{record.division === null ? '' : record.division.name}</div>
      ),
    },
    {
      title: t('IDS_TYPE_DEPARTMENT_NAME'),
      dataIndex: 'departmentName',
      width: '16%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ textAlign: 'left', maxWidth: 200 }}>
          {record.department === null ? '' : record.department.name}
        </div>
      ),
    },
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      width: '4%',
      align: 'center' as const,
      render: (_text: any, record: any) => (
        <div style={{ textAlign: 'center' }}>{record.level === null ? '' : record.level}</div>
      ),
    },
    {
      title: t('IDS_EMAIL'),
      dataIndex: 'email',
      width: '18%',
      align: 'center' as const,
      render: (_text: any, record: any) => <div style={{ textAlign: 'left' }}>{record.email ? record.email : ''}</div>,
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection: TableRowSelection<any> = {
    columnWidth: '1%',
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const callBackListSettingEvaluator = (dataSource: any) => {
    setTotal(dataSource.counts);
    setDataSources(dataSource);
  };

  const onFinish = async (values: { nameAndEmail: any; limit?: number; offset?: number }, isPagination?: boolean) => {
    const division: any = selectedDivisionId ?? t('IDS_ALL');
    const department: any = selectedDepartmentId ?? t('IDS_ALL');

    await settingEvaluatorApiService
      .findListUserToSettingEvaluation({
        ...values,
        division,
        department,
        nameAndEmail: values.nameAndEmail,
        callBackListSettingEvaluator,
        setLoading,
        state,
        tabMode: conditions?.tabMode ?? null,
      })
      .then(() => {
        setLoading(false);
        !isPagination && getPageCurrent(1);
        setConditionSearchPopup({ division, department, nameAndEmail: values.nameAndEmail });
        setSelectedRowKeys([]);
        setIsSearch(true);
      });
  };

  const handleSearchPagination = async (arg: { limit?: number; offset?: number }) => {
    if (conditionSearchPopup) await onFinish({ ...conditionSearchPopup, ...arg } as any, true);
  };

  const handleAdd = async () => {
    setLoading(true);

    return await httpAxios
      .Post('/api/v1/f5/management-evaluation-history/add-user-setting-evaluation', {
        selectedRowKeys,
        state,
        tabMode: conditions?.tabMode ?? null,
      })
      .then((res) => {
        if (res?.status === 201) {
          message.success(t('MESSAGE.COMMON.IDM_ADD_USER_SUCCESS'));
          form.resetFields();
          setCascaderValue([t('IDS_ALL')]);
          setSelectedDivisionId(null);
          setSelectedDepartmentId(null);
          setDataSources(undefined);
          setIsSearch(false);
          setSelectedRowKeys([]);
          setSelectedRows([]);
          setOpenPopupAddUser(false);
          if (conditions?.isSearch) {
            handleOnchange();
          }
        }
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setOpenPopupAddUser(false);
    form.resetFields();
    setCascaderValue([t('IDS_ALL')]);
    setSelectedDivisionId(null);
    setSelectedDepartmentId(null);
    setDataSources(undefined);
    setIsSearch(false);
    setSelectedRowKeys([]);
  };

  return (
    <div>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        title={<Typography.Title level={4}>{t('IDS_ADD_USER')}</Typography.Title>}
        open={isOpenPopupAddUser}
        footer={null}
        style={{ top: 20 }}
        width="90%"
        maskClosable={false}
        onCancel={handleCancel}
      >
        <Form
          name="create_template_form"
          colon={false}
          labelCol={{ span: 1 }}
          style={{ width: '100%' }}
          layout="horizontal"
          labelAlign="left"
          form={form}
          onFinish={onFinish}
        >
          {/* 部署名 & 課名 combined cascader — reuses divisionList already loaded by parent */}
          <Form.Item label={t('IDS_DEPARTMENT')} name="department" colon={false} initialValue={t('IDS_ALL')}>
            <Cascader
              options={cascaderOptions}
              value={cascaderValue}
              showSearch
              changeOnSelect
              clearIcon={false}
              style={{ width: '240px' }}
              displayRender={(labels) => {
                const filtered = labels.filter((l) => l && l !== t('IDS_ALL'));
                return filtered.length > 0 ? filtered.join(' ► ') : t('IDS_ALL');
              }}
              onChange={(values: any, selectedOptions: any) => {
                const newVal = values ?? [t('IDS_ALL')];
                setCascaderValue(newVal);
                if (!values || values.length === 0 || values[0] === t('IDS_ALL')) {
                  form.setFieldValue('department', t('IDS_ALL'));
                  setSelectedDivisionId(null);
                  setSelectedDepartmentId(null);
                  return;
                }
                const opts = selectedOptions as any[];
                if (opts.length >= 2) {
                  setSelectedDivisionId(opts[0]?.value ?? null);
                  setSelectedDepartmentId(opts[1]?.value ?? null);
                } else if (opts.length === 1) {
                  setSelectedDivisionId(opts[0]?.value ?? null);
                  setSelectedDepartmentId(null);
                } else {
                  setSelectedDivisionId(null);
                  setSelectedDepartmentId(null);
                }
              }}
              notFoundContent={<EmptyComponent />}
              size="small"
            />
          </Form.Item>

          <div style={{ width: '240px' }}>
            <Form.Item
              label={
                <Row>
                  <Col>{(t('IDL_LIST_ROLE', { returnObjects: true }) as any)[1]}</Col>
                  <Col>
                    <Tooltip
                      title={t('IDS_TOOLTIP_SEARCH_EXPLAINATION')}
                      color="#424242"
                      overlayInnerStyle={{ fontSize: '11px' }}
                    >
                      <Icon
                        component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                        style={{ color: '#6e5b14', fontSize: 18, marginLeft: '7px', marginTop: 2, cursor: 'default' }}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              }
              colon={false}
              name="nameAndEmail"
              rules={[
                {
                  max: 30,
                  message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30'),
                },
              ]}
            >
              <Input maxLength={31} style={{ width: '240px' }} />
            </Form.Item>
          </div>

          <Button
            htmlType="submit"
            className="main_button"
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            style={{ marginTop: 15 }}
            loading={isLoading}
            icon={<SearchOutlined />}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Form>

        {isSearch && (
          <>
            {dataSources?.data && (
              <Table
                style={{ marginTop: 20 }}
                bordered
                rowKey={(row) => row.id}
                rowSelection={rowSelection}
                dataSource={dataSources?.data}
                columns={columns}
                loading={isLoading}
                pagination={false}
                size="small"
                className="ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer"
                locale={{ emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA') }}
                scroll={{ x: 1097 }}
              />
            )}

            {dataSources?.data && dataSources?.data.length > 0 ? (
              <PaginationCustom
                fnOnchange={handleSearchPagination}
                total={total}
                fnGetCurrentPage={getPageCurrent}
                currentPage={currentPage}
                isLoading={isLoading}
              />
            ) : null}

            {dataSources?.data && (
              <MainButton
                type="primary"
                name="Search"
                value="txt_evaluation_search"
                style={{ marginTop: 15 }}
                loading={isLoading}
                onClick={handleAdd}
                disabled={dataSources?.data?.length === 0 || selectedRowKeys.length === 0}
              >
                {t('IDS_BUTTON_ADD')}
              </MainButton>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default PopupAddUserSettingEvaluator;
