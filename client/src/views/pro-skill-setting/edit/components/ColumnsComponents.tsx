import Icon, { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Table, Tooltip, Typography } from 'antd';
import { t } from 'i18next';
import TooltipNote from './TooltipNote';

type elements = {
  department: string;
  publicStatus: number;
  status: number;
  updated: string | null;
  version: string;
  versionId: number;
  children: any;
  reason: string | null;
};
interface Props {
  setDataSources: any;
  dataSources: elements;
  startTransition: any;
  sources: any;
  listPoints: {
    id: number;
    versionId: number;
    note: string;
    point: number;
  }[];
}
const ColumnsComponents = (props: Props) => {
  const { setDataSources, dataSources, startTransition, sources, listPoints } = props;

  const { TextArea } = Input;

  const onCell = () => ({ style: { verticalAlign: 'top' } });

  return [
    {
      title: ' ',
      key: 'sort',
      width: '2%',
      align: 'center' as const,
    },
    Table.SELECTION_COLUMN,
    {
      title: t('IDS_JOB_TYPE'),
      dataIndex: 'jobType',
      key: 'jobType',
      width: '10%',
      onCell,
      render: (_text: any, record: any, index: number) => {
        return (
          <Form.Item
            name={`jobType${record.itemId}`}
            style={{ margin: 0 }}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 50,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '50'),
              },
              {
                pattern: /.*\S.*/, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()
              }
            ]}
            initialValue={_text}
          >
            <TextArea
              autoSize
              maxLength={51}
              onChange={(e) => {
                const value = e.target.value;
                dataSources.children[index] = { ...dataSources.children[index], jobType: value };

                startTransition(() => {
                  setDataSources({
                    ...sources,
                    data: {
                      ...dataSources,
                    },
                  });
                });
              }}
            />
          </Form.Item>
        );
      },
    },

    // Table.SELECTION_COLUMN,

    {
      title: t('IDS_LARGE_MEDIUM_CATEGORY'),
      dataIndex: 'mediumClass',
      key: 'mediumClass',
      width: '10%',
      onCell,
      render: (_text: any, record: any, index: number) => {
        return (
          <Form.Item
            name={`mediumClass${record.itemId}`}
            style={{ margin: 0 }}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 50,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '50'),
              },
              {
                pattern: /.*\S.*/, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()
              }
            ]}
            initialValue={_text}
          >
            <TextArea
              autoSize
              maxLength={51}
              onChange={(e) => {
                const value = e.target.value;
                dataSources.children[index] = { ...dataSources.children[index], mediumClass: value };
                startTransition(() => {
                  setDataSources({
                    ...sources,
                    data: {
                      ...dataSources,
                    },
                  });
                });
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_SMALL_CATEGORY'),
      dataIndex: 'smallClass',
      key: 'smallClass',
      width: '10%',
      onCell,
      render: (_text: any, record: any, index: number) => {
        return (
          <Form.Item
            name={`smallClass${record.itemId}`}
            style={{ margin: 0 }}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 50,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '50'),
              },
              {
                pattern: /.*\S.*/, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()
              }
            ]}
            initialValue={_text}
          >
            <TextArea
              autoSize
              maxLength={51}
              onChange={(e) => {
                const value = e.target.value;
                dataSources.children[index] = { ...dataSources.children[index], smallClass: value };
                startTransition(() => {
                  setDataSources({
                    ...sources,
                    data: {
                      ...dataSources,
                    },
                  });
                });
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_EVALUATION_CONTENT'),
      dataIndex: 'content',
      key: 'content',
      width: '20%',
      onCell,
      render: (_text: any, record: any, index: number) => {
        return (
          <Form.Item
            name={`content${record.itemId}`}
            style={{ margin: 0 }}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                max: 500,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500'),
              },
              {
                pattern: /.*\S.*/, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString()
              }
            ]}
            initialValue={_text}
          >
            <TextArea
              autoSize
              maxLength={501}
              onChange={(e) => {
                const value = e.target.value;
                dataSources.children[index] = { ...dataSources.children[index], content: value };
                startTransition(() => {
                  setDataSources({
                    ...sources,
                    data: {
                      ...dataSources,
                    },
                  });
                });
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: t('IDS_DIFFICULTY'),
      dataIndex: 'difficulty',
      key: 'difficulty',
      align: 'center' as const,
      width: '5%',
      onCell,
      render: (_text: any, record: any, index: number) => {
        return (
          <Form.Item
            name={`difficulty${record.itemId}`}
            style={{ margin: 0, textAlign: 'left' }}
            rules={[
              { required: true, message: t('MESSAGE.COMMON.IDM_BLANK_ITEM').toString() },
              {
                validator(_rule, value) {
                  if (value) {
                    if (!listPoints.some((obj: any) => obj.point === value))
                      return Promise.reject(new Error(t('MESSAGE.COMMON.IDM_NOT_CORRECT_DATA') as string));
                  }

                  return Promise.resolve();
                },
              },
            ]}
            initialValue={_text}
          >
            <Select
              style={{ textAlign: 'center' }}
              options={listPoints.map((v) => ({ label: v.point, value: v.point }))}
              onChange={(value) => {
                dataSources.children[index] = { ...dataSources.children[index], difficulty: value };
                startTransition(() => {
                  setDataSources({
                    ...sources,
                    data: {
                      ...dataSources,
                    },
                  });
                });
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: (
        <>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography.Title
              level={5}
              style={{
                color: '#fff',
                margin: 0,
                fontSize: 14,
              }}
            >
              {t('IDS_EVALUATION_CRITERIA')}
            </Typography.Title>
            <Tooltip title={<TooltipNote />} color="#424242" overlayInnerStyle={{ fontSize: '11px' }}>
              <Icon
                component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                style={{ color: '#fff', fontSize: 18, marginLeft: '7px' }}
              />
            </Tooltip>
          </div>
        </>
      ),
      dataIndex: 'note',
      key: 'note',
      width: '20%',
      onCell,
      render: (_text: any, record: any, index: number) => {
        return (
          <Form.Item
            name={`note${record.itemId}`}
            style={{ margin: 0 }}
            rules={[
              {
                max: 500,
                message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '500'),
              },
            ]}
            initialValue={_text}
          >
            <TextArea
              autoSize
              maxLength={501}
              onChange={(e) => {
                const value = e.target.value;
                dataSources.children[index] = { ...dataSources.children[index], note: value };
                startTransition(() => {
                  setDataSources({
                    ...sources,
                    data: {
                      ...dataSources,
                    },
                  });
                });
              }}
            />
          </Form.Item>
        );
      },
    },
  ];
};

export default ColumnsComponents;
