import { Button, Row } from 'antd';
import { t } from 'i18next';
import { DataValues } from '../../../../page/admin/criterion-management/interfaces/InterfacesProps';
interface Props {
  cloneBlankInput: () => void;
  cloneRecord: () => void;
  dataSources: DataValues;
  selectedRowKeys: any;
  setDataSources: any;
  setSelectRowsKeys: any;
  setSelectRecord: any;
  isPending: boolean;
  isLoading: boolean;
}
const ButtonTableComponent = (props: Props) => {
  const {
    cloneBlankInput,
    cloneRecord,
    dataSources,
    selectedRowKeys,
    setDataSources,
    setSelectRowsKeys,
    setSelectRecord,
    isPending,
    isLoading,
  } = props;

  return (
    <>
      <Row
        style={{
          marginTop: 15,
          flexWrap: 'wrap',
          display: 'flex',
          alignItems: 'baseline',
          gap: 5,
        }}
      >
        <Button
          type="primary"
          className="button-normal"
          disabled={isPending || isLoading}
          loading={isPending || isLoading}
          onClick={cloneBlankInput}
          size="middle"
        >
          {t('IDS_BUTTON_ADD_ROW')}
        </Button>
        <Button
          type="primary"
          className="button-normal"
          disabled={isPending || isLoading}
          loading={isPending || isLoading}
          onClick={cloneRecord}
          size="middle"
        >
          {t('IDS_BUTTON_ADD_COPY_ROW')}
        </Button>
        <Button
          type="primary"
          size="middle"
          className="button-normal"
          onClick={async () => {
            const dataList = dataSources.data.children.filter((item: any) => !selectedRowKeys.includes(item.key));

            setDataSources({
              ...dataSources,
              subVersion: dataSources.subVersion,
              data: {
                ...dataSources.data,
                children: dataList,
              },
            });
            setSelectRowsKeys([]);
            setSelectRecord([]);
          }}
          disabled={selectedRowKeys.length <= 0 || isPending}
          loading={isPending}
        >
          {t('IDS_DELETE')}
        </Button>
      </Row>
    </>
  );
};

export default ButtonTableComponent;
