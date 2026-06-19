import { Form, Typography, Card, Affix } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState, startTransition, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import basicBehaviorApiService from '../../../../common/api/basicBehavior';
import { ChildrenBasicBehavior, DataValues } from '../interfaces/InterfacesProps';
import Spin from 'antd/lib/spin';
import message from 'antd/lib/message';
import { t } from 'i18next';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { criteriaEvaluationStatus } from '../../../../common/status';
import notification from 'antd/lib/notification';
import { NotificationPlacement } from 'antd/es/notification/interface';
import TableComponent from '../../../../views/criteria-management/edit/TableComponents';
import ButtonTableComponent from '../../../../views/criteria-management/edit/components/ButtonTableComponent';
import ButtonFooterComponent from '../../../../views/criteria-management/edit/components/ButtonFooterComponent';
import { cloneRecordsFunc } from './functions/Function.services';
import { SaveDraft } from './interfaces/interfaces';
import { urlCompanyCode } from '../../../../common/util';
interface Props {
  setNavigate: (pathName: string, state: { [x: string]: any }, replace: boolean) => void;
}
type KeysDataType = keyof ChildrenBasicBehavior;
const EditBasicBehaviorComponent = (props: Props) => {
  const [isPending, transition] = useTransition();

  const { setNavigate } = props;
  const [dataSources, setDataSources] = useState<DataValues>({
    data: {
      children: [],
      createdTime: '',
      id: 0,
      creationUser: 0,
      publicDate: '',
      lastUpdatedTime: '',
      reason: '',
      status: 0,
      statusName: '',
      subVersion: 0,
      type: 0,
      updatedBy: '',
      updatedTime: '',
      versionId: 0,
      version: 0,
      timer: new Date(),
      level: null,
    },
    subVersion: 0,
    listPoints: [],
  });
  const hostname = window.location.origin;
  const [form] = Form.useForm();
  const [isAffixed, setIsAffixed] = useState<boolean>();
  const [selectedRowKeys, setSelectRowsKeys] = useState([]);
  const [selectRecords, setSelectRecord] = useState([]);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [isFinish, setFinish] = useState(false);

  const url = `/api/v1/f6/management-evaluation/detail-evaluation-item`;

  // const urlPeriod = `/api/v1/f5/management-basic-behavior-setting/list-period`;
  const [isLoading, setLoading] = useState(false);
  const [types, setType] = useState({
    type: '',
    content: <></>,
    textButton: '',
    open: false,
  });
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement: NotificationPlacement, mesage: string) => {
    api.warning({
      message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
      description: mesage,
      placement,
    });
  };
  const callBack = async (data: DataValues) => {
    data.data.children.forEach((e: any) => {
      e.key = e.id;
    });
    setDataSources(data);
    setFinish(true);

    if (data.data.status === 1) {
      setNavigate(
        location.pathname,
        {
          id: data.data.versionId,
          version: data.data.version,
          subVersion: data.data.subVersion,
          timer: data.data.timer,
          status: data.data.status,
          type: data.data.type,
          typeString:
            data.data.type === 2 || data.data.type === 3 || data.data.type === 5 || data.data.type === 6
              ? t('IDS_BEHAVIOR')
              : t('IDS_BASIC_SKILL'),
          edited: true,
        },
        true,
      );
    }

    if (data.data.status === 2) {
      setNavigate(
        location.pathname,
        {
          id: data.data.id,
          version: data.data.version,
          subVersion: data.data.subVersion,
          timer: data.data.timer,
          status: data.data.status,
          type: data.data.type,
          typeString:
            data.data.type === 2 || data.data.type === 3 || data.data.type === 5 || data.data.type === 6
              ? t('IDS_BEHAVIOR')
              : t('IDS_BASIC_SKILL'),
          edited: false,
        },
        true,
      );
    }
    form.setFieldValue('reason', data.data.status !== 1 ? '' : data.data.reason);
  };
  const errorsCallback = (bool: boolean) => {
    setLoading(bool);
  };
  const effectData = async (versionId?: number) => {
    await basicBehaviorApiService.detailCriteria(
      `${url}/${versionId || state.id}`,
      {
        isEdit: true,
      },
      callBack,
      errorsCallback,
    );
  };

  useEffect(() => {
    if (!state || state === null) {
      navigate(urlCompanyCode() + '/admin-evaluation/list-evaluation-item', {
        replace: false,
      });
    } else {
      effectData();
    }
  }, []);
  const cloneRecord = () => {
    cloneRecordsFunc(selectRecords, dataSources, openNotification, setDataSources, transition);
  };

  const cloneBlankInput = () => {
    if (dataSources.data.children.length < 100) {
      const datas = [
        {
          id: Math.random().toString(36).slice(2),
          key: Math.random().toString(36).slice(2).substr(0, 4),
          versionId: dataSources.data.id,
          title: null,
          content: null,
          difficulty: null,
        },
      ];
      transition(() => {
        setDataSources({
          ...dataSources,
          data: {
            ...dataSources.data,
            children: [...dataSources.data.children, ...datas],
          },
        });
      });
    } else {
      openNotification('bottomRight', t('MESSAGE.COMMON.IDM_EXCEED_RECORD').replace('{maxRecord}', '100'));
    }
  };

  const setDataSource = (data: any, index: number, keysData: KeysDataType) => {
    const arrays = dataSources.data.children.map((v) => ({ ...v }));
    arrays[index] = { ...arrays[index], [keysData]: data === '' ? null : data };
    startTransition(() => {
      setDataSources({
        ...dataSources,
        data: {
          ...dataSources.data,
          children: arrays,
        },
      });
    });
  };

  const saveDraft = async () => {
    const callBackSaveDraft = (data: SaveDraft) => {
      if (data.code === 406) {
        return message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_EXIST_EDITING'));
      }
      if (data.code === 407) {
        return message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_NOT_ALREADY_PUBLIC'));
      }

      if (isLoading === false && data) {
        message.success(t('MESSAGE.COMMON.IDM_SAVE_DRAFT_SUCCESS').toString());
        setDataSources({
          ...dataSources,
          data: {
            ...dataSources.data,
            updatedBy: data.fullName,
            updatedTime: data.timer.toString(),
            versionId: data.versionId,
            id: data.versionId,
            status: 1,
            subVersion: data.subVersion,
            timer: data.timer,
            lastUpdatedTime: data.lastUpdatedTime,
          },
          subVersion: data.subVersion,
          edited: data.edited,
        });
      }
      setNavigate(
        location.pathname,
        {
          id: data.versionId,
          version: data.version,
          subVersion: data.subVersion,
          timer: data.timer,
          status: data.status,
          type: dataSources.data.type,
          typeString:
            dataSources.data.type === 2 ||
            dataSources.data.type === 3 ||
            dataSources.data.type === 5 ||
            dataSources.data.type === 6
              ? t('IDS_BEHAVIOR')
              : t('IDS_BASIC_SKILL'),
          edited: true,
        },
        true,
      );
    };
    dataSources.data.reason = form.getFieldValue('reason');
    const urlSaveDraft = '/api/v1/f6/management-evaluation/evaluation-item/save-draft';
    dataSources.data.subVersion = dataSources.subVersion;

    await basicBehaviorApiService.saveDraft(urlSaveDraft, dataSources.data, callBackSaveDraft, errorsCallback);
  };

  // ===================== cancel ===========
  const cancelVersion = () => {
    setType({
      type: 'cancel',
      content: <>{t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_CANCEL')}</>,
      textButton: t('IDS_BUTTON_CANCELED'),
      open: true,
    });
  };
  const savePublic = () => {
    form
      .validateFields()
      .then(async () => {
        if (dataSources.data.children.length > 0) {
          setType({
            ...types,
            type: 'public',
            content: <>{t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_SAVE_PUBLIC')}</>,
            textButton: t('IDS_PUBLIC'),
            open: true,
          });
        } else {
          openNotification(
            'bottomRight',
            t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace(
              '{tab}',
              state.type === 1 ? t('IDS_PRO_SKILL') : t('IDS_BEHAVIOR'),
            ),
          );
        }
      })
      .catch(() => {});
  };

  const confirmPopup = async () => {
    if (types.type === 'cancel') {
      if (dataSources.data.status === 1) {
        const callBackCancel = async (bool: boolean) => {
          setType({
            ...types,
            open: false,
          });
          if (bool) {
            message.success(t('MESSAGE.COMMON.IDM_SAVE_CANCEL_SUCCESS').toString());
            setNavigate(
              location.pathname,
              {
                id: state.id,
                type: state.type,
                status: state.status,
                edited: false,
              },
              true,
            );
          }
        };
        const callBackErrorCancel = (bool: boolean) => {
          setLoading(bool);
          setType({
            ...types,
            open: false,
          });
        };
        await basicBehaviorApiService.cancelVersion(
          `/api/v1/f6/management-evaluation/evaluation-item/cancel-version/${state.id}`,
          dataSources.data,
          callBackCancel,
          callBackErrorCancel,
        );
      } else {
        navigate(location.pathname, {
          state: {
            id: state.id,
          },
        });
      }
    } else {
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
        } else if (data.code === 406) {
          message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_EXIST_EDITING'));
          setLoading(false);
        } else {
          message.success(t('MESSAGE.COMMON.IDM_SAVE_PUBLIC').toString());
          setNavigate(
            location.pathname,
            {
              id: data.id,
              type: data.type,
              status: data.status,
              edited: false,
            },
            true,
          );
          setLoading(false);
        }
        setType({
          ...types,
          open: false,
        });
      };
      await form
        .validateFields()
        .then(async () => {
          dataSources.data.reason = form.getFieldValue('reason');
          if (dataSources.data.children.length > 0) {
            await basicBehaviorApiService.savePrivateVersion(
              `/api/v1/f6/management-evaluation/evaluation-item/${state.id}/save-public-version/`,
              dataSources.data,
              hostname,
              callBackPublic,
              errorsCallback,
            );
          } else {
            openNotification(
              'bottomRight',
              t('MESSAGE.COMMON.IDM_TAB_NOT_VALUE').replace(
                '{tab}',
                state.type === 1 ? t('IDS_BASIC_SKILL') : t('IDS_BEHAVIOR'),
              ),
            );
          }
        })
        .catch(() => {});
    }
  };
  const closePopup = () => {
    setType({
      ...types,
      open: false,
    });
  };

  return (
    <>
      {contextHolder}
      {isFinish ? (
        <div>
          <Form labelAlign="left" labelCol={{ span: 1 }} layout="horizontal" style={{ width: '100%' }} form={form}>
            <Card>
              <Typography.Title level={3} style={{ paddingBottom: 10 }}>{`${
                dataSources.data.type === 2 ||
                dataSources.data.type === 3 ||
                dataSources.data.type === 5 ||
                dataSources.data.type === 6
                  ? t('IDS_BEHAVIOR')
                  : t('IDS_BASIC_SKILL')
              }${t('IDS_DETAIL')}`}</Typography.Title>

              <Form.Item label={t('IDS_LEVEL')} colon={false} className="ant-form-item-info">
                {dataSources.data.level}
              </Form.Item>

              {dataSources.data.type === 2 ||
              dataSources.data.type === 3 ||
              dataSources.data.type === 5 ||
              dataSources.data.type === 6 ? (
                <Form.Item label={t('IDS_EVALUATION_SKILL')} colon={false} className="ant-form-item-info">
                  {dataSources.data.type === 2 || dataSources.data.type === 5 ? t('IDS_HAVE') : t('IDS_NOT_HAVE')}
                </Form.Item>
              ) : null}

              <Form.Item label={t('IDS_VERSION')} colon={false} className="ant-form-item-info">
                {dataSources.data.status !== 2 && dataSources.data.status !== 1
                  ? `${dataSources.data.version}.${dataSources.subVersion + 1}`
                  : `${dataSources.data.version}.${dataSources.data.subVersion}`}
              </Form.Item>
              <Form.Item label={t('IDS_STATUS')} colon={false} className="ant-form-item-info">
                {dataSources.data.status !== 2 && dataSources.data.status !== 1
                  ? criteriaEvaluationStatus['1']
                  : criteriaEvaluationStatus[dataSources.data.status]}
              </Form.Item>
              <Form.Item label={t('IDS_LAST_UPDATE_USER')} colon={false} className="ant-form-item-info">
                {dataSources.data.status === 1 && dataSources.data.updatedBy}
              </Form.Item>
              <Form.Item label={t('IDS_LAST_UPDATE_DATE')} colon={false} className="ant-form-item-info">
                {dataSources?.data.lastUpdatedTime !== null &&
                  dataSources.data.status === 1 &&
                  dataSources?.data.lastUpdatedTime}
              </Form.Item>
              <Form.Item label={t('IDS_PUBLIC_DATE')} colon={false} className="ant-form-item-info"></Form.Item>
              <Form.Item
                name={'reason'}
                label={t('IDS_HISTORY_EDIT')}
                colon={false}
                required={false}
                style={{ marginBottom: 0 }}
                rules={[
                  { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
                  {
                    max: 500,
                    message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500'),
                  },
                ]}
              >
                <TextArea
                  maxLength={501}
                  autoSize
                  style={{ whiteSpace: 'pre-wrap' }}
                  placeholder={t('IDS_PLACEHOLDER_HISTORY_EDIT').toString()}
                />
              </Form.Item>
            </Card>

            <Card style={{ marginTop: 15, marginBottom: 10 }}>
              <div style={{ marginTop: 0 }}>
                <Typography.Title level={4}>{`${
                  dataSources.data.type === 2 ||
                  dataSources.data.type === 3 ||
                  dataSources.data.type === 5 ||
                  dataSources.data.type === 6
                    ? t('IDS_BEHAVIOR')
                    : t('IDS_BASIC_SKILL')
                }${t('IDS_LIST_ITEM_EVALUATE')}`}</Typography.Title>
                <TableComponent
                  dataSources={dataSources.data}
                  dataSourcesParent={dataSources}
                  setDataSourcesParent={setDataSources}
                  selectRecords={selectRecords}
                  selectedRowKeys={selectedRowKeys}
                  setSelectRecord={setSelectRecord}
                  setSelectRowsKeys={setSelectRowsKeys}
                  setDataSource={setDataSource}
                  listPoints={dataSources.listPoints}
                />

                <ButtonTableComponent
                  cloneBlankInput={cloneBlankInput}
                  cloneRecord={cloneRecord}
                  dataSources={dataSources}
                  selectedRowKeys={selectedRowKeys}
                  setDataSources={setDataSources}
                  setSelectRecord={setSelectRecord}
                  setSelectRowsKeys={setSelectRowsKeys}
                  isPending={isPending}
                  isLoading={isLoading}
                />
              </div>
            </Card>
            <Affix
              offsetBottom={0}
              style={{ paddingBottom: 10 }}
              onChange={(affixed) => {
                setIsAffixed(affixed);
              }}
            >
              <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
                <ButtonFooterComponent
                  cancelVersion={cancelVersion}
                  isLoading={isLoading}
                  saveDraft={saveDraft}
                  savePublic={savePublic}
                  isPending={isPending}
                />
              </div>
            </Affix>
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

export default EditBasicBehaviorComponent;
