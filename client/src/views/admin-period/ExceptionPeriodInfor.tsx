import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Typography from 'antd/es/typography';
import { i18n, t } from 'i18next';
import { UserPeriodExceptionChildrenType } from '../../types/api/adminPeriodType';
import exceptionUserPeriodChildrenColumn from './column/exceptionUserPeriodChildrenColumn';
import { useState, useEffect } from 'react';
import { Grid, message, Modal, Space, Table } from 'antd';
import ExceptionPeriodEvaluationScreen from '../../page/admin-period/exception-period-evaluation';
import SendMailForTarget from '../../page/admin-evaluation/evaluationn-period-management/evaluation-period-detail/SendMailForTarget';
import { MainButton, CancelButton } from '../../common/MainButton';
import httpAxios from '../../common/http';

// ** Type
interface Props {
  userInfo: any | undefined;
  isLoading: boolean;
  year: number;
  periodIndex: number;
  data: any;
  periodId: number;
  isEdit: boolean;
  setIsEdit: any;
  handleCancelPopUp: any;
  handleSearchSavePopUp: any;
  handleClosePopUp: any;
  isFixed: any;
  title?: string;
  isEvaluationTime?: boolean;
  buttonShowMore?: any;
  i18n: i18n;
  evaluatorDefaultEmails?: {
    evaluator05Email?: string;
    evaluator10Email?: string;
    evaluator20Email?: string;
  };
}

const { Item } = Form;

const ExceptionPeriodInfor = ({
  userInfo,
  year,
  periodIndex,
  data,
  periodId,
  isEdit,
  setIsEdit,
  handleCancelPopUp,
  handleSearchSavePopUp,
  handleClosePopUp,
  isFixed,
  title,
  isEvaluationTime,
  buttonShowMore,
  i18n,
  evaluatorDefaultEmails,
}: Props) => {
  const [isLoading, setLoading] = useState(false);
  const [isSendMail, setIsSendMail] = useState<number>(3);
  const [viewData, setViewData] = useState<any[]>([]);

  useEffect(() => {
    if (!isEdit && userInfo?.id) {
      httpAxios
        .Get(
          `/api/v1/f5/management-evaluation-history/exception/get-evaluation-by-period?userId=${userInfo.id}&year=${year}&periodIndex=${periodIndex}`,
        )
        .then((res: any) => {
          if (res?.status === 200 && res.data?.evaluations) {
            const periodInfo = res.data?.period || null;
            const evaluationsWithMeta = (res.data.evaluations as any[]).map((e: any) => ({
              ...e,
              userId: e.userId ?? userInfo?.id,
              userEmail: userInfo?.email || '',
              timeCommon: periodInfo,
            }));
            setViewData(evaluationsWithMeta);
          }
        });
    }
  }, [userInfo?.id, isEdit]);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [levelType, setLevelType] = useState<number>(27);
  const [currentMailRecord, setCurrentMailRecord] = useState<UserPeriodExceptionChildrenType | null>(null);
  const [isOpenUndo, setIsOpenUndo] = useState<boolean>(false);
  const [userLevel, setUserLevel] = useState<number>(0);
  const [userDepartmentName, setUserDepartmentName] = useState<string>('');
  const [recordGoalDates, setRecordGoalDates] = useState<{ start?: string; end?: string } | null>(null);
  const [recordEvalDates, setRecordEvalDates] = useState<{ start?: string; end?: string } | null>(null);

  const [dataUndo, setDataUndo] = useState();

  const renderTable = (dataEvaluations: UserPeriodExceptionChildrenType[]) => (
    <Table
      columns={exceptionUserPeriodChildrenColumn({
        handleOpenSendMail,
        isFixed,
        buttonShowMore,
        dataEvaluations,
        setIsOpenUndo,
        setDataUndo,
        isEvaluationTime,
      })}
      dataSource={dataEvaluations}
      style={{ wordBreak: 'break-word', verticalAlign: 'top' }}
      // rowClassName={(r) => (r.isEdit ? '' : styles.inActiveUser)}

      // scroll={{ x: screens.xs || screens.sm ? 900 : undefined }}
      bordered
      pagination={false}
      scroll={
        // eslint-disable-next-line no-constant-condition
        { x: screens.sm || screens.xs ? 2000 : undefined }
          ? { x: screens.sm || screens.xs ? 2000 : undefined }
          : { x: { x: screens.sm || screens.xs ? 2000 : undefined } || screens.xs ? 900 : undefined }
      }
    />
  );
  const handleOpenSendMail = (type: 0 | 1, lType: number, record: UserPeriodExceptionChildrenType) => {
    setLevelType(lType);
    setUserLevel((record as any).level ?? 0);
    setUserDepartmentName((record as any).divisionName || (record as any).departmentName || '');
    setRecordGoalDates({
      start: (record as any).dateCreationGoalStart,
      end: (record as any).dateCreationGoalEnd,
    });
    setRecordEvalDates({
      start: (record as any).dateEvaluationStart,
      end: (record as any).dateEvaluationEnd,
    });
    const mergedRecord: UserPeriodExceptionChildrenType = {
      ...record,
      userEmail: record.userEmail || userInfo?.email || '',
      evaluator05Email: record.evaluator05Email || evaluatorDefaultEmails?.evaluator05Email || '',
      evaluator10Email: record.evaluator10Email || evaluatorDefaultEmails?.evaluator10Email || '',
      evaluator20Email: record.evaluator20Email || evaluatorDefaultEmails?.evaluator20Email || '',
    };
    setCurrentMailRecord(mergedRecord);
    setIsSendMail(type);
  };

  const renderPopupUndo = () => {
    return (
      <>
        <div>{t('IDS_UNDO_EXCEPTION_CONFIRM')}</div>
      </>
    );
  };

  const handleSubmitUndo = async () => {
    setLoading(true);
    await httpAxios.Put('/api/v1/f5/management-evaluation-history/undo-exception', dataUndo).then((res) => {
      if (res && res.status === 200) {
        message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS'));
        setIsOpenUndo(false);
        handleClosePopUp();
        handleSearchSavePopUp();
      }
    });
    setLoading(false);
    setIsOpenUndo(false);
    handleClosePopUp();
  };

  return (
    // <Card style={{ marginBottom: 15 }}>
    <>
      <Typography.Title level={3} style={{ paddingBottom: 10 }}>
        {title ?? t('IDS_BUTTON_EXCEPTION_SETTING')}
      </Typography.Title>

      <Form
        labelAlign="left"
        colon={false}
        requiredMark={false}
        labelCol={{ span: 1 }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 12 } }}
      >
        <Item label={t('IDS_EVALUATION_PERIOD')} className="ant-form-item-info">{`${year}年${
          periodIndex === 2 ? t('IDS_SECOND_PERIOD') : t('IDS_FIRST_PERIOD')
        }`}</Item>
        {/* {userInfo ? ( */}
        <>
          <Item label={t('IDS_FULLNAME')} className="ant-form-item-info">
            {userInfo?.fullName}
          </Item>
          <Item label={t('IDS_COMPANY')} className="ant-form-item-info">
            {userInfo?.company}
          </Item>
          <Item label={t('IDS_DEPARTMENT')} className="ant-form-item-info">
            {userInfo?.department}
          </Item>
        </>

        {!isEdit ? (
          renderTable(viewData.length > 0 ? viewData : data)
        ) : (
          <ExceptionPeriodEvaluationScreen
            userInfo={userInfo}
            handleCancelPopUp={handleCancelPopUp}
            handleSearchSavePopUp={handleSearchSavePopUp}
            handleClosePopUp={handleClosePopUp}
            isEvaluationTime={isEvaluationTime}
            buttonShowMore={buttonShowMore}
          />
        )}
        {!isEdit && (
          <Item>
            <Button
              className="button-normal"
              type="primary"
              size="middle"
              loading={isLoading}
              style={{ marginTop: 10, marginRight: 10 }}
              onClick={() => setIsEdit(true)}
              disabled={isFixed}
            >
              {t('IDS_EDIT')}
            </Button>
            <Button type="default" className="cancel_button" onClick={handleCancelPopUp}>
              {t('IDS_BUTTON_CANCEL')}
            </Button>
          </Item>
        )}
        <SendMailForTarget
          isModalOpen={[0, 1].includes(isSendMail)}
          setIsModalOpen={(v) => {
            if (!v) setIsSendMail(3);
          }}
          isScheduled={isSendMail === 1}
          levelType={levelType}
          routeYear={year}
          routePeriodIndex={periodIndex}
          periodId={periodId}
          userEmail={currentMailRecord?.userEmail}
          evaluatorEmails={{
            evaluator05Email: currentMailRecord?.evaluator05Email,
            evaluator10Email: currentMailRecord?.evaluator10Email,
            evaluator20Email: currentMailRecord?.evaluator20Email,
          }}
          userLevel={userLevel}
          userDepartmentName={userDepartmentName}
          recordGoalDates={recordGoalDates}
          recordEvalDates={recordEvalDates}
        />
      </Form>

      <Modal
        title={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.CONFIRM')}</Typography.Title>}
        open={isOpenUndo}
        // closable={false}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={() => {
          setIsOpenUndo(false);
        }}
        centered
        footer={[
          <div style={{ textAlign: 'left' }} key={'Modal-open-key-1'}>
            <Space
              size={'middle'}
              style={{
                marginTop: 10,
              }}
            >
              <MainButton
                type="primary"
                name="Search"
                value="txt_evaluation_search"
                onClick={handleSubmitUndo}
                loading={isLoading}
              >
                {t('IDS_UNDO_EXCEPTION')}
              </MainButton>
              <CancelButton
                form="form"
                onClick={() => {
                  setIsOpenUndo(false);
                }}
              >
                {t('IDS_BUTTON_CANCEL')}
              </CancelButton>
            </Space>
          </div>,
        ]}
      >
        {renderPopupUndo()}
      </Modal>
    </>

    // </Card>
  );
};

export default ExceptionPeriodInfor;
