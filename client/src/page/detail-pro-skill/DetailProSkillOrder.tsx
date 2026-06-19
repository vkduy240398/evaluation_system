import { Affix, Row, Spin, Tooltip, Typography } from 'antd';
import Information from '../../views/admin-evaluation/detail-pro-skill/Information';
import TableComponent from '../../views/admin-evaluation/detail-pro-skill/TableComponent';
import ButtonComponent from '../../views/admin-evaluation/detail-pro-skill/components/ButtonComponent';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { t } from 'i18next';
import AdminEvaluationApiService from '../../common/api/adminEvaluation';
import ModalCustomComponent from '../../@core/components/modal-custom';
import Form from 'antd/es/form';
import message from 'antd/lib/message';
import Card from 'antd/lib/card';
import { decrypt, urlCompanyCode } from '../../common/util';
import TextArea from 'antd/es/input/TextArea';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';

const DetailProSkillOrder = () => {
  const state = useLocation().state;
  const hostname = window.location.origin;
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [isFinish, setFinish] = useState(false);
  const [isAffixed, setIsAffixed] = useState<boolean>();
  const [dataSources, setDataSources] = useState<{
    childrens: any[];
    creationUser: string;
    skill: string;
    versionId: number;
    publicDate: string;
    publicStatus: number;
    status: number;
    subVersion: number;
    versionMain: number;
    updatedTime: Date;
    version: string;
    reason: string;
    lastUpdatedTime: string;
    settersAndApprovers: {
      setters: string[];
      approvers: string[];
    };
    skillActive: number;
    rejectComment?: any;
    dataChildrenFilter?: []; // dùng để search trên column header
  }>({
    childrens: [],
    creationUser: '',
    skill: '',
    versionId: 0,
    publicDate: '',
    publicStatus: 0,
    status: 0,
    subVersion: 0,
    updatedTime: new Date(),
    versionMain: 0,
    version: '',
    reason: '',
    lastUpdatedTime: '',
    settersAndApprovers: {
      setters: [],
      approvers: [],
    },
    skillActive: 0,
    rejectComment: '',
    dataChildrenFilter: [],
  });
  const [types, setTypes] = useState({
    open: false,
    content: '',
    textButton: '',
    messageSuccess: '',
    type: 'private',
  });
  const [form] = Form.useForm();

  // Effect data
  const callBackEffect = (data: any) => {
    if (data.departmentActive === 0) {
      navigate('/404page');
    }
    setDataSources(data);
    setFinish(true);
  };
  const errorsEffect = (bool: boolean) => {
    setLoading(bool);
  };
  const { id } = useParams();
  const effectData = () => {
    AdminEvaluationApiService.getInforProSkillById(
      `/api/v1/f6/management-evaluation/detail-pro-skill/${state?.id}`,
      callBackEffect,
      errorsEffect,
    );
  };

  // ========== Public version ============
  const callBackPublic = (data: any) => {
    if (data.code === 403) {
      if (data.isDuringGoalSetting) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_GOAL_SETTING')
            .replace('{0}', data.goalSettingStart)
            .replace('{1}', data.goalSettingEnd),
        );
      }
      if (data.isDuringEvaluation) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_EVALUATION')
            .replace('{0}', data.evaluationStart)
            .replace('{1}', data.evaluationEnd),
        );
      }

      setTypes({
        ...types,
        open: false,
      });
    } else {
      setDataSources({
        ...dataSources,
        updatedTime: data.updatedTime,
        versionId: data.id,
        publicStatus: data.publicStatus,
        status: data.status,
        publicDate: data.publicDate,
        versionMain: data.version,
        subVersion: data.subVersion,
        version: `${data.version}`,
        rejectComment: data.rejectComment,
      });
      setTypes({
        ...types,
        open: false,
      });
      message.success(types.messageSuccess);
    }
  };
  const errorsPublic = (bool: boolean) => {
    setLoading(bool);
  };
  const OpenPopupConfirm = () => {
    setTypes({
      open: true,
      content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_PUBLIC'),
      messageSuccess: t('MESSAGE.COMMON.IDM_SAVE_PUBLIC'),
      textButton: t('IDS_PUBLIC').toString(),
      type: 'public',
    });
  };
  const OpenPopupReject = () => {
    form
      .validateFields()
      .then((_) => {
        setTypes({
          open: true,
          content: t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_REJECT'),
          messageSuccess: t('MESSAGE.COMMON.IDM_REJECT_SUCCESS'),
          textButton: t('POPUP_DIALOG.BUTTON.REJECT').toString(),
          type: 'private',
        });
      })
      .catch((_) => {});
  };
  const publicVersion = () => {
    const objectFunc: { [x: string]: any } = {
      public: async function () {
        const reason = form.getFieldValue('reason');
        if ((reason && reason.length <= 500) || !reason) {
          AdminEvaluationApiService.publicVersionById(
            `/api/v1/f6/management-evaluation/${state?.id}/public-pro-skill`,
            {
              reason: reason,
              updatedTime: dataSources.updatedTime,
              hostname: hostname,
            },
            callBackPublic,
            errorsPublic,
          );
        }
      },
      private: function () {
        form
          .validateFields()
          .then(() => {
            AdminEvaluationApiService.publicVersionById(
              `/api/v1/f6/management-evaluation/${state?.id}/reject-pro-skill`,
              {
                reason: form.getFieldValue('reason'),
                updatedTime: dataSources.updatedTime,
                hostname: hostname,
              },
              callBackPublic,
              errorsPublic,
            );
          })
          .catch((_) => {});
      },
    };
    objectFunc[types.type]();
  };
  const closePopup = () => {
    setTypes({
      ...types,
      open: false,
    });
  };
  useEffect(() => {
    if (!state || state === null) {
      if (decrypt(id?.toString() || '') === undefined) {
        navigate(urlCompanyCode() + '/admin-evaluation/list-criteria-history', {
          state: {
            offset: 0,
            limit: 20,
            sortBy: 'periodIndex',
            sortType: 'ASC',
            department: t('IDS_ALL'),
            status: t('IDS_ALL'),
            classification: 2 /**基本スキル */,
            current: 1,
          },
        });
      } else {
        navigate(`${window.location.pathname}`, {
          state: {
            id: decrypt(id?.toString() || ''),
          },
        });
      }
    }

    if (state !== null) {
      effectData();
    }
  }, [state]);

  return (
    <>
      {isFinish ? (
        <div>
          <Card>
            <Typography.Title level={3} style={{ paddingBottom: 10 }}>
              {t('IDS_DETAIL_PRO_SKILL')}
            </Typography.Title>
            <Information data={dataSources} />
          </Card>
          <div style={{ marginTop: 15, marginBottom: 0 }}>
            <Card>
              <Typography.Title level={4}>{t('IDS_LIST_PRO_SKILL')}</Typography.Title>
              <TableComponent dataSources={dataSources} setDataSources={setDataSources} />
            </Card>
            <Affix
              offsetBottom={0}
              style={{ paddingBottom: 10 }}
              onChange={(affixed) => {
                setIsAffixed(affixed);
              }}
            >
              <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
                <Form form={form}>
                  {dataSources.publicStatus === 2 && dataSources.status === 4 && (
                    <>
                      <Row style={{ marginBottom: '5px' }}>
                        <Typography>{t('IDS_TITLE_REJECT')}</Typography>
                        <Tooltip title={t('IDS_TOOLTIP_REJECT')} overlayInnerStyle={{ fontSize: '12px' }}>
                          <Icon
                            component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                            style={{ cursor: 'default', paddingLeft: 4 }}
                          />
                        </Tooltip>
                      </Row>
                      <Form.Item
                        name={'reason'}
                        style={{ marginBottom: 5 }}
                        rules={[
                          { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
                          {
                            max: 500,
                            message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500'),
                          },
                        ]}
                      >
                        <TextArea autoSize={{ maxRows: 2 }} maxLength={501} />
                      </Form.Item>
                    </>
                  )}
                  <ButtonComponent
                    OpenPopupReject={OpenPopupReject}
                    isLoading={isLoading}
                    OpenPopupConfirm={OpenPopupConfirm}
                    publicStatus={dataSources.publicStatus}
                    status={dataSources.status}
                    id={dataSources.versionId}
                  />
                </Form>
              </div>
            </Affix>
          </div>
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
      <ModalCustomComponent
        isOpen={types.open}
        header={t('POPUP_DIALOG.TITLE.CONFIRM')}
        content={types.content}
        fnHandleOk={publicVersion}
        fnHandleCancel={closePopup}
        okText={types.textButton}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        loading={isLoading}
      />
    </>
  );
};

export default DetailProSkillOrder;
