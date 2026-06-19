import Button from 'antd/lib/button';
import Typography from 'antd/lib/typography';
import message from 'antd/lib/message';
import Card from 'antd/lib/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ColumnComponent from './components/ColumnComponent';
import TableComponent from './components/TableComponent';
import InformationCommon from '../../../../views/criteria-management/InformationCommon';
import basicBehaviorApiService from '../../../../common/api/basicBehavior';
import { DataValues } from '../interfaces/InterfacesProps';
import { Affix, Space, Spin } from 'antd/lib';
import { t } from 'i18next';
import ModalCustomComponent from '../../../../@core/components/modal-custom';
import { urlCompanyCode } from '../../../../common/util';
interface Props {
  setNavigate: (pathName: string, state: { [x: string]: any }, replace: boolean) => void;
}
const DetailCriteriaComponents = (props: Props) => {
  const { setNavigate } = props;
  const navigate = useNavigate();
  const hostname = window.location.origin;
  const location = useLocation();
  const State = location.state;
  const [isAffixed, setIsAffixed] = useState<boolean>();
  const [hasButton, setHasButton] = useState<boolean>(true);
  const [isLoading, setLoading] = useState(false);
  const [isFinish, setFinishLoad] = useState(false);
  const [dataSources, setSources] = useState<DataValues>({
    data: {
      children: [],
      createdTime: '',
      id: 0,
      creationUser: 0,
      publicDate: '',
      reason: '',
      status: 0,
      statusName: '',
      subVersion: 0,
      type: 0,
      updatedBy: '',
      updatedTime: '',
      lastUpdatedTime: '',
      versionId: 0,
      version: 0,
      timer: new Date(),
      level: null,
    },
    subVersion: 0,
    listPoints: [],
  });
  const url = `/api/v1/f6/management-evaluation/detail-evaluation-item`;
  const [types, setType] = useState({
    type: '',
    content: <></>,
    textButton: '',
    open: false,
  });
  const callBack = (data: DataValues) => {
    setSources(data);
    setFinishLoad(true);
    if (data.data.status === 1) {
      setNavigate(
        location.pathname,
        {
          ...State,
          edited: true,
        },
        true,
      );
    }
  };

  const errorsCallback = (bool: boolean) => {
    setLoading(bool);
  };
  const effectData = () => {
    basicBehaviorApiService.detailCriteria(
      `${url}/${State.id}`,
      {
        isEdit: false,
      },
      callBack,
      errorsCallback,
    );
  };

  useEffect(() => {
    if (!State || State === null) {
      navigate(urlCompanyCode() + '/admin-evaluation/list-evaluation-item');
    } else {
      effectData();
    }
  }, []);

  useEffect(() => {
    if (dataSources.data.status === 4 && dataSources.edited) {
      setHasButton(false);
    } else {
      setHasButton(true);
    }
  }, [dataSources]);

  const publicVersion = async () => {
    setType({
      ...types,
      type: 'public',
      content: <>{t('POPUP_DIALOG.CONTENT.IDM_CONFIRM_PUBLIC')}</>,
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
    const callBackPublic = (data: any) => {
      if (data.code === 403) {
        message.error(
          t('MESSAGE.COMMON.IDM_NOT_ALLOW_PUBLIC_DURING_GOAL_SETTING')
            .replace('{0}', data.start)
            .replace('{1}', data.end),
        );
      } else if (data.code === 406) {
        message.error(t('MESSAGE.SCREEN.CRITERIA.IDM_VERSION_EXIST_EDITING'));
      } else {
        message.success(t('MESSAGE.COMMON.IDM_SAVE_PUBLIC').toString());
        effectData();
      }
      closePopup();
    };
    const url = `/api/v1/f6/management-evaluation/${State.id}/basic-behavior-public-version`;
    await basicBehaviorApiService.publicVersion(
      url,
      {
        version: dataSources.data.version,
        subVersion: dataSources.data.subVersion,
        timer: dataSources.data.timer,
        type: dataSources.data.type,
        hostname: hostname,
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
              {dataSources.data.type === 2 ||
              dataSources.data.type === 3 ||
              dataSources.data.type === 5 ||
              dataSources.data.type === 6
                ? t('IDS_DETAIL_BEHAVIOR')
                : t('IDS_DETAIL_BASIC_SKILL')}
            </Typography.Title>
            <InformationCommon
              version={`${dataSources.data.version}.${dataSources.data.subVersion}`}
              status={dataSources.data.statusName}
              userUpdated={dataSources.data.updatedBy}
              lastestUpdated={dataSources.data.lastUpdatedTime}
              datePublic={dataSources.data.publicDate}
              reasonPublic={dataSources.data.reason}
              level={dataSources.data.level}
              type={dataSources.data.type}
            />
          </Card>
          <Card style={{ marginTop: 15 }}>
            <div style={{ marginTop: 0 }}>
              <Typography.Title level={4}>
                {dataSources.data.type === 2 ||
                dataSources.data.type === 3 ||
                dataSources.data.type === 5 ||
                dataSources.data.type === 6
                  ? t('IDS_LIST_BEHAVIOR_ITEM')
                  : t('IDS_LIST_BASIC_ITEM')}
              </Typography.Title>
              <TableComponent columns={ColumnComponent()} dataSources={dataSources?.data?.children} />
            </div>
          </Card>
          {dataSources.data.status !== 2 && hasButton ? (
            <Affix
              offsetBottom={0}
              style={{ paddingBottom: 10 }}
              onChange={(affixed) => {
                setIsAffixed(affixed);
              }}
            >
              <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
                <Space direction="horizontal">
                  <div>
                    <Button
                      type="primary"
                      className="button-normal"
                      hidden={dataSources.data.status !== 4 || dataSources.edited}
                      onClick={() => {
                        setNavigate(
                          location.pathname,
                          {
                            ...State,
                            edited: true,
                          },
                          true,
                        );
                      }}
                    >
                      {t('IDS_EDIT')}
                    </Button>
                  </div>
                  <div>
                    <Button
                      hidden={dataSources.data.status === 4 || dataSources.edited}
                      type="primary"
                      className="button-normal"
                      loading={isLoading}
                      disabled={isLoading}
                      onClick={publicVersion}
                    >
                      {t('IDS_PUBLIC')}
                    </Button>
                  </div>
                </Space>
              </div>
            </Affix>
          ) : (
            <></>
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

export default DetailCriteriaComponents;
