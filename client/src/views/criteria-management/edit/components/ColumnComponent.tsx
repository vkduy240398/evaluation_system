import { Form, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Select from 'antd/lib/select';
import { t } from 'i18next';
interface Props {
  setDataSource: any;
  listPoints:
    | {
        point: number;
        id: number;
        note: string;
        versionId: number;
      }[]
    | [];
}
const ColumnComponent = (props: Props) => {
  const { setDataSource, listPoints } = props;
  const onCell = () => ({
    style: {
      wordBreak: 'break-word',
      verticalAlign: 'top',
    },
  });

  return [
    {
      title: ' ',
      key: 'sort',
      width: '2%',
    },
    Table.SELECTION_COLUMN,
    {
      title: t('IDS_ITEM'),
      dataIndex: 'title',
      key: 'title',
      width: 300,
      onCell,
      render: (_text: any, _record: any, index: number) => {
        return (
          <Form.Item
            name={`title${_record.id}`}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 100,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '100'),
              },
            ]}
            style={{ width: '100%', marginBottom: 0, display: 'block' }}
            className={`blockAntItem`}
            initialValue={_text}
          >
            <TextArea
              onChange={(e) => {
                const value = e.target.value;
                setDataSource(value, index, 'title');
              }}
              autoSize
              style={{ whiteSpace: 'pre-wrap' }}
              maxLength={101}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      key: 'content',
      onCell,
      render: (_text: any, _record: any, index: number) => {
        return (
          <Form.Item
            name={`content${_record.id}`}
            style={{ width: '100%', marginBottom: 0, display: 'block' }}
            className={`blockAntItem`}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 500,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500'),
              },
            ]}
            initialValue={_text}
          >
            <TextArea
              autoSize
              onChange={(e) => {
                const value = e.target.value;
                setDataSource(value, index, 'content');
              }}
              maxLength={501}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      align: 'center' as const,
      onCell,
      render: (_text: any, _record: any, index: number) => {
        return (
          <Form.Item
            name={`difficulty${_record.id}`}
            style={{ width: '100%', marginBottom: 0, display: 'block' }}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                validator(_rule, value) {
                  if (value) {
                    if (!listPoints.some((obj: any) => obj.value === value))
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_NOT_CORRECT_DATA') as string));
                  }

                  return Promise.resolve();
                },
              },
            ]}
            className={`blockAntItem`}
            initialValue={_text}
          >
            <Select
              style={{ textAlign: 'center', width: '100%' }}
              onChange={(value: any) => {
                setDataSource(value, index, 'difficulty');
              }}
              options={listPoints}
            />
          </Form.Item>
        );
      },
    },
  ];
};

export default ColumnComponent;
