import Button from 'antd/es/button';
import Space from 'antd/es/space';
import { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { t } from 'i18next';
interface ColumnProps {
  id: any;
  groupName: string;
  departmentArrString: string;
}

interface Props {
  handleOpenDeletePopup: (id: any) => void;
  handleEditGroup: (data: any) => void;
}
const groupDepartmentColumn = ({ handleOpenDeletePopup, handleEditGroup }: Props) => {
  const columns: ColumnsType<ColumnProps> = [
    {
      title: t('IDS_GROUP_NAME'),
      width: '30%',
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: t('IDS_TYPE_DEPARTMENT_NAME'),
      dataIndex: 'departmentArrString',
      key: 'departmentArrString',
    },
    {
      title: ' ',
      width: '10%',
      key: 'action',
      align: 'center' as const,
      render(_, record) {
        return (
          <Space>
            <Button icon={<FormOutlined />} style={{ color: '#007240' }} onClick={() => handleEditGroup(record)} />

            <Button
              icon={<DeleteOutlined />}
              style={{ color: '#007240' }}
              onClick={() => handleOpenDeletePopup(record.id)}
            />
          </Space>
        );
      },
    },
  ];

  return columns;
};

export default groupDepartmentColumn;
