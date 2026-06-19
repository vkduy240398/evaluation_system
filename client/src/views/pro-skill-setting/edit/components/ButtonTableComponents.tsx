import { Button, Row } from 'antd';
import { t } from 'i18next';
import { DataSourceEditProSkill } from '../../../../page/detail-pro-skill/interfaces/Interfaces';
import { memo } from 'react';
interface Props {
  breaks: any;
  isLoading: boolean;
  cloneBlankInput: () => void;
  cloneRecord: () => void;
  setDataSources: any;
  setSelectRowsKeys: any;
  setSelectRecord: any;
  selectedRowKeys: any;
  dataSources: DataSourceEditProSkill;
}
const ButtonTableComponents = (props: Props) => {
  const {
    breaks,
    isLoading,
    cloneBlankInput,
    cloneRecord,
    setDataSources,
    setSelectRowsKeys,
    setSelectRecord,
    selectedRowKeys,
    dataSources,
  } = props;

  return (
    <>
      <Row
        style={{
          marginTop: 15,
          marginBottom: breaks.xs ? 15 : 0,
          flexWrap: 'wrap',
          display: 'flex',
          alignItems: 'baseline',
          gap: 5,
        }}
      >
        <Button
          type="primary"
          className="button-normal"
          loading={isLoading}
          disabled={isLoading}
          onClick={cloneBlankInput}
        >
          {t('IDS_BUTTON_ADD_ROW')}
        </Button>
        <Button type="primary" loading={isLoading} disabled={isLoading} className="button-normal" onClick={cloneRecord}>
          {t('IDS_BUTTON_ADD_COPY_ROW')}
        </Button>
        <Button
          type="primary"
          className="button-normal"
          onClick={async () => {
            const dataList = dataSources.data.children.filter((item: any) => !selectedRowKeys.includes(item.key));

            setDataSources({
              ...dataSources,
              data: {
                ...dataSources.data,
                children: [...dataList],
              },
            });
            setSelectRowsKeys([]);
            setSelectRecord([]);
          }}
          disabled={selectedRowKeys.length <= 0 || isLoading}
        >
          {t('IDS_DELETE')}
        </Button>
      </Row>
    </>
  );
};

export default memo(
  ButtonTableComponents,
  (prev, next) =>
    !(
      prev.selectedRowKeys !== next.selectedRowKeys ||
      prev.dataSources.data.children.length !== next.dataSources.data.children.length ||
      prev.isLoading !== next.isLoading
    ),
);
