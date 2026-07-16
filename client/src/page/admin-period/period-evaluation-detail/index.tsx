import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPeriodApiService from '../../../common/api/adminPeriod';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
import Table, { ColumnsType } from 'antd/es/table';
import Button from 'antd/es/button';
import exceptionUserPeriodChildrenColumn from '../../../views/admin-period/column/exceptionUserPeriodChildrenColumn';
import { Grid } from 'antd';
import { UserPeriodExceptionChildrenType, UserPeriodExceptionType } from '../../../types/api/adminPeriodType';
import { ExceptionPeriodType } from '../../../types/pages/exception-period/ExceptionPeriodType';
import { i18n, t } from 'i18next';

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { setMailContent, setMailTitle } from '../../../store/userEvaluation';
import evaluationPeriodServices from '../../../common/api/evaluationPeriod';
import SendEmailScreen from '../../admin/period-evaluation/period-evaluation-detail/components/sendMail';
import { ToMailList } from '../../admin/period-evaluation/period-evaluation-detail/interfaces/interfacesProps';
import { FormOutlined } from '@ant-design/icons';

// ** Styles
import styles from '../../../common/css/stylesTable.module.css';
import Tooltip from 'antd/lib/tooltip';
import { urlCompanyCode } from '../../../common/util';

interface Props {
  state: {
    year: number;
    periodIndex: number;
    title: string;
    goals810Time?: string;
    goals17Time?: string;
    divisionEvaluate?: string;
    personalEvaluation?: string;
    dateCreationGoalStart?: string;
    dateCreationGoalEnd?: string;
    dateCreationGoalDepartmentStart?: string;
    dateCreationGoalDepartmentEnd?: string;
    dateEvaluationDepartmentEnd?: string;
    dateEvaluationDepartmentStart?: string;
    dateEvaluationEnd?: string;
    dateEvaluationStart?: string;
    checkFixed?: number;
    periodId: number;
  };
  i18n: i18n;
}
const { useBreakpoint } = Grid;

const ExceptionPeriodTable: React.FC<any> = (props: Props) => {
  // ** State
  const [dataSources, setDataSource] = useState<UserPeriodExceptionType[]>([]);

  const [isLoading, setLoading] = useState(false);

  const [, setTotal] = useState<number>(20);

  const [, getPageCurrent] = useState<number>(1);

  const [isDisable, setDisable] = useState<boolean>(false);

  const [isSendMail, setIsSendMail] = useState<number>(3);

  const [levelType, setLevelType] = useState<number>(5);

  const [emails, setEmail] = useState<{ email: string }[]>([]);

  // ** Hook
  const screens = useBreakpoint();

  const navigate = useNavigate();

  const { year, periodIndex } = props.state;

  // ** Redux
  const dispatch = useDispatch<AppDispatch>();

  const store = useSelector((state: RootState) => state);

  useEffect(() => {
    handleSearch({ limit: 20, offset: 0 });
  }, []);

  useMemo(() => {
    const checkFixed = props.state?.checkFixed;
    if (checkFixed && checkFixed === 2) setDisable(true);

    return () => {
      setDisable(false);
    };
  }, [
    props.state.dateCreationGoalStart,
    props.state.dateCreationGoalEnd,
    props.state.dateCreationGoalDepartmentStart,
    props.state.dateCreationGoalDepartmentEnd,
    props.state.dateEvaluationStart,
    props.state.dateEvaluationEnd,
    props.state.dateEvaluationDepartmentStart,
    props.state.dateEvaluationDepartmentEnd,
  ]);

  // ** Functional

  const handleSearch = (props: { limit?: number; offset?: number }) => {
    setLoading(true);
    AdminPeriodApiService.getUserPeriodException({
      year,
      periodIndex,
      callback,
      ...props,
    }).then(() => {
      getPageCurrent;
    });
  };

  const callback = (data: { dataList: UserPeriodExceptionType[]; count: number }) => {
    setDataSource(data.dataList);
    setTotal(data.count);
    setLoading(false);
  };
  const handleMoveDetail = (record: UserPeriodExceptionType) => {
    const userInfor: ExceptionPeriodType = {
      id: record.userId,
      key: 'user-key',
      fullName: record.fullName,
      companyName: record.companyName2,
      departmentName: record.departmentName,
      email: record.email,
    };
    navigate(urlCompanyCode() + '/admin-evaluation/exception-period-evaluation', {
      // replace: true,
      state: { ...props.state, userId: record.userId, userInfor },
    });
  };

  const renderTable = (record: UserPeriodExceptionChildrenType[]) => (
    <TableCustomComponent
      columns={exceptionUserPeriodChildrenColumn({ handleOpenSendMail })}
      dataSources={record}
      style={{ wordBreak: 'break-word', verticalAlign: 'top' }}
      rowClassName={(r) => (r.isEdit ? '' : styles.inActiveUser)}
    />
  );
  const handleOpenSendMail = async (type: any, levelType: 5 | 6, record: UserPeriodExceptionChildrenType) => {
    setLoading(true);
    await evaluationPeriodServices
      .getToEmailList(processMailResponse, levelType, year.toString(), periodIndex)
      .then(() => setLoading(false));
    setLoading(false);
    setIsSendMail(type || 3);
    setLevelType(levelType);

    if (record) {
      const emails: { email: string }[] = [];
      const evaluation = record;
      if (evaluation.evaluator05Email) emails.push({ email: evaluation.evaluator05Email });
      if (evaluation.evaluator10Email) emails.push({ email: evaluation.evaluator10Email });
      if (evaluation.evaluator20Email) emails.push({ email: evaluation.evaluator20Email });
      if (evaluation.userEmail) emails.push({ email: evaluation.userEmail });
      if (emails.length) setEmail(emails);
    }
  };

  const processMailResponse = (resData: { toEmailList: ToMailList[]; content: string; title: string }) => {
    dispatch(setMailTitle(resData.title));
    dispatch(setMailContent(resData.content));
  };

  const columns: ColumnsType<any> = [
    {
      title: ' ',
      dataIndex: 'action',
      key: 'action',
      align: 'center' as const,

      width: '5%',
      render(_, record) {
        if (record.isColSpan)
          return (
            <Button
              disabled={!record.isEdit || isDisable}
              icon={<FormOutlined />}
              style={{ color: '#007240' }}
              onClick={() => handleMoveDetail && handleMoveDetail(record)}
            />
          );

        return '';
      },
      onCell() {
        return { style: { padding: '0px !important' } };
      },
    },
    {
      title: t('IDS_COMPANY'),
      dataIndex: 'companyName',
      key: 'companyName',
      width: 150,
      align: 'left',
    },
  ];

  const CustomRow = (props: any) => {
    return (
      <>
        {props?.children[0] && props?.children[0].props?.record?.isEdit === false ? (
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

  return (
    <div>
      <Button
        type="primary"
        style={{
          marginBottom: '15px',
        }}
        disabled={isDisable}
        loading={isLoading}
        onClick={() =>
          navigate(urlCompanyCode() + '/admin-evaluation/exception-period-evaluation', { state: { ...props.state } })
        }
      >
        {t('IDS_BUTTON_ADD')}
      </Button>
      <Table
        dataSource={dataSources}
        components={{
          body: { row: CustomRow },
        }}
        columns={columns}
        loading={isLoading}
        bordered
        size="small"
        pagination={{
          position: ['bottomLeft'],
          pageSize: 20,
          total: dataSources.length,
          showTotal: (total, range) => `${total}${t('IDS_CASE_LABEL')}${range[0]}-${range[1]}${t('IDS_ITEM_LABEL')}`,
          size: 'default',
        }}
        scroll={{ x: screens.sm || screens.md || screens.xs || screens.lg ? 1500 : undefined }}
        expandable={{
          columnWidth: '1%',

          indentSize: 2,
          expandedRowRender: (record) => renderTable(record.childrens),
        }}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
        rowClassName={(r) => (r.isEdit ? '' : styles.inActiveUser)}
      />

      <SendEmailScreen
        isOpen={['0', 1].includes(isSendMail)}
        handleClosePopup={() => setIsSendMail(3)}
        type={isSendMail}
        toUserList={emails}
        mailTitle={store.userEvaluation.mailTitle}
        mailContent={store.userEvaluation.mailContent}
        periodInfo={{ id: props.state.periodId }}
        levelType={levelType}
        isLoading={isLoading}
        setLoading={setLoading}
        i18n={props.i18n}
      />
    </div>
  );
};

export default ExceptionPeriodTable;
