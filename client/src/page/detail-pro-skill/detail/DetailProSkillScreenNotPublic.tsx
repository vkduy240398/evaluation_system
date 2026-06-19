import { Typography, Spin, Affix, Button, Row } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import proSetting from '../../../common/api/pro-setting';
import { t } from 'i18next';
import { DataState } from '../../../model/DataState';
import DetailProSkillTable from '../../../views/pro-skill-setting/detail-pro-skill/DetailProSkillTable';
import Card from 'antd/lib/card';
import Information from '../../../views/pro-skill-setting/detail-pro-skill/Information';
import message from 'antd/lib/message';
import { urlCompanyCode } from '../../../common/util';

const defaultDataState: DataState<any> = {
  dataSource: {},
  dataTable: [], // dùng cho search trên column header
};
interface Props {
  setNavigate: (pathName: string, state: { [x: string]: any }, replace: boolean) => void;
}
const DetailProSkillScreenNotPublic = (_props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAffixed, setIsAffixed] = useState<boolean>();
  const state = location.state;

  // const { id } = useParams();
  const [dataState, setDataState] = useState(defaultDataState);
  const [isLoading, setLoading] = useState(false);

  const url = `/api/v1/f3/pro-setting/detail-pro-skill`;

  const dataCallback = (data: any) => {
    if (data.departmentActive <= 0) {
      navigate('/404page');
    }
    if (data.code === 403) {
      message.error(t('MESSAGE.COMMON.IDM_UNAUTHORIZED_SETTING_PRO_SKILL'));
      navigate(-1);
    }
    let i = 1;
    data.children.forEach((e: any) => {
      e.key = i++;
    });

    setDataState({
      ...dataState,
      dataSource: data,
      dataTable: data.children,
    });
  };

  const errorCallback = (bool: boolean | undefined) => {
    setLoading(bool || false);
  };

  useEffect(() => {
    // if (!state || state === null) {
    //   if (decrypt(id?.toString() || '') === undefined) {
    //     console.log(123);
    //     navigate('/404page');
    //   } else {
    //     navigate(`${window.location.pathname}`, {
    //       state: {
    //         id: decrypt(id?.toString() || ''),
    //       },
    //     });
    //   }
    // }
    if (state !== null) {
      proSetting.detailProSkill(url, state?.id, false, dataCallback, errorCallback);
    }
  }, [state?.id]);

  useEffect(() => {}, [dataState.dataSource]);

  return (
    <>
      {!isLoading ? (
        <>
          <Card>
            <Typography.Title level={3} style={{ paddingBottom: 10 }}>
              {t('IDS_DETAIL_PRO_SKILL')}
            </Typography.Title>
            <Information dataState={dataState} isReadOnly={false} />
          </Card>
          <Card style={{ marginTop: 15 }}>
            <DetailProSkillTable
              dataState={dataState}
              isReadOnly={false}
              versionId={state?.id || ''}
              setDataState={setDataState}
            />
          </Card>

          <Affix
            offsetBottom={0}
            style={{ paddingBottom: 10 }}
            onChange={(affixed) => {
              setIsAffixed(affixed);
            }}
          >
            <div className={isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
              <Row>
                {/* {dataState.dataSource?.status !== 2 && (
                  <Button
                    type="primary"
                    className="button-normal"
                    onClick={() =>
                      setNavigate(
                        location.pathname,
                        {
                          ...state,
                          edited: true,
                        },
                        true,
                      )
                    }
                    hidden={dataState.dataSource.publicStatus !== 1 || dataState.dataSource.editAlready}
                  >
                    {t('IDS_BUTTON_EDIT')}
                  </Button>
                )} */}
                <Button
                  type="primary"
                  onClick={() =>
                    window.open(
                      urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + `/pro-skill/history/${state?.id}`,
                      '_blank',
                    )
                  }
                  className="button-normal"
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginLeft: 'auto',
                  }}
                >
                  {t('IDS_HISTORY_APPROVE')}
                </Button>
              </Row>
            </div>
          </Affix>
        </>
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
    </>
  );
};

export default DetailProSkillScreenNotPublic;
