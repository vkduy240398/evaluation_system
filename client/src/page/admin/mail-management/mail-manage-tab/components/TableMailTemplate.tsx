import Icon, { FormOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Table, Tooltip } from 'antd';
import { t } from 'i18next';
import React from 'react';

interface Props {
  dataSources: any;
  isLoading: any;
  handleEditMailTemplate: (r: any) => void;
}

const TableMailTemplate: React.FC<Props> = (props: Props) => {
  const { dataSources, isLoading, handleEditMailTemplate } = props;
  const templateType = {
    0: t('IDS_TYPE_MANUAL'),
    1: t('IDS_TYPE_AUTO')
  } as any;

  const columns = [
    {
      title: t('IDS_TEMPLATE'),
      dataIndex: 'name',
      width: '25%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{record.name}</div>;
      },
    },
    {
      title: t('IDS_TYPE_MAIL'),
      dataIndex: 'type',
      width: '100px',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'center' }}>{templateType[record.type]}</div>;
      },
    },
    {
      title: t('IDS_EXPLANATION'),
      dataIndex: 'note',

      // width: '5%',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{_text}</div>;
      },

      // render: (_text: any, record: any, _index: any) => {
      //   return <div style={{ textAlign: 'center' }}>
      //     <Tooltip
      //             title={record.note}
      //             color="#424242"
      //             overlayInnerStyle={{ fontSize: '11px' }}
      //           >
      //             <Icon
      //               component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
      //               style={{ color: '#6e5b14', fontSize: 18, marginTop: 2, cursor: 'default' }}
      //             />
      //           </Tooltip>
      //     </div>;
      // },
    },
    {
      title: t('IDS_ACTION'),
      dataIndex: 'action',
      width: '100px',
      align: 'center' as const,
      render: (_text: any, record: any, _index: any) => {
        return (
          <Button
            icon={<FormOutlined />}
            style={{ color: '#007240 ' }}
            onClick={async (event) => {
              event.stopPropagation();
              handleEditMailTemplate(record);
            }}
          />
        );
      },
    },
  ];

  return (
    <>
      <Table
        bordered
        rowKey={(row) => row.id}
        columns={columns}
        dataSource={dataSources}
        pagination={false}
        loading={isLoading}
        style={{ marginTop: 20 }}
        locale={{
          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
        }}
      />
    </>
  );
};

export default TableMailTemplate;
