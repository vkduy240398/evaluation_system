/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import { MainButton } from '../../../common/MainButton';
import { i18n, t } from 'i18next';
import settingEvaluatorApiService from '../../../common/api/settingEvaluator';
import { conditionsSearchSettingEvaluator, listSettingEvaluator } from '../../../model/Conditions';
import SetEvaluationTable from './components/SetEvaluationTable';
import SettingEvaluatorSearchForm from './components/SettingEvaluatorSearchForm';
import { Button, Form, Modal, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import PaginationV2 from '../../../common/PaginationV2';
import PopupAddUserSettingEvaluator from './components/PopupAddUserSettingEvaluator';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import userEvaluationApiService from '../../../common/api/userEvaluation';
interface Props {
  state: any;
  isEvaluationTime: boolean;
  i18n: i18n;
}
const SettingEvaluatorTab: React.FC<any> = (props: Props) => {
  const { state, isEvaluationTime, i18n } = props;
  const [form] = Form.useForm();
  const [isDisplayImportButton, setIsDisplayImportButton] = useState(false);
  const [isOpenPopupAddUser, setOpenPopupAddUser] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [dataSources, setDataSources] = useState<listSettingEvaluator>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [listDepartment, setListDepartment] = useState([]) as any;
  const [listSkills, setListSkill] = useState([]) as any;
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisableNotify, setIsVisibleNotify] = useState(false);
  let [textNotify, setTextNotify] = useState('');
  let [timePeriod, setTimePeriod] = useState('');
  const [conditions, setConditions] = useState<conditionsSearchSettingEvaluator>(
    location.state || {
      offset: 0,
      limit: 20,
      department: t('IDS_ALL'),
      userName: '',
      evaluatorName: '',
      level: t('IDS_ALL'),
      flagSkill: t('IDS_ALL'),
      skill: t('IDS_ALL'),
      current: 1,
      exception: -1,
    },
  );
  const [isOpenPopupConfirmImportUser, setIsOpenPopupConfirmImportUser] = useState<boolean>(false);
  const handleOpenPopupConfirmImportUser = () => setIsOpenPopupConfirmImportUser(!isOpenPopupConfirmImportUser);
  const handleOpen = () => {
    setOpenPopupAddUser(true);
  };

  const errorCallBack = () => {
    setLoading(false);
  };
  const callBack = (data: any) => {
    setListDepartment(data);
  };

  const callBackListSkill = (data: any) => {
    setListSkill(data);
  };
  useEffect(() => {
    setTimePeriod(state.title);
    settingEvaluatorApiService.checkIsFixed(state, setIsFixed);
    settingEvaluatorApiService.checkImportUser(state, setIsDisplayImportButton, errorCallBack);
    userEvaluationApiService.getAllDepartmentEvaluationDefault(
      { year: state.year, periodIndex: state.periodIndex },
      { callBack, errorCallBack },
    );
    settingEvaluatorApiService.getAllSkill({ callBackListSkill, errorCallBack });
  }, []);

  const callBackListSettingEvaluator = async (dataSource: any) => {
    setDataSources(dataSource);
    if (dataSource.data?.length === 0 && location.state.current > 1 && dataSource?.counts > 0) {
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

  const handleImportUser = async () => {
    settingEvaluatorApiService.importUser(
      state,
      callBackListSettingEvaluator,
      setLoading,
      form,
      setConditions,
      conditions,
      handleOpenPopupConfirmImportUser,
    );

    // handleOpenPopupConfirmImportUser();
    setIsDisplayImportButton(false);
  };

  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      state: conditions,
    });
    if (conditions?.isSearch) {
      settingEvaluatorApiService.searchListSettingEvaluator(conditions, callBackListSettingEvaluator, setLoading);
    }
  }, [conditions]);

  const handleOnchange = async () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
    settingEvaluatorApiService.searchListSettingEvaluator(location.state, callBackListSettingEvaluator, setLoading);
  };

  const handleSearchSavePopUp = () => {
    settingEvaluatorApiService.searchListSettingEvaluator(
      {
        ...conditions,
        offset: (location.state.current || conditions.current) * 20 - 20,
        current: location.state.current,
      },
      callBackListSettingEvaluator,
      setLoading,
    );
  };

  return (
    <>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        title={<Typography.Title level={4}>{t('POPUP_DIALOG.TITLE.PROCESS_RESULT')}</Typography.Title>}
        open={isVisableNotify}
        maskClosable={false}
        onCancel={() => setIsVisibleNotify(false)}
        footer={[
          // eslint-disable-next-line react/jsx-key
          <div style={{ textAlign: 'left' }}>
            <Button className="cancel_button" onClick={() => setIsVisibleNotify(false)}>
              {t('IDS_BUTTON_CLOSE')}
            </Button>
          </div>,
        ]}
      >
        <p dangerouslySetInnerHTML={{ __html: textNotify }} />
      </Modal>

      <ModalCustomComponent
        isOpen={isOpenPopupConfirmImportUser}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_IMPORT_USER').replace('{timePeriod}', timePeriod)}
        fnHandleOk={handleImportUser}
        fnHandleCancel={handleOpenPopupConfirmImportUser}
        okText={t('IDS_BUTTON_IMPORT') as string}
        cancelText={t('IDS_BUTTON_CANCEL') as string}
        loading={isLoading}
      />

      <>
        <Typography.Title level={5}>{t('IDS_SETTING_EVALUATOR')}</Typography.Title>
        {isDisplayImportButton ? (
          <MainButton
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            loading={isLoading}
            onClick={handleOpenPopupConfirmImportUser}
          >
            {t('IDS_IMPORT_USER')}
          </MainButton>
        ) : (
          <>
            <MainButton
              type="primary"
              name="Search"
              value="txt_evaluation_search"
              style={{ marginBottom: 20 }}
              loading={isLoading}
              onClick={handleOpen}
              disabled={isFixed}
            >
              {t('IDS_ADD_USER')}
            </MainButton>

            <SettingEvaluatorSearchForm
              form={form}
              conditions={conditions}
              setConditions={setConditions}
              setDataSources={setDataSources}
              isLoading={isLoading}
              listDepartment={listDepartment}
              setSelectedRowKeys={setSelectedRowKeys}
              state={state}
              setSelectedRows={setSelectedRows}
              listSkill={listSkills}
            />
            {conditions?.isSearch && (
              <SetEvaluationTable
                dataState={dataSources?.data}
                isLoading={isLoading}
                handleOnchange={handleOnchange}
                setSelectedRowKeys={setSelectedRowKeys}
                selectedRowKeys={selectedRowKeys}
                setSelectedRows={setSelectedRows}
                selectedRows={selectedRows}
                isFixed={isFixed}
                setTextNotify={setTextNotify}
                setIsVisibleNotify={setIsVisibleNotify}
                state={state}
                conditions={conditions}
                handleSearchSavePopUp={handleSearchSavePopUp}
                isEvaluationTime={isEvaluationTime}
                i18n={i18n}
              />
            )}
            {dataSources?.data && dataSources?.data.length > 0 && conditions?.isSearch && (
              <PaginationV2
                conditions={conditions}
                currents={conditions.current}
                dataSources={dataSources}
                errorCallBack={errorCallBack}
                limit={conditions.limit}
                location={location}
                navigates={navigate}
                setDataSources={setDataSources}
                url={'/api/v1/f5/management-evaluation-history/find-user-setting-evaluator'}
                loading={isLoading}
                setLoading={setLoading}
                setSelectedRowKeys={setSelectedRowKeys}
                setSelectedRows={setSelectedRows}
              />
            )}

            <PopupAddUserSettingEvaluator
              state={state}
              handleOnchange={handleOnchange}
              conditions={conditions}
              isOpenPopupAddUser={isOpenPopupAddUser}
              setOpenPopupAddUser={setOpenPopupAddUser}
            />
          </>
        )}
      </>
    </>
  );
};
export default SettingEvaluatorTab;
