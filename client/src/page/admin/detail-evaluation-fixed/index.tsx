import {
  Typography,
  Form,
  Cascader,
  Button,
  Table,
  Affix,
  Row,
  Dropdown,
  MenuProps,
  Col,
  Tooltip,
  message,
} from 'antd';
import { t } from 'i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import EmptyComponent from '../../../common/EmptyComponent';
import { useEffect, useState } from 'react';
import {
  statusEvaluationObj,
  statusEvaluationObj1,
  statusEvaluationObj2,
  statusEvaluationType,
} from '../../../common/status';
import Icon, { CaretUpOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import AdminEvaluationApiService from '../../../common/api/adminEvaluation';
import SendEmailScreen from '../send-email/SendEmailScreen';
import styles from '../../../common/css/stylesTable.module.css';
import { TemplateMailId } from '../send-email/TemplateMailId';

let idsExists: any[] = [];
type TypeSendMail =
  | 'userAndEvaluatorWithoutTime'
  | 'userAndEvaluator'
  | 'evaluatorWithoutTime'
  | 'evaluatorWithoutTimeStatus';
const DetailEvaluationFixed: React.FC<any> = () => {
  const status = [
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
  ];

  const CustomRow = (props: any) => {
    return (
      <>
        {!props.active ? (
          <Tooltip title={t('IDS_EVALUATION_DELETED_USER')}>
            <tr {...props} />
          </Tooltip>
        ) : (
          <>
            <tr {...props} />
          </>
        )}
      </>
    );
  };

  const [searchParams] = useSearchParams();
  const [listStatus, setListStatus] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [counts, setCounts] = useState(status.length === 25 ? 0 : status.length || 0);
  const navigate = useNavigate();
  const location = useLocation();
  const [conditions, setConditions] = useState(
    location.state || {
      stringStatus: Object.keys(statusEvaluationObj1).toString(),
      periodId: searchParams.get('id'),
      page: 1,
    },
  );
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [data, setData] = useState<any>({
    data: [],
    period: {},
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [type, setType] = useState<TypeSendMail>();
  const [selectRows, setSelectRows] = useState<any>();
  const [isAffixed, setIsAffixed] = useState<boolean>();
  const [isChangeTime, setIsChangeTime] = useState<boolean>(false);
  const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [rowData, setRowData] = useState<any>({
    id: [],
    userName: '',
    evaluatorName: '',
    userEmails: [],
    evaluatorEmails: [],
    status: 1,
    evaluationPeriodId: searchParams.get('id'),
    type: searchParams.get('type'),
    userAndEvaluator: [],

    // allEmails: [],
  });

  useEffect(() => {
    const type = searchParams.get('type');
    if (type !== 'fixedGoal' && type !== 'fixedEvaluation' && type !== 'fixedEvaluationConfirm') navigate('/404page');
    setIsloading(true);
    const arrayStatus = [];
    const arrayParents = [];
    for (let index = 0; index < Object.keys(statusEvaluationObj2).length; index++) {
      const status: number = parseInt(Object.keys(statusEvaluationObj2)[index]);
      const i: statusEvaluationType = status as statusEvaluationType;
      if (
        (searchParams.get('type') === 'fixedGoal' && status >= 49) ||
        (searchParams.get('type') === 'fixedEvaluation' && (status < 50 || status >= 98)) ||
        (searchParams.get('type') === 'fixedEvaluationConfirm' && (status < 50 || status >= 99))
      ) {
        continue;
      }
      arrayStatus.push({
        label: statusEvaluationObj2[i],
        value: i,
      });
    }
    arrayParents.push({
      label: t('IDS_ALL'),
      value: t('IDS_ALL'),
      children: arrayStatus,
    });
    form.setFieldsValue(conditions);
    setListStatus(arrayParents);
    AdminEvaluationApiService.getListUserEvaluationPeriod({ ...conditions, type: searchParams.get('type') }, callback);
  }, []);

  const handleClosePopup = () => {
    setIsOpen(false);
    selectRows
      ? setRowData({
          id: selectRows.map((item: any) => item.id),
          userName: Array.from(new Set(selectRows.map((item: any) => item.user.fullName))),
          evaluatorName: Array.from(new Set(selectRows.map((item: any) => item.user.fullName))),
          userEmails: Array.from(new Set(selectRows.map((item: any) => item.user.email))),
          evaluatorEmails:
            type === 'userAndEvaluatorWithoutTime'
              ? selectRows.map((item: any) => item.evaluator.map((item: any) => item.user.email)).flat(1)
              : new Set(selectRows.map((item: any) => item.evaluator.map((item: any) => item.user.email)).flat(1)),
          status: 1,
          evaluationPeriodId: searchParams.get('id'),
          type: searchParams.get('type'),
          userAndEvaluator: selectRows.map((item: any) => {
            return {
              id: item.id,
              user: item.user.email,
              evaluators: item.evaluator.map((item: any) => item.user.email),
            };
          }),
        })
      : setRowData({
          id: [],
          userName: [],
          evaluatorName: [],
          userEmails: [],
          evaluatorEmails: [],
          status: 1,
          evaluationPeriodId: searchParams.get('id'),
          type: searchParams.get('type'),
          userAndEvaluator: [],
        });
  };
  const handleOpenPopup = () => {
    setIsOpen(true);
    setIsOpenDropDown(false);
  };
  const callback = (data: any) => {
    setData(data);
    setSelectedRowKeys([]);
    setSelectRows([]);
    setIsloading(false);
  };

  const handleSearch = async () => {
    setIsloading(true);
    const statusSearchs: any[] = form.getFieldValue('status')
      ? form
          .getFieldValue('status')
          .toString()
          .split(',')
          .filter((v: any) => v !== t('IDS_ALL'))
      : [];
    setConditions({
      ...conditions,
      stringStatus: statusSearchs.length > 0 ? statusSearchs.toString() : Object.keys(statusEvaluationObj).toString(),
      type: searchParams.get('type'),
    });
    navigate(
      location.pathname +
        `?id=${searchParams.get('id')}&type=${searchParams.get('type')}&year=${searchParams.get('year')}`,
      {
        replace: true,
        state: {
          ...conditions,
          status: form.getFieldValue('status'),
          stringStatus:
            statusSearchs.length > 0 ? statusSearchs.toString() : Object.keys(statusEvaluationObj).toString(),
        },
      },
    );
    AdminEvaluationApiService.getListUserEvaluationPeriod(
      {
        ...conditions,
        stringStatus: statusSearchs.length > 0 ? statusSearchs.toString() : Object.keys(statusEvaluationObj).toString(),
        type: searchParams.get('type'),
      },
      callback,
    );
  };
  const columns: any = () => {
    return [
      {
        title: t('IDS_FULLNAME'),
        dataIndex: 'user',
        render: (text: any) => <>{text ? `${text.employeeNumber}: ${text.fullName}` : ''}</>,
        width: '18%',
      },
      {
        title: t('IDS_EVALUATION_PERIOD'),
        dataIndex: 'title',
        width: '15%',
        align: 'center' as const,
        render: (_: any, record: any) => <>{`${record.periodStart} ～ ${record.periodEnd}`}</>,
      },
      {
        title: t('IDS_STATUS'),
        dataIndex: 'stringStatus',
        width: '14%',
      },
      {
        title: t('IDS_EVALUATOR_0_5'),
        dataIndex: 'evaluator',
        width: '15%',
        render: (text: any) => {
          return (
            <>
              {text.find((e: any) => e.evaluationOrder === '0.5')
                ? text.find((e: any) => e.evaluationOrder === '0.5').user?.fullName
                : ''}
            </>
          );
        },
      },
      {
        title: t('IDS_EVALUATOR_1'),
        dataIndex: 'evaluator',
        width: '15%',
        render: (text: any) => {
          return (
            <>
              {text.find((e: any) => e.evaluationOrder === '1.0')
                ? text.find((e: any) => e.evaluationOrder === '1.0').user?.fullName
                : ''}
            </>
          );
        },
      },
      {
        title: t('IDS_EVALUATOR_2'),
        dataIndex: 'evaluator',
        width: '15%',
        render: (text: any) => {
          // return <>{text ? text.find((e: any) => e.evaluationOrder === '2.0').user.fullName : ''}</>;
          return (
            <>
              {text.find((e: any) => e.evaluationOrder === '2.0')
                ? text.find((e: any) => e.evaluationOrder === '2.0').user?.fullName
                : ''}
            </>
          );
        },
      },
    ];
  };

  const rowSelection = {
    selectedRowKeys,
    columnWidth: '3%',
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setIsOpenDropDown(false);
      setIsChangeTime(false);
      setSelectedRowKeys(selectedRowKeys);
      setSelectRows(selectedRows);
      setRowData({
        id: selectedRows.map((item: any) => item.id),
        userName: Array.from(new Set(selectedRows.map((item: any) => item.user.fullName))),
        evaluatorName: Array.from(new Set(selectedRows.map((item: any) => item.user.fullName))),
        userEmails: Array.from(new Set(selectedRows.map((item: any) => item.user.email))),
        evaluatorEmails: new Set(
          selectedRows.map((item: any) => item.evaluator.map((item: any) => item.user.email)).flat(1),
        ),
        status: 1,
        evaluationPeriodId: searchParams.get('id'),
        type: searchParams.get('type'),
        userAndEvaluator: selectedRows.map((item: any) => {
          return {
            id: item.id,
            user: item.user.email,
            evaluators: item.evaluator.map((item: any) => item.user.email),

            // evaluators: item.evaluator[index].user.email
          };
        }),
      });
    },
    getCheckboxProps: (record: any) => {
      if (searchParams.get('type') === 'fixedEvaluationConfirm') {
        return { disabled: true };
      } else {
        if (record.active === 0) return { disabled: true };
      }

      return {};
    },
  };

  const getExistIdsSend = async (type: TemplateMailId) => {
    const idExist = await AdminEvaluationApiService.getExistIdsSend(
      {
        rowData: rowData,
      },
      type,
    );
    idsExists = [...idExist];
  };

  const itemsGoalCreated: MenuProps['items'] | any = [
    {
      key: `userAndEvaluatorWithoutTime`,
      label: t('IDS_TO_USER_EVALUATOR'),
      async onClick() {
        setIsloading(true);
        setIsOpenDropDown(false);
        await getExistIdsSend(
          searchParams.get('type') === 'fixedGoal'
            ? TemplateMailId.GOAL_USER_AND_EVALUATOR_WITHOUT_TIME
            : TemplateMailId.EVALUATION_USER_AND_EVALUATOR_WITHOUT_TIME,
        );

        if (!idsExists || !idsExists.length) {
          message.warning(t('MESSAGE.COMMON.IDM_SELECT_STATUS_INVALID_USER'));
        } else {
          handleOpenPopup();
          setType('userAndEvaluatorWithoutTime');
        }
        setIsloading(false);

        setIsOpenDropDown(false);
      },
    },
    {
      key: `evaluator_status`,
      label: t('IDS_TO_EVALUATOR_STATUS'),
      async onClick() {
        setIsloading(true);
        setIsOpenDropDown(false);
        await getExistIdsSend(
          searchParams.get('type') === 'fixedGoal'
            ? TemplateMailId.GOAL_EVALUATOR_WITHOUT_TIME_STATUS
            : TemplateMailId.EVALUATION_EVALUATOR_WITHOUT_TIME_STATUS,
        );
        if (!idsExists || !idsExists.length) {
          message.warning(t('MESSAGE.COMMON.IDM_SELECT_STATUS_INVALID_EVALUATOR'));
        } else {
          setRowData({
            ...rowData,
            evaluatorEmails: new Set(
              selectRows
                .filter((item: any) => {
                  return idsExists.includes(item.id);
                })
                .map((item: any) => {
                  return {
                    ...item,
                    evaluator: item.evaluator.filter((evaluator: any) => {
                      if ([3, 4, 53, 54, 55].includes(item.status) && evaluator.evaluationOrder === '0.5') {
                        return true;
                      } else if ([5, 6, 56, 57, 58].includes(item.status) && evaluator.evaluationOrder === '1.0') {
                        return true;
                      } else if ([7, 8, 59, 60, 61].includes(item.status) && evaluator.evaluationOrder === '2.0') {
                        return true;
                      } else {
                        return false;
                      }
                    }),
                  };
                })
                .map((item: any) => item.evaluator.map((item: any) => item.user.email))
                .flat(1),
            ),
          });
          handleOpenPopup();
          setType('evaluatorWithoutTimeStatus');
        }

        setIsloading(false);
      },
    },
    {
      key: `evaluator`,
      label: t('IDS_TO_EVALUATOR'),
      async onClick() {
        setIsloading(true);
        setIsOpenDropDown(false);
        await getExistIdsSend(
          searchParams.get('type') === 'fixedGoal'
            ? TemplateMailId.GOAL_EVALUATOR_WITHOUT_TIME
            : TemplateMailId.EVALUATION_EVALUATOR_WITHOUT_TIME,
        );
        if (!idsExists || !idsExists.length) {
          message.warning(t('MESSAGE.COMMON.IDM_SELECT_STATUS_INVALID_EVALUATOR'));
        } else {
          setRowData({
            ...rowData,
            evaluatorEmails: new Set(
              selectRows
                .filter((item: any) => {
                  return idsExists.includes(item.id);
                })
                .map((item: any) => item.evaluator.map((item: any) => item.user.email))
                .flat(1),
            ),
          });
          handleOpenPopup();
          setType('evaluatorWithoutTime');
        }

        setIsloading(false);
      },
    },
  ];
  const handleSendMailWithTime = () => {
    setRowData({
      id: data.data.filter((item: any) => item.active !== 0).map((item: any) => item.id),
      userName: Array.from(
        new Set(data.data.filter((item: any) => item.active !== 0).map((item: any) => item.user.fullName)),
      ),
      evaluatorName: Array.from(
        new Set(data.data.filter((item: any) => item.active !== 0).map((item: any) => item.user.fullName)),
      ),
      userEmails: Array.from(
        new Set(data.data.filter((item: any) => item.active !== 0).map((item: any) => item.user.email)),
      ),
      evaluatorEmails: new Set(
        data.data
          .filter((item: any) => item.active !== 0)
          .map((item: any) => item.evaluator.map((item: any) => item.user.email))
          .flat(1),
      ),
      status: 1,
      evaluationPeriodId: searchParams.get('id'),
      type: searchParams.get('type'),
    });
    setType('userAndEvaluator');
    setIsChangeTime(true);
    handleOpenPopup();
  };

  return (
    <>
      <Typography.Title level={3}>
        {searchParams.get('type') === 'fixedGoal'
          ? t('IDS_LIST_FIX_GOAL')
          : searchParams.get('type') === 'fixedEvaluation'
          ? t('IDS_LIST_FIX_EVALUATION')
          : t('IDS_LIST_PUBLIC_EVALUATION')}
      </Typography.Title>
      <Form
        name="search_form"
        labelCol={{ span: 1 }}
        labelAlign="left"
        style={{ width: '100%' }}
        layout="horizontal"
        colon={false}
        form={form}
        onFinish={handleSearch}
      >
        <Form.Item label={t('IDS_EVALUATION_PERIOD')} colon={false} name={'period'}>
          {searchParams.get('year')}
        </Form.Item>
        <Form.Item label={t('IDS_STATUS')} colon={false} name={'status'} initialValue={[t('IDS_ALL').toString()]}>
          <Cascader
            className="Cascader"
            showSearch
            style={{ width: counts >= 2 ? '66%' : 200 }}
            onChange={(e) => {
              setCounts(e.length);
            }}
            size="small"
            options={listStatus}
            multiple
            allowClear={false}
            maxTagTextLength={150}
            notFoundContent={(<EmptyComponent />) as unknown as React.ReactNode}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            name="Search"
            value="txt_evaluation_search"
            loading={isLoading}
            className="main_button"
            icon={<SearchOutlined />}
            style={{ marginTop: 10, marginBottom: 15 }}
          >
            {t('IDS_BUTTON_SEARCH')}
          </Button>
        </Form.Item>
      </Form>
      <Table
        bordered
        size="small"
        components={{
          body: {
            row: CustomRow,
          },
        }}
        scroll={{ x: 900 }}
        rowSelection={{
          ...rowSelection,
        }}
        pagination={false}
        rowClassName={(_record: any) => {
          return _record.active ? '' : styles.inActiveUser;
        }}
        loading={isLoading}
        locale={{ emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA') }}
        columns={columns(searchParams.get('type'))}
        dataSource={data.data}
        rowKey={(record: any) => record.id}
        onRow={(record: any, _onExpand) => record}
      />
      {searchParams.get('type') === 'fixedEvaluationConfirm' ? (
        <></>
      ) : (
        <Affix
          offsetBottom={0}
          style={{ paddingBottom: 10 }}
          onChange={(affixed) => {
            setIsAffixed(affixed);
          }}
        >
          <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
            <Row>
              <Col style={{ display: 'flex', justifyContent: 'center' }}>
                <Dropdown
                  trigger={['click']}
                  menu={{ items: itemsGoalCreated }}
                  placement="topLeft"
                  disabled={selectedRowKeys.length > 0 ? false : true}
                  open={isOpenDropDown}
                  onOpenChange={() => setIsOpenDropDown(!isOpenDropDown)}
                >
                  <Button
                    style={{ margin: 10 }}
                    loading={isLoading}
                    className="button-normal"
                    type="primary"
                    size="middle"
                    onClick={() => setIsChangeTime(false)}
                  >
                    {t('IDS_BUTTON_SEND_MAIL_WITHOUT_SETTING_TIME')}
                    <CaretUpOutlined />
                  </Button>
                </Dropdown>
                <Tooltip
                  title={t('IDS_TOOLTIP_SEND_MAIL_WITHOUT_SETTING_TIME_EXPLAINATION')}
                  color="#424242"
                  overlayInnerStyle={{ fontSize: '11px' }}
                >
                  <Icon
                    component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                    style={{ color: '#6e5b14', fontSize: 18, marginTop: 2, cursor: 'default' }}
                  />
                </Tooltip>
              </Col>
              {/* <Dropdown trigger={['click']} menu={{ items: itemsGoalCreated }} placement="topLeft"> */}
              <Col style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  style={{ margin: 10 }}
                  loading={isLoading}
                  className="button-normal"
                  type="primary"
                  size="middle"
                  onClick={handleSendMailWithTime}
                >
                  {t('IDS_BUTTON_SEND_MAIL_WITH_SETTING_TIME')}
                  {/* <CaretUpOutlined style={{ fontSize: 18 }} /> */}
                </Button>

                <Tooltip
                  title={t('IDS_TOOLTIP_SEND_MAIL_WITH_SETTING_TIME_EXPLAINATION')}
                  color="#424242"
                  overlayInnerStyle={{ fontSize: '11px' }}
                >
                  <Icon
                    component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                    style={{ color: '#6e5b14', fontSize: 18, marginTop: 2, cursor: 'default' }}
                  />
                </Tooltip>
              </Col>
              {/* </Dropdown> */}
            </Row>
          </div>
        </Affix>
      )}

      <SendEmailScreen
        handleSearch={handleSearch}
        isOpen={isOpen}
        handleClosePopup={handleClosePopup}
        rowData={
          type === 'userAndEvaluator'
            ? rowData
            : {
                ...rowData,
                id: rowData.id.filter((id: number) => idsExists.includes(id)),
                userAndEvaluator: rowData.userAndEvaluator?.filter(
                  (item: any) => idsExists && idsExists.includes(item.id),
                ),
              }
        }
        type={type}
        isChangeTime={isChangeTime}
        period={data.period}
        setSelectRows={setSelectedRowKeys}
      />
    </>
  );
};
export default DetailEvaluationFixed;
