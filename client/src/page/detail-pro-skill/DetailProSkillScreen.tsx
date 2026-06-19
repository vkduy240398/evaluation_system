import { Spin } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import proSetting from '../../common/api/pro-setting';
import { t } from 'i18next';
import { DataState } from '../../model/DataState';
import { decrypt } from '../../common/util';
import message from 'antd/lib/message';
import DetailProSkillHeadBlock from './components/DetailProSkillHeadBlock';
import DetailProSkillSecondBlock from './components/DetailProSkillSecondBlock';

const defaultDataState: DataState<any> = {
  dataSource: {},
  dataTable: [], // dùng cho search trên column header
};

interface Props {
  isReadOnly?: boolean;
  rolePath?: string;
}

const DetailProSkillScreen = (props: Props) => {
  const navigate = useNavigate();
  const { isReadOnly, rolePath } = props;
  const location = useLocation();
  const state = location.state;
  const { id } = useParams();
  const [dataState, setDataState] = useState(defaultDataState);
  const [isLoading, setLoading] = useState(false);
  const [isAffixed, setIsAffixed] = useState<boolean>();

  const url = `/api/v1/${rolePath ? rolePath + '/detail-pro-skill-public' : 'f3/pro-setting/detail-pro-skill'}`;

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
    if (!state || state === null) {
      if (decrypt(id?.toString() || '') === undefined) {
        navigate('/404page');
      }
    }
    if (state !== null) {
      proSetting.detailProSkill(url, state?.id, isReadOnly, dataCallback, errorCallback);
    }
  }, [state?.id]);

  return (
    <>
      {!isLoading ? (
        <>
          <DetailProSkillHeadBlock
            dataState={dataState}
            isReadOnly={isReadOnly!}
            state={state}
            setDataState={setDataState}
          />
          <DetailProSkillSecondBlock
            isAffixed={isAffixed!}
            setIsAffixed={setIsAffixed}
            dataState={dataState}
            isReadOnly={props.isReadOnly!}
            navigate={navigate}
            state={state}
          />
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

export default DetailProSkillScreen;
