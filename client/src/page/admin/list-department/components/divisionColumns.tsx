import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { t } from 'i18next';
import { DivisionInfo } from '../interfaces/interfaces';

interface Props {
  type: number;
  handleOpenPopupEdit: (data: DivisionInfo) => void;
  handleOpenPopupConfirm: (data: DivisionInfo) => void;
}
const DivisionColumns = (props: Props) => {
  const { type, handleOpenPopupEdit, handleOpenPopupConfirm } = props;
  const columns = [
    // {
    //   title: type === 1 ? t('IDS_DIVISION_CODE') : t('IDS_DEPART_CODE'),
    //   dataIndex: 'department_code',
    //   align: 'center' as const,
    //   render: (_text: string, record: DivisionInfo, _index: number) => {
    //     return <div style={{ textAlign: 'left', width: 150 }}>{record.code}</div>;
    //   },
    // },
    {
      title: type === 1 ? t('IDS_TYPE_DIVISION_NAME') : t('IDS_TYPE_DEPARTMENT_NAME'),
      dataIndex: 'department_name',
      align: 'center' as const,
      render: (_text: string, record: DivisionInfo, _index: number) => {
        return <div style={{ textAlign: 'left' }}>{record.name}</div>;
      },
    },

    // {
    //   title: t('IDS_CATEGORIES'),
    //   dataIndex: 'category',
    //   align: 'center' as const,
    //   render: (_text: any, record: any, _index: any) => {
    //     return (
    //       <div style={{ textAlign: 'left' }}>
    //         {record.type === 0 ? t('IDS_TYPE_DEPARTMENT') : t('IDS_TYPE_DIVISION')}
    //       </div>
    //     );
    //   },
    // },
    {
      title: t('IDS_CLASSIFICATION'),
      dataIndex: 'classification',
      align: 'center' as const,
      render: (_text: string, record: DivisionInfo, _index: number) => {
        return (
          <div style={{ textAlign: 'left' }}>
            {record.class === 0
              ? t('IDS_ORACLE_DEPARTMENT')
              : t('IDS_CREATE_MANUAL')}
          </div>
        );
      },
    },
    {
      title: ' ',
      dataIndex: 'action',
      key: 'action',
      width: '70px',
      align: 'center' as const,
      render: (_text: string, record: DivisionInfo, _index: number) => {
        return (
          <Space>
            <Button

              // disabled={record.class === 0}
              icon={<FormOutlined />}
              style={{ color: '#007240' }}
              onClick={(event) => {
                handleOpenPopupEdit(record);
                event.stopPropagation();
              }}
            />
            <Button
              icon={<DeleteOutlined />}
              style={{ color: '#007240' }}
              onClick={(event) => {
                handleOpenPopupConfirm(record);
                event.stopPropagation();
              }}
            />
          </Space>
        );
      },
    },
  ];

  return columns;
};
export default DivisionColumns;
