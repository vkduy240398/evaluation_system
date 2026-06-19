import { Form, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { DataValuesCriteriaEvaluation } from '../detail/InterfacesProps';
import evaluationCriteriApiService from '../../../../common/api/evaluationCritea';
import CommonInformationEvaluationCriteriaDescription from './component/CommonInformationEvaluationCriteriaDescription';
import ButtonFooterEvaluationCriteriaDescription from './component/ButtonFooterEvaluationCriteriaDescription';
import ComponentNoteContentEvaluationCriteria from './component/ComponentNoteContentEvaluationCriteria';
import { handlePopupConfirm } from './handle-data/handleDataEvaluationCriteriaDescription';
import { urlCompanyCode } from '../../../../common/util';

const EvaluationCriteriaDescriptionScreenEdit = () => {
  const [contentLength, setContentLength] = useState(-1);
  const [noteLength, setNoteLength] = useState(-1);
  const [dataSources, setDataSources] = useState<DataValuesCriteriaEvaluation>({
    data: {
      createdTime: '',
      id: 0,
      creationUser: 0,
      publicDate: '',
      reason: '',
      status: 0,
      statusName: '',
      subVersion: 0,
      level: '',
      updatedBy: '',
      updatedTime: '',
      versionId: 0,
      version: 0,
      timer: new Date(),
      contentEvaluationCriteria: '',
      contentNotes: '',
      type: 0,
      lastUpdatedTime: '',
    },
    subVersion: 0,
    isShowEdit: '',
  });

  const [form] = Form.useForm();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isFinish, setFinish] = useState(false);
  const [contents, setContents] = useState('');
  const [notes, setNotes] = useState('');
  const [isChangeContent, setIsChangeContent] = useState(false);
  const [isChangeNote, setIsChangeNote] = useState(false);
  const url = `/api/v1/f6/management-evaluation/detail-criteria-evaluation`;
  useEffect(() => {
    if (!state) {
      navigate(urlCompanyCode() + '/admin-evaluation/list-criteria-evaluation', {
        replace: false,
      });
    } else {
      effectData();
    }
  }, []);

  const effectData = async (versionId?: number) => {
    await evaluationCriteriApiService.detailCriteriaEvaluation(
      `${url}/${versionId || state.id}`,
      callBack,
      errorsCallback,
    );
  };

  const [isLoading, setLoading] = useState(false);
  const [types, setType] = useState({
    type: '',
    content: '',
    textButton: '',
    open: false,
  });

  const callBack = async (data: DataValuesCriteriaEvaluation) => {
    setDataSources(data);
    setFinish(true);
    if (data.data.status === 1) {
      await navigate(urlCompanyCode() + `/admin-evaluation/criteria-evaluation/edit`, {
        replace: true,
        state: {
          id: data.data.versionId,
          version: data.data.version,
          subVersion: data.data.subVersion,
          timer: data.data.timer,
          status: data.data.status,
          type: data.data.type,
        },
      });
    }
    if (data.data.status === 2) {
      navigate(urlCompanyCode() + `/admin-evaluation/criteria-evaluation/detail/${data.data.id}`, {
        replace: false,
        state: {
          id: data.data.id,
        },
      });
    }
    form.setFieldValue('reason', data.data.status !== 1 ? '' : data.data.reason);
    form.setFieldValue('contend', data.data.contentEvaluationCriteria);
    form.setFieldValue('note', data.data.contentNotes);
  };

  const errorsCallback = (bool: boolean) => {
    setLoading(bool);
  };

  const callBackSaveDraft = (data: any) => {
    if (data.code === 200) {
      if (!isLoading && data) {
        message.success(t('MESSAGE.COMMON.IDM_SAVE_DRAFT_SUCCESS').toString());
        setDataSources({
          ...dataSources,
          data: {
            ...dataSources.data,
            updatedBy: data.fullName,
            updatedTime: data.timer,
            versionId: data.versionId,
            id: data.versionId,
            status: 1,
            subVersion: data.subVersion,
            timer: data.timer,
            lastUpdatedTime: data.lastUpdatedTime,
          },
          subVersion: data.subVersion,
        });
      }
    } else if (data.code === 406) {
      message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_EXIST_EDITING'));
    } else if (data.code === 407) {
      message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_NOT_ALREADY_PUBLIC'));
    }

    navigate(urlCompanyCode() + `/admin-evaluation/criteria-evaluation/edit`, {
      replace: true,
      state: {
        id: data.versionId,
        version: data.version,
        subVersion: data.subVersion,
        timer: data.timer,
        status: data.status,
        type: data.type,
      },
    });
  };

  const saveDraft = async () => {
    dataSources.data.reason = form.getFieldValue('reason');
    dataSources.data.contentEvaluationCriteria = isChangeContent ? contents : form.getFieldValue('contend');
    dataSources.data.contentNotes = isChangeNote ? notes : form.getFieldValue('note');
    dataSources.data.subVersion = dataSources.subVersion;
    const urlSaveDraft = '/api/v1/f6/management-evaluation/criteria-evaluation/save-draft';

    await evaluationCriteriApiService.saveDraft(urlSaveDraft, dataSources.data, callBackSaveDraft, errorsCallback);
  };

  // ===================== cancel ===========
  const callBackCancel = async (bool: boolean) => {
    setType({
      ...types,
      open: false,
    });
    if (bool) {
      message.success(t('MESSAGE.COMMON.IDM_SAVE_CANCEL_SUCCESS').toString());
      await navigate(urlCompanyCode() + `/admin-evaluation/criteria-evaluation/detail/${state.id}`, {
        replace: true,
        state: {
          id: state.id,
          type: state.type,
          status: state.status,
        },
      });
    }
  };

  const callBackErrorCancel = (bool: boolean) => {
    setLoading(bool);
    setType({
      ...types,
      open: false,
    });
  };

  const cancelVersion = () => {
    setType({
      type: 'cancel',
      content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_CANCEL'),
      textButton: t('IDS_BUTTON_CANCELED'),
      open: true,
    });
  };

  const savePublic = () => {
    form
      .validateFields()
      .then(() => {
        setType({
          type: 'public',
          content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE_PUBLIC'),
          textButton: t('IDS_PUBLIC'),
          open: true,
        });
      })
      .catch(() => {});
  };

  const callBackPublic = async (data: any) => {
    if (data.code === 403) {
      message.error(
        t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_GOAL_SETTING')
          .replace('{0}', data.start)
          .replace('{1}', data.end),
      );
      setLoading(false);
    } else if (data.code === 407) {
      message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_NOT_ALREADY_PUBLIC'));
      setLoading(false);
    } else {
      message.success(t('MESSAGE.COMMON.IDM_SAVE_PUBLIC').toString());
      await navigate(urlCompanyCode() + `/admin-evaluation/criteria-evaluation/detail/${state.id}`, {
        replace: true,
        state: {
          id: data.id,
          type: data.type,
          status: data.status,
        },
      });
      setLoading(false);
    }
    setType({
      ...types,
      open: false,
    });
  };

  const callBackPrivate = async (data: any) => {
    message.success(t('MESSAGE.COMMON.IDM_SAVE_SUCCESS').toString());
    await navigate(urlCompanyCode() + `/admin-evaluation/criteria-evaluation/detail/${state.id}`, {
      replace: true,
      state: {
        id: data.id,
        type: data.type,
        status: data.status,
      },
    });
  };

  const savePrivate = () => {
    form
      .validateFields()
      .then(() => {
        setType({
          type: 'private',
          content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE'),
          textButton: t('IDS_BUTTON_SAVE'),
          open: true,
        });
      })
      .catch(() => {});
  };

  const confirmPopup = async () => {
    handlePopupConfirm(
      types,
      dataSources,
      navigate,
      form,
      state,
      callBackCancel,
      callBackErrorCancel,
      callBackPrivate,
      errorsCallback,
      callBackPublic,
      isChangeContent,
      isChangeNote,
      contents,
      notes,
    );
  };

  const closePopup = () => {
    setType({
      ...types,
      open: false,
    });
  };

  return (
    <>
      {isFinish ? (
        <div>
          <Form labelAlign="left" labelCol={{ span: 1 }} layout="horizontal" style={{ width: '100%' }} form={form}>
            <CommonInformationEvaluationCriteriaDescription dataSources={dataSources} />
            <ComponentNoteContentEvaluationCriteria
              setContentLength={setContentLength}
              contentLength={contentLength}
              setNoteLength={setNoteLength}
              noteLength={noteLength}
              contents={contents}
              notes={notes}
              dataSources={dataSources}
              setContents={setContents}
              setNotes={setNotes}
              setIsChangeContent={setIsChangeContent}
              setIsChangeNote={setIsChangeNote}
            />
            <ButtonFooterEvaluationCriteriaDescription
              isLoading={isLoading}
              saveDraft={saveDraft}
              cancelVersion={cancelVersion}
              savePrivate={savePrivate}
              savePublic={savePublic}
            />
          </Form>
        </div>
      ) : (
        <Spin
          size="large"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
        />
      )}
      <ModalCustomComponent
        isOpen={types.open}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={types.content}
        fnHandleOk={confirmPopup}
        fnHandleCancel={closePopup}
        okText={types.textButton}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isLoading}
      />
    </>
  );
};

export default EvaluationCriteriaDescriptionScreenEdit;
