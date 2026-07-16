import { Affix, Button, Row } from 'antd';
import { t } from 'i18next';
import { Dispatch, SetStateAction } from 'react';
import { DataState } from '../../../model/DataState';
import { NavigateFunction } from 'react-router-dom';
import { urlCompanyCode } from '../../../common/util';

interface Props {
  isAffixed: boolean;
  setIsAffixed: Dispatch<SetStateAction<boolean | undefined>>;
  dataState: DataState<any>;
  isReadOnly: boolean;
  navigate: NavigateFunction;
  state: any;
}

const DetailProSkillSecondBlock = (props: Props) => {
  return (
    <Affix
      offsetBottom={0}
      style={{ paddingBottom: 10 }}
      onChange={(affixed) => {
        props.setIsAffixed(affixed);
      }}
    >
      <div className={props.isAffixed ? 'evaluation-sider-affixed' : 'evaluation-sider'}>
        <Row>
          {props.dataState.dataSource?.status !== 2 && !props.isReadOnly && (
            <Button
              type="primary"
              className="button-normal"
              onClick={() => {
                props.navigate(urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + `/detail-pro-skill/edit`, {
                  state: {
                    id: props.dataState.dataSource.versionId || props.dataState.dataSource.id,
                  },
                });
              }}
              hidden={props.dataState.dataSource.publicStatus !== 1}
            >
              {t('IDS_EDIT')}
            </Button>
          )}
          <Button
            type="primary"
            onClick={() =>
              window.open(
                urlCompanyCode() + '/' + window.location.pathname.split('/')[3] + `/pro-skill/history/${props.state?.id}`,
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
  );
};

export default DetailProSkillSecondBlock;
