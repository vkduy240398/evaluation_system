/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import userApiService from '../../../../common/api/user.api';
import { Button, Col, Form, Input, Modal, Row, Select, Table, Tooltip, Typography, message } from 'antd';
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
  typeUser: any;
  formAdd: any;
}
const PopupAddUserSettingHistoryReference: React.FC<Props> = (props: Props) => {
  //* Props, parameters
  const { state, handleOnchange, conditions, setOpenPopupAddUser, isOpenPopupAddUser, typeUser, formAdd } = props;

  //* React hook
  const [listDivDep, setListDivDep] = useState([]) as any;

  const [isLoading, setLoading] = useState<boolean>(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [selectedRows, setSelectedRows] = useState([]);

  const [dataSources, setDataSources] = useState<any>();

  const [isSearch, setIsSearch] = useState(false);

  const [form] = Form.useForm();

  const [total, setTotal] = useState<number>(20);

  const [currentPage, getPageCurrent] = useState<number>(1);

  const [conditionSearchPopup, setConditionSearchPopup] = useState<{
    department: any;
    nameAndEmail: any;
  }>();

  //* Function
  useEffect(() => {
    form.resetFields();
    setDataSources([]);
    getListDivDep();
  }, [isOpenPopupAddUser === true]);

  const getListDivDep = async () => {
    await httpAxios.Get('/api/v1/common/get-all-department').then((res) => {
      if (res && res.status === 200) {
        const arrays = res?.data.map((v: any) => {
          v.name = `${v.name}`;
          v.value = `${v.id}:${v.name}:${v.type}`;

          return v;
        });
        arrays.unshift({
          // Add default value
          type: -1,
          code: '',
          name: 'すべて',
          value: 'すべて',
        });
        setListDivDep(arrays);
      }
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection: TableRowSelection<any> = {
    columnWidth: '1%',
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (_record: any) => {
      const listViewer = formAdd.getFieldValue('viewer')?.flat();
      const listTargetAudience = formAdd.getFieldValue('targetAudience')?.flat();
      const listMerge = listViewer ? listViewer?.concat(listTargetAudience) : listTargetAudience?.concat(listViewer);
      const uniqueListMerges = [...new Set(listMerge)];
      const userConflicts = uniqueListMerges.filter((item: any) => _record.id === item);

      return {
        disabled: userConflicts.length > 0,
      };
    },
  };
  const callBackListSetting = (dataSource: any) => {
    setTotal(dataSource.counts);
    setDataSources(dataSource);
  };

  const onFinish = async (
    values: {
      department: any;
      nameAndEmail: any;
      limit?: number;
      offset?: number;
    },
    isPagination?: boolean,
  ) => {
    const department = values.department;
    const nameAndEmail = values.nameAndEmail;

    await settingEvaluatorApiService
      .searchListUserToSettingEvaluationHistoryReference({
        ...values,
        department,
        nameAndEmail,
        callBackListSetting,
        setLoading,
        state,
      })
      .then(() => {
        setLoading(false);
        !isPagination && getPageCurrent(1);
        setConditionSearchPopup({ ...values });
        setSelectedRowKeys([]);
        setIsSearch(true);
      });
  };

  const handleSearchPagination = async (arg: { limit?: number; offset?: number }) => {
    if (conditionSearchPopup) await onFinish({ ...conditionSearchPopup, ...arg }, true);
  };

  const handleAdd = async () => {
    if (typeUser === '1') {
      setLoading(true);

      const listViewer = formAdd.getFieldValue('viewer')?.flat();
      const listMerges = selectedRowKeys?.concat(listViewer);
      const uniqueListMerges = [...new Set(listMerges)]?.filter((item) => item);

      const listAdds = await uniqueListMerges.map((item) => [item]);

      formAdd.setFieldValue('viewer', listAdds);
      if (formAdd.getFieldValue('viewer').length !== 0) {
        formAdd.validateFields([`viewer`]);
      } else {
        !formAdd.validateFields([`viewer`]);
      }
      setOpenPopupAddUser(false);
      setLoading(false);
    } else {
      setLoading(true);

      const listTargetAudience = formAdd.getFieldValue('targetAudience')?.flat();
      const listMerges = selectedRowKeys?.concat(listTargetAudience);
      const uniqueListMerges = [...new Set(listMerges)]?.filter((item) => item);

      const listAdds = await uniqueListMerges.map((item) => [item]);

      formAdd.setFieldValue('targetAudience', listAdds);
      if (formAdd.getFieldValue('targetAudience').length !== 0) {
        formAdd.validateFields([`targetAudience`]);
      } else {
        !formAdd.validateFields([`targetAudience`]);
      }
      setOpenPopupAddUser(false);
      setLoading(false);
    }
  };

  //* Component
  const columns = [
    {
      title: t('IDS_FULLNAME'),
      dataIndex: 'name',
      width: '13%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record.employeeNumber + ': ' + record.fullName}</div>;
      },
    },
    {
      title: t('IDS_COMPANY'),
      dataIndex: 'companyName',
      width: '16%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record.company === null ? '' : record.company.name}</div>;
      },
    },
    {
      title: t('IDS_TYPE_DIVISION_NAME'),
      dataIndex: 'divisionName',
      width: '16%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left', maxWidth: 200 }}>{record.division === null ? '' : record.division.name}</div>
        );
      },
    },
    {
      title: t('IDS_TYPE_DEPARTMENT_NAME'),
      dataIndex: 'departmentName',
      width: '16%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <div style={{ textAlign: 'left', maxWidth: 200 }}>
            {record.department === null ? '' : record.department.name}
          </div>
        );
      },
    },
    {
      title: t('IDS_LEVEL'),
      dataIndex: 'level',
      width: '4%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{record.level === null ? '' : record.level}</div>;
      },
    },
    {
      title: t('IDS_EMAIL'),
      dataIndex: 'email',
      width: '18%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record.email ? record.email : ''}</div>;
      },
    },
  ];

  return (
    <div>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        title={
          <Typography.Title level={4}>
            {t('IDS_TITLE_ADD_EDIT_EVALUATION').replace('{user}', typeUser === '1' ? '者' : '対象者')}
          </Typography.Title>
        }
        open={isOpenPopupAddUser}
        footer={null}
        style={{ top: 20 }}
        width="90%"
        maskClosable={false}
        onCancel={() => setOpenPopupAddUser(false)}
      >
        <Form
          name="create_template_form"
          initialValues={{ department: t('IDS_ALL') }}
          colon={false}
          labelCol={{ span: 1 }}
          style={{ width: '100%' }}
          layout="horizontal"
          labelAlign="left"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item label={t('IDS_DEPARTMENT')} name="department" colon={false}>
            <Select
              showSearch
              style={{ width: '200px' }}
              fieldNames={{ label: `name`, value: 'value' }}
              options={listDivDep}
              notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
            ></Select>
          </Form.Item>

          <div style={{ width: '240px' }}>
            <Form.Item
              label={
                <Row>
                  <Col>{t('IDS_USER')}</Col>
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
              <Input maxLength={31} style={{ width: '200px' }} />
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
                className={
                  'ant-custom-table-title hover-table-currsor-pointerant-custom-table hover-table-currsor-pointer'
                }
                locale={{
                  emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                }}
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
export default PopupAddUserSettingHistoryReference;
