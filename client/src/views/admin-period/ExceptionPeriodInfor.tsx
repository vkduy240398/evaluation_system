import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Typography from 'antd/es/typography';
import { i18n, t } from 'i18next';
import { UserPeriodExceptionChildrenType } from '../../types/api/adminPeriodType';
import exceptionUserPeriodChildrenColumn from './column/exceptionUserPeriodChildrenColumn';
import { useState } from 'react';
import evaluationPeriodServices from '../../common/api/evaluationPeriod';
import { setMailContent, setMailTitle } from '../../store/userEvaluation';
import { useDispatch, useSelector } from 'react-redux';
import { ToMailList } from '../../page/admin/period-evaluation/period-evaluation-detail/interfaces/interfacesProps';
import { Grid, message, Modal, Space, Table } from 'antd';
import ExceptionPeriodEvaluationScreen from '../../page/admin-period/exception-period-evaluation';
import SendEmailScreen from '../../page/admin/period-evaluation/period-evaluation-detail/components/sendMail';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
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
  isEvaluationTime?: boolean;
  buttonShowMore?: any;
  i18n: i18n;
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
  isEvaluationTime,
  buttonShowMore,
  i18n,
}: Props) => {
  const [isLoading, setLoading] = useState(false);
  const [isSendMail, setIsSendMail] = useState<number>(3);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [levelType, setLevelType] = useState<number>(5);
  const [emails, setEmail] = useState<{ email: string }[]>([]);
  const dispatch = useDispatch();
  const store = useSelector((state: RootState) => state);
  const [dataMailCCs, setDataMailCCs] = useState<{ id?: number; user: string; evaluators: string[] }[]>([]);
  const { user } = useAuth();
  const [isOpenUndo, setIsOpenUndo] = useState<boolean>(false);

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
  const handleOpenSendMail = async (type: any, levelType: 5 | 6, record: UserPeriodExceptionChildrenType) => {
    setLoading(true);
    await evaluationPeriodServices
      .getToEmailList(processMailResponse, levelType, year.toString(), periodIndex)
      .then(() => setLoading(false));
    setLoading(false);
    setIsSendMail(type);
    setLevelType(levelType);

    if (record) {
      const emails: { email: string }[] = [];
      const evaluation = record;
      if (evaluation.evaluator05Email) emails.push({ email: evaluation.evaluator05Email });
      if (evaluation.evaluator10Email) emails.push({ email: evaluation.evaluator10Email });
      if (evaluation.evaluator20Email) emails.push({ email: evaluation.evaluator20Email });
      if (evaluation.userEmail) emails.push({ email: evaluation.userEmail });
      if (emails.length) setEmail(emails);

      const evaluators = [
        ...(record?.evaluator05Email ? [record.evaluator05Email] : []),
        ...(record?.evaluator10Email ? [record.evaluator10Email] : []),
        ...(record?.evaluator20Email ? [record.evaluator20Email] : []),
      ].filter((email) => email !== undefined);

      const defaultMail = user?.emailHR;
      const finalEvaluators =
        defaultMail && !evaluators.includes(defaultMail) ? [...evaluators, defaultMail] : evaluators;

      const dataMails = [
        {
          id: record?.id,
          user: record?.userEmail,
          evaluators: finalEvaluators,
        },
      ];
      setDataMailCCs(dataMails);
    }
  };
  const processMailResponse = (resData: { toEmailList: ToMailList[]; content: string; title: string }) => {
    dispatch(setMailTitle(resData.title));
    dispatch(setMailContent(resData.content));
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
        {t('IDS_BUTTON_EXCEPTION_SETTING')}
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
          renderTable(data)
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
        <SendEmailScreen
          isOpen={[0, 1].includes(isSendMail)}
          handleClosePopup={() => setIsSendMail(3)}
          type={isSendMail}
          toUserList={emails}
          mailTitle={store.userEvaluation.mailTitle}
          mailContent={store.userEvaluation.mailContent}
          periodInfo={{ id: periodId }}
          levelType={levelType}
          isLoading={isLoading}
          setLoading={setLoading}
          dataMailCCs={dataMailCCs}
          setDataMailCCs={setDataMailCCs}
          i18n={i18n}
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
