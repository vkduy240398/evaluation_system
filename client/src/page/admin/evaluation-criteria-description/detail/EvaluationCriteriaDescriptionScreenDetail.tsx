import { Affix, Button, Card, message, Space, Spin, Typography } from 'antd';
import { t } from 'i18next';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InformationCommonCriteria from './InformationCommonCriteria';
import { DataValuesCriteriaEvaluation } from './InterfacesProps';
import evaluationCriteriApiService from '../../../../common/api/evaluationCritea';
import parse from 'html-react-parser';
import { urlCompanyCode } from '../../../../common/util';

const EvaluationCriteriaDescriptionScreenDetail = () => {
  const navigate = useNavigate();
  const State = useLocation().state;
  const [isLoading, setLoading] = useState(false);
  const [isFinish, setFinishLoad] = useState(false);
  const [isAffixed, setIsAffixed] = useState<boolean>();
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

  const url = `/api/v1/f6/management-evaluation/detail-criteria-evaluation`;

  useEffect(() => {
    if (!State) {
      navigate(urlCompanyCode() + '/admin-evaluation/list-criteria-evaluation');
    } else {
      effectData();
    }
  }, []);

  const [types, setType] = useState({
    type: '',
    content: '',
    textButton: '',
    open: false,
  });
  const callBack = (data: DataValuesCriteriaEvaluation) => {
    setDataSources(data);
    setFinishLoad(true);
    if (data.data.status === 1) {
      navigate(urlCompanyCode() + `/admin-evaluation/criteria-evaluation/edit`, {
        replace: true,
        state: {
          id: data.data.id,
          version: data.data.version,
          subVersion: data.data.subVersion,
          timer: data.data.timer,
          status: data.data.status,
          type: data.data.type,
        },
      });
    }
  };
  const errorsCallback = (bool: boolean) => {
    setLoading(bool);
  };
  const effectData = () => {
    evaluationCriteriApiService.detailCriteriaEvaluation(`${url}/${State.id}`, callBack, errorsCallback);
  };
  const callBackPublic = (data: any) => {
    if (data.code === 403) {
      message.error(
        t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_GOAL_SETTING')
          .replace('{0}', data.start)
          .replace('{1}', data.end),
      );
    } else {
      message.success(t('MESSAGE.COMMON.IDM_SAVE_PUBLIC').toString());
      effectData();
    }
    closePopup();
  };

  const publicVersion = async () => {
    setType({
      ...types,
      type: 'public',
      content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_PUBLIC'),
      textButton: t('IDS_PUBLIC'),
      open: true,
    });
  };

  const closePopup = () => {
    setType({
      ...types,
      open: false,
    });
  };
  const confirmPopup = async () => {
    const url = `/api/v1/f6/management-evaluation/${State.id}/public-version`;
    await evaluationCriteriApiService.publicVersion(
      url,
      {
        version: dataSources.data.version,
        subVersion: dataSources.data.subVersion,
        timer: dataSources.data.timer,
        type: dataSources.data.type,
      },
      callBackPublic,
      errorsCallback,
    );
  };

  return (
    <>
      {isFinish ? (
        <div>
          <Card>
            <Typography.Title level={3} style={{ paddingBottom: 10 }}>
              {t('IDS_EVALUATION_CRITERIA_DETAIL')}
            </Typography.Title>
            <InformationCommonCriteria
              level={dataSources.data.level}
              flagSkill={dataSources.data.type}
              version={`${dataSources.data.version}.${dataSources.data.subVersion}`}
              status={dataSources.data.statusName}
              userUpdated={dataSources.data.updatedBy}
              lastestUpdated={dataSources.data.updatedTime}
              datePublic={dataSources.data.publicDate}
              reasonPublic={dataSources.data.reason}
              lastUpdatedTime={dataSources.data.lastUpdatedTime}
            />
          </Card>
          <Card style={{ marginTop: 15, overflowX: 'auto' }}>
            <div className="editor-custom-css-boder-padding editor-custom-css-background-color-click">
              <Typography.Title level={4}>{t('IDS_EVALUATION_CRITERIA')}</Typography.Title>
              <div className="parse-table-content">
                {dataSources.data.contentEvaluationCriteria && dataSources.data.contentEvaluationCriteria.trim() !== ''
                  ? parse(dataSources.data.contentEvaluationCriteria)
                  : t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
              </div>
            </div>
          </Card>
          <Card style={{ marginTop: 15, overflowX: 'auto' }}>
            <div className="editor-custom-css-boder-padding editor-custom-css-background-color-click">
              <Typography.Title level={4}>{t('IDS_NOTES')}</Typography.Title>
              <div className="parse-table-content">
                {dataSources.data.contentNotes && dataSources.data.contentNotes.trim() !== ''
                  ? parse(dataSources.data.contentNotes)
                  : t('MESSAGE.COMMON.IDM_EMPTY_DATA')}
              </div>
            </div>
          </Card>
          {dataSources.data.status !== 2 && dataSources.isShowEdit && (
            <Affix
              offsetBottom={0}
              style={{ paddingBottom: 10 }}
              onChange={(affixed) => {
                setIsAffixed(affixed);
              }}
            >
              <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
                <Space direction="horizontal">
                  {dataSources.isShowEdit && dataSources.data.status === 4 && (
                    <div>
                      <Button
                        type="primary"
                        className="button-normal"
                        onClick={() => {
                          navigate(urlCompanyCode() + `/admin-evaluation/criteria-evaluation/edit`, {
                            replace: true,
                            state: {
                              id: dataSources.data.id,
                              version: dataSources.data.version,
                              subVersion: dataSources.data.subVersion,
                              timer: dataSources.data.timer,
                              status: dataSources.data.status,
                              type: dataSources.data.type,
                            },
                          });
                        }}
                      >
                        {t('IDS_EDIT')}
                      </Button>
                    </div>
                  )}
                  {dataSources.data.status === 3 && (
                    <div>
                      <Button
                        type="primary"
                        className="button-normal"
                        loading={isLoading}
                        disabled={isLoading}
                        onClick={publicVersion}
                      >
                        {t('IDS_PUBLIC')}
                      </Button>
                    </div>
                  )}
                </Space>
              </div>
            </Affix>
          )}
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

export default EvaluationCriteriaDescriptionScreenDetail;
