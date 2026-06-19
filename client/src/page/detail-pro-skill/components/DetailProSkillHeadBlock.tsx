import { Card, Typography } from 'antd';
import Information from '../../../views/pro-skill-setting/detail-pro-skill/Information';
import { t } from 'i18next';
import DetailProSkillTable from '../../../views/pro-skill-setting/detail-pro-skill/DetailProSkillTable';
import { DataState } from '../../../model/DataState';

interface Props {
  dataState: DataState<any>;
  isReadOnly: boolean;
  state: any;
  setDataState: any;
}

const DetailProSkillHeadBlock = (props: Props) => {
  return (
    <>
      <Card>
        <Typography.Title level={3} style={{ paddingBottom: 10 }}>
          {t('IDS_DETAIL_PRO_SKILL')}
        </Typography.Title>
        <Information dataState={props.dataState} isReadOnly={props.isReadOnly} />
      </Card>
      <Card style={{ marginTop: 15 }}>
        <DetailProSkillTable
          dataState={props.dataState}
          isReadOnly={props.isReadOnly!}
          versionId={props.state?.id || ''}
          setDataState={props.setDataState}
        />
      </Card>
    </>
  );
};

export default DetailProSkillHeadBlock;
