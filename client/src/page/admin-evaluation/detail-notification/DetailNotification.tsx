/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Form, Spin, message } from 'antd';
import { startTransition, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import ModalCustomComponent from '../../../@core/components/modal-custom';
import notification from 'antd/lib/notification';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { ErrorMessageResponseDto } from '../../../model/common/ErrorMessageResponseDto';
import { setFocusLevelError } from '../../../store/userEvaluation';
import { HttpStatusCode } from 'axios';
import notificationApiService from '../../../common/api/version-notification';
import { DetailNotificationModel } from '../../../model/version-notification/DetailNotificationModel';
import { UpdateNotificationModel } from '../../../model/version-notification/UpdateNotificationModel';
import { VersionNotificationStatus } from '../../../constant/VersionNotificationStatus';
import DetailForm from '../../../views/admin-evaluation/detail-notification/DetailForm';
import { onValidateSavePublic } from '../../../views/admin-evaluation/detail-notification/DetailNotificationHandler';
import { PublicNotificationModel } from '../../../model/version-notification/PublicNotificationModel';
import { urlCompanyCode } from '../../../common/util';

const DetailNotification = () => {
  const [dataSource, setDataSource] = useState({} as DetailNotificationModel);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingPage, setLoadingPage] = useState(false);
  const [isOpenPublicConfirm, setIsOpenPublicConfirm] = useState(false);
  const [isOpenCancelConfirm, setIsOpenCancelConfirm] = useState(false);
  const [isOpenSavePublicConfirm, setIsOpenSavePublicConfirm] = useState(false);
  const [isSaveDraft, SetIsSaveDraft] = useState(false);
  const [contentLength, setContentLength] = useState<number>(-1);
  const dispatch = useDispatch<AppDispatch>();

  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const record = location.state?.record;
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);

  const getDetailData = (id: number) => {
    notificationApiService.getDetailNotification(id, callbackDetail, callBackNotFound, setLoading);
  };

  const onEdit = async () => {
    const maxSubVersion = await notificationApiService.getMaxSubVerion(dataSource.version, setLoading);
    const versionDisplay = dataSource.version + '.' + (maxSubVersion + 1).toString();
    const reason = dataSource.status !== VersionNotificationStatus.EDITING ? '' : dataSource.reason;

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

  useEffect(() => {
    if (!record) {
      navigate(urlCompanyCode() + '/admin-evaluation/list-version-notification');
    } else {
      setLoadingPage(true);
      notificationApiService.getDetailNotification(record?.id, callbackDetail, callBackNotFound, setLoading);
      navigate(location.pathname, {
        replace: true,
        state: {
          record: location.state?.record,
        },
      });
    }
  }, []);

  const callbackDetail = async (data: DetailNotificationModel) => {
    setDataSource(data);

    await form.setFieldValue('reason', data.reason);
    await setLoadingPage(false);
  };

  const callBackNotFound = () => {
    navigate(urlCompanyCode() + '/admin-evaluation/list-version-notification');
  };

  const onPublicVersion = () => {
    setIsOpenPublicConfirm(false);
    const versionDisplay = dataSource.versionDisplay?.split('.')[0];
    const subVersion = dataSource.versionDisplay?.split('.')[1];
    if (subVersion === '0') {
      const payload: PublicNotificationModel = {
        versionId: record.id,
        status: VersionNotificationStatus.PUBLIC,
        version: Number(versionDisplay),
        subVersion: 0,
        updatedTime: dataSource.updatedTime,
      };
      notificationApiService.publicVersionNotification(payload, callbackPublic, callbackConflict, setLoading);
    } else {
      const payload: PublicNotificationModel = {
        versionId: record.id,
        status: VersionNotificationStatus.PUBLIC,
        subVersion: 0,
        updatedTime: dataSource.updatedTime,
      };
      notificationApiService.publicVersionNotification(payload, callbackPublic, callbackConflict, setLoading);
    }

    setIsOpenPublicConfirm(false);
  };

  const callbackPublic = async (data: any) => {
    if (data?.code === HttpStatusCode.Forbidden) {
      if (data.startGoal && data.endGoal) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_GOAL_SETTING')
            .replace('{0}', data.startGoal)
            .replace('{1}', data.endGoal),
        );
      }
      if (data.startEvaluation && data.endEvaluation) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_EVALUATION')
            .replace('{0}', data.startEvaluation)
            .replace('{1}', data.endEvaluation),
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

  const callBackErrorSavePublic = (data: ErrorMessageResponseDto) => {
    setIsOpenSavePublicConfirm(false);
    if (data) {
      message.error(data.message);
    }
  };

  const onSaveDraft = async () => {
    let payload: UpdateNotificationModel = {
      ...dataSource,
    };

    if (dataSource.status === VersionNotificationStatus.PUBLIC) {
      payload = {
        ...payload,
        status: VersionNotificationStatus.EDITING,
      };

      const NEW_CREATE_SAVE_TYPE = 'new';
      notificationApiService.saveDraftVersionNotification(
        payload,
        NEW_CREATE_SAVE_TYPE,
        callbackSaveDraft,
        callbackSaveDraftError,
        setLoading,
      );
    }

    const OLD_SAVE_TYPE = 'old';
    if (dataSource.status === VersionNotificationStatus.EDITING) {
      notificationApiService.saveDraftVersionNotification(
        payload,
        OLD_SAVE_TYPE,
        callbackSaveDraft,
        callbackSaveDraftError,
        setLoading,
      );
    }
  };

  const callbackSaveDraft = async (data: DetailNotificationModel) => {
    navigate(location.pathname, {
      replace: true,
      state: {
        record: data,
      },
    });

    SetIsSaveDraft(true);
    await getDetailData(data.id);
    setContentLength(-1);

    message.success(t('MESSAGE.COMMON.IDM_SAVE_DRAFT_SUCCESS'));
  };

  const callbackSaveDraftError = async (data: ErrorMessageResponseDto) => {
    message.error(data.message);
  };

  const onSavePublicVersion = () => {
    setIsOpenSavePublicConfirm(false);
    const payload: UpdateNotificationModel = {
      ...dataSource,
    };

    notificationApiService.savePublicVersionNotification(
      payload,
      callbackSavePublic,
      callBackErrorSavePublic,
      setLoading,
    );
  };

  const callbackSavePublic = async (data: any) => {
    if (data?.code === HttpStatusCode.Forbidden) {
      if (data.isGoalCreationTime) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_GOAL_SETTING')
            .replace('{0}', data.startGoal)
            .replace('{1}', data.endGoal),
        );
      }
      if (data.isEvaluationTime) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_EVALUATION')
            .replace('{0}', data.startEvaluation)
            .replace('{1}', data.endEvaluation),
        );
      }

      return;
    }

    if (dataSource.status === VersionNotificationStatus.PRIVATE) {
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
      },
    });

    setIsOpenSavePublicConfirm(false);
    message.success(t('MESSAGE.COMMON.IDM_SAVE_PUBLIC'));
    setIsEdit(false);
    await getDetailData(data.id);
  };

  const onCancelVersion = async () => {
    if (dataSource.status === VersionNotificationStatus.EDITING) {
      const payload = { status: VersionNotificationStatus.CANCEL, updatedTime: dataSource.updatedTime };

      notificationApiService.cancelVersionNotification(dataSource.id, payload, callbackCancel, setLoading);
    } else {
      await getDetailData(dataSource.id);
      setIsEdit(false);
    }

    setIsOpenCancelConfirm(false);
  };

  const callbackCancel = async (data: any) => {
    setIsEdit(false);
    setIsOpenCancelConfirm(false);
    startTransition(() => {
      setDataSource({
        ...dataSource,
        status: VersionNotificationStatus.CANCEL,
        updatedTime: data.updatedTime,
        user: data.user,
      });
    });

    message.success(t('MESSAGE.COMMON.IDM_SAVE_CANCEL_SUCCESS'));
    await getDetailData(dataSource.id);
  };

  const onChangeReason = (e: any) => {
    startTransition(() => {
      setDataSource({ ...dataSource, reason: e.target.value });
    });
  };

  const onValidateForm = () => {
    setIsOpenSavePublicConfirm(false);
    setTimeout(() => {
      form.validateFields();
    }, 500);
  };

  const handleValidateSavePublic = async () =>
    await onValidateSavePublic({
      form: form,
      dataSource: dataSource,
      dispatch: dispatch,
      onValidateForm: onValidateForm,
      setFocusLevelError: setFocusLevelError,
      setIsOpenSavePublicConfirm: setIsOpenSavePublicConfirm,
    });

  return (
    <>
      {!isLoadingPage ? (
        <div>
          {contextHolder}

          <DetailForm
            dataSource={dataSource}
            setDataSource={setDataSource}
            form={form}
            isEdit={isEdit}
            onChangeReason={onChangeReason}
            onEdit={onEdit}
            setIsOpenPublicConfirm={setIsOpenPublicConfirm}
            onSaveDraft={onSaveDraft}
            setIsOpenCancelConfirm={setIsOpenCancelConfirm}
            setIsOpenSavePublicConfirm={setIsOpenSavePublicConfirm}
            handleValidateSavePublic={handleValidateSavePublic}
            isLoading={isLoading}
            isSaveDraft={isSaveDraft}
            contentLength={contentLength}
            setContentLength={setContentLength}
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

export default DetailNotification;
