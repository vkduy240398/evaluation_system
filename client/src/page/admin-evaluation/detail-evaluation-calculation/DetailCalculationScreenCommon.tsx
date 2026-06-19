/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Form, Spin, Typography, message } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import notification from 'antd/lib/notification';
import { HttpStatusCode } from 'axios';
import { t } from 'i18next';
import { startTransition, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import evaluationCalculationApiService from '../../../common/api/evaluation-calculation';
import { VersionSettingStatus } from '../../../constant/VersionSettingStatus';
import { VersionSettingType } from '../../../constant/VersionSettingType';
import { ErrorMessageResponseDto } from '../../../model/common/ErrorMessageResponseDto';
import { DetailEvaluationCalculationDto } from '../../../model/evaluation-calculation/DetailEvaluationCalculationModel';
import { PublicEvaluationCalculationDto } from '../../../model/evaluation-calculation/PublicEvaluationCalculationModel';
import { UpdateEvaluationCalculationDto } from '../../../model/evaluation-calculation/UpdateEvaluationCalculationModel';
import { AppDispatch } from '../../../store';
import { setFocusLevelError } from '../../../store/userEvaluation';
import { onValidateSavePublicCommon } from '../../../views/admin-evaluation/detail-evaluation-calculation/components/DetailCalculationCommonHandler';
import DetailFormCommon from '../../../views/admin-evaluation/detail-evaluation-calculation/components/DetailFormCommon';

const DetailCalculationScreenCommon = () => {
  const [dataSource, setDataSource] = useState({} as DetailEvaluationCalculationDto);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingPage, setLoadingPage] = useState(false);
  const [isOpenPublicConfirm, setIsOpenPublicConfirm] = useState(false);
  const [isOpenCancelConfirm, setIsOpenCancelConfirm] = useState(false);
  const [isOpenSavePublicConfirm, setIsOpenSavePublicConfirm] = useState(false);
  const [isSaveDraft, SetIsSaveDraft] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const record = location.state?.record;
  const [currentTab, setCurrentTab] = useState('proSkill');
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);

  const NOTIFICATION_TITLE = t('IDS_NOTIFY');
  const openNotification = (placement: NotificationPlacement, mesage: string) => {
    api.warning({
      message: <Typography.Title level={4}>{NOTIFICATION_TITLE}</Typography.Title>,
      description: mesage,
      placement,
    });
  };

  const getDetailData = (id: number) => {
    evaluationCalculationApiService.getDetailEvaluationCalculationCommon(
      id,
      callbackDetail,
      callBackNotFound,
      setLoading,
    );
  };

  const onEdit = async () => {
    const maxSubVersion = await evaluationCalculationApiService.getMaxSubVerion(
      dataSource.version,
      dataSource.type,
      setLoading,
    );
    const versionDisplay = dataSource.version + '.' + (maxSubVersion + 1).toString();
    const reason = dataSource.status !== VersionSettingStatus.EDITING ? '' : dataSource.reason;
    setDataSource({
      ...dataSource,
      reason,
      versionDisplay: versionDisplay,
      user: null,
      creationUser: undefined,
      updatedTime: '',
      publicDate: '',
      lastUpdatedTime: '',
    });

    form.setFieldsValue({
      reason,
    });

    setIsEdit(true);
  };

  const callBackNotFound = () => {
    navigate('/admin-evaluation/list-evaluation-calculation-history');
  };

  useEffect(() => {
    if (!record) {
      navigate('/admin-evaluation/list-evaluation-calculation-history');
    } else {
      setLoadingPage(true);
      evaluationCalculationApiService.getDetailEvaluationCalculationCommon(
        record?.id,
        callbackDetail,
        callBackNotFound,
        setLoading,
      );
      navigate(location.pathname, {
        replace: true,
        state: {
          record: location.state?.record,
          currentTab: 'proSkill',
        },
      });
    }
    dispatch(setFocusLevelError([]));
  }, []);

  const callbackDetail = async (data: DetailEvaluationCalculationDto) => {
    setDataSource(data);

    await form.setFieldValue('reason', data.reason);
    await setLoadingPage(false);
  };

  const callbackSavePublic = async (data: any) => {
    if (data?.code === 403) {
      if (data.isEvaluationTimePersonal) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_EVALUATION')
            .replace('{0}', data.startEvaluationPersonal)
            .replace('{1}', data.endEvaluationPersonal),
        );
      }
      if (data.isEvaluationTimeDepartment) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_EVALUATION')
            .replace('{0}', data.startEvaluationDepartment)
            .replace('{1}', data.endEvaluationDepartment),
        );
      }

      return;
    }

    if (dataSource.status === 3) {
      startTransition(() => {
        setDataSource({
          ...data,
        });
      });
    } else {
      startTransition(() => {
        setDataSource({
          ...dataSource,
          status: data.status,
          version: data.version,
          subVersion: data.subVersion,
        });
      });
    }
    navigate(location.pathname, {
      replace: true,
      state: {
        record: data,
        currentTab: currentTab,
      },
    });

    setIsOpenSavePublicConfirm(false);
    message.success(t('MESSAGE.COMMON.IDM_SAVE_PUBLIC'));
    setIsEdit(false);
    await getDetailData(data.id);
  };

  const callbackPublic = async (data: any) => {
    if (data?.code === HttpStatusCode.Forbidden) {
      if (data.isEvaluationTimePersonal) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_EVALUATION')
            .replace('{0}', data.startEvaluationPersonal)
            .replace('{1}', data.endEvaluationPersonal),
        );
      }
      if (data.isEvaluationTimeDepartment) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_EVALUATION')
            .replace('{0}', data.startEvaluationDepartment)
            .replace('{1}', data.endEvaluationDepartment),
        );
      }
    } else {
      await getDetailData(dataSource.id);
      message.success(t('MESSAGE.COMMON.IDM_SAVE_PUBLIC'));
    }
  };

  const callbackConflict = () => {
    message.error(t('MESSAGE.COMMON.IDM_UPDATE_DUPLICATE_ERROR'));
  };

  const onPublicVersion = () => {
    setIsOpenPublicConfirm(false);
    const versionDisplay = dataSource.versionDisplay?.split('.')[0];
    const subVersion = dataSource.versionDisplay?.split('.')[1];
    if (subVersion === '0') {
      const payload: PublicEvaluationCalculationDto = {
        versionId: record.id,
        type: VersionSettingType.LEVEL_ALL,
        status: VersionSettingStatus.PUBLIC,
        version: Number(versionDisplay),
        subVersion: 0,
        updatedTime: dataSource.updatedTime,
      };
      evaluationCalculationApiService.publicVersionSettingCommon(payload, callbackPublic, callbackConflict, setLoading);
    } else {
      const payload: PublicEvaluationCalculationDto = {
        versionId: record.id,
        type: VersionSettingType.LEVEL_ALL,
        status: VersionSettingStatus.PUBLIC,
        subVersion: 0,
        updatedTime: dataSource.updatedTime,
      };
      evaluationCalculationApiService.publicVersionSettingCommon(payload, callbackPublic, callbackConflict, setLoading);
    }

    setIsOpenPublicConfirm(false);
  };

  const callBackErrorSavePublic = (data: ErrorMessageResponseDto) => {
    setIsOpenSavePublicConfirm(false);
    if (data) {
      message.error(data.message);
    }
  };

  const callbackSaveDraft = async (data: DetailEvaluationCalculationDto) => {
    navigate(location.pathname, {
      replace: true,
      state: {
        record: data,
        currentTab: currentTab,
      },
    });

    SetIsSaveDraft(true);
    await getDetailData(data.id);

    message.success(t('MESSAGE.COMMON.IDM_SAVE_DRAFT_SUCCESS'));
  };

  const callbackSaveDraftError = async (data: ErrorMessageResponseDto) => {
    message.error(data.message);
  };

  const onSaveDraft = async () => {
    let payload: UpdateEvaluationCalculationDto = {
      ...dataSource,
    };

    if (dataSource.status === VersionSettingStatus.PUBLIC) {
      payload = {
        ...payload,
        status: VersionSettingStatus.EDITING,
      };

      const NEW_CREATE_SAVE_TYPE = 'new';
      evaluationCalculationApiService.saveDraftVersionSettingCommon(
        payload,
        NEW_CREATE_SAVE_TYPE,
        callbackSaveDraft,
        callbackSaveDraftError,
        setLoading,
      );
    }

    const OLD_SAVE_TYPE = 'old';
    if (dataSource.status === VersionSettingStatus.EDITING) {
      evaluationCalculationApiService.saveDraftVersionSettingCommon(
        payload,
        OLD_SAVE_TYPE,
        callbackSaveDraft,
        callbackSaveDraftError,
        setLoading,
      );
    }
  };

  const callbackCancel = async (data: any) => {
    setIsEdit(false);
    setIsOpenCancelConfirm(false);
    startTransition(() => {
      setDataSource({
        ...dataSource,
        status: VersionSettingStatus.CANCEL,
        updatedTime: data.updatedTime,
        user: data.user,
      });
    });

    message.success(t('MESSAGE.COMMON.IDM_SAVE_CANCEL_SUCCESS'));
    await getDetailData(dataSource.id);
  };

  const onSavePublicVersion = () => {
    setIsOpenSavePublicConfirm(false);
    const payload: UpdateEvaluationCalculationDto = {
      ...dataSource,
    };

    evaluationCalculationApiService.savePublicVersionSettingCommon(
      payload,
      callbackSavePublic,
      callBackErrorSavePublic,
      setLoading,
    );
  };

  const onCancelVersion = async () => {
    if (dataSource.status === VersionSettingStatus.EDITING) {
      const payload = { status: VersionSettingStatus.CANCEL, updatedTime: dataSource.updatedTime };

      evaluationCalculationApiService.cancelVersionSettingCommon(dataSource.id, payload, callbackCancel, setLoading);
    } else {
      await getDetailData(dataSource.id);
      setIsEdit(false);
    }

    setIsOpenCancelConfirm(false);
  };

  const onChangeReason = (e: any) => {
    startTransition(() => {
      setDataSource({ ...dataSource, reason: e.target.value });
    });
  };

  const onChangeTabs = (key: string) => {
    setCurrentTab(key);
    navigate(location.pathname, {
      replace: true,
      state: {
        record: record,
        currentTab: key,
      },
    });
  };

  const onValidateTab = (key: string, msg: string) => {
    if (key !== '') {
      setCurrentTab(key);
    }

    openNotification('bottomRight', msg);
    setIsOpenSavePublicConfirm(false);
    setTimeout(() => {
      form.validateFields();
    }, 500);
  };

  const handleValidateSavePublic = async () =>
    await onValidateSavePublicCommon({
      form: form,
      dataSource: dataSource,
      dispatch: dispatch,
      onValidateTab: onValidateTab,
      setFocusLevelError: setFocusLevelError,
      setIsOpenSavePublicConfirm: setIsOpenSavePublicConfirm,
    });

  return (
    <>
      {!isLoadingPage ? (
        <div>
          {contextHolder}

          <DetailFormCommon
            dataSource={dataSource}
            setDataSource={setDataSource}
            form={form}
            isEdit={isEdit}
            onChangeReason={onChangeReason}
            onChangeTabs={onChangeTabs}
            openNotification={openNotification}
            currentTab={currentTab}
            onEdit={onEdit}
            setIsOpenPublicConfirm={setIsOpenPublicConfirm}
            onSaveDraft={onSaveDraft}
            setIsOpenCancelConfirm={setIsOpenCancelConfirm}
            setIsOpenSavePublicConfirm={setIsOpenSavePublicConfirm}
            onValidateSavePublic={handleValidateSavePublic}
            isLoading={isLoading}
            isSaveDraft={isSaveDraft}
          />
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Spin size="large" />
        </div>
      )}

      {/* Popup confirm public */}
      <ModalCustomComponent
        isOpen={isOpenPublicConfirm}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_PUBLIC')}
        fnHandleOk={onPublicVersion}
        okText={t('IDS_PUBLIC') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        fnHandleCancel={() => setIsOpenPublicConfirm(false)}
        loading={isLoading}
      />
      {/* Popup confirm cancel */}
      <ModalCustomComponent
        isOpen={isOpenCancelConfirm}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_CANCEL')}
        fnHandleOk={onCancelVersion}
        okText={t('IDS_BUTTON_CANCELED') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        fnHandleCancel={() => setIsOpenCancelConfirm(false)}
        loading={isLoading}
      />
      {/* Popup confirm save public */}
      <ModalCustomComponent
        isOpen={isOpenSavePublicConfirm}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE_PUBLIC')}
        fnHandleOk={() => onSavePublicVersion()}
        okText={t('POPUP_DIALOG.BUTTON.IDM_CONFIRM_FIXED_EVALUATION_PUBLIC') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        fnHandleCancel={() => setIsOpenSavePublicConfirm(false)}
        loading={isLoading}
      />
    </>
  );
};

export default DetailCalculationScreenCommon;
