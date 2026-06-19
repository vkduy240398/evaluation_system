import { ColumnsType } from 'antd/es/table';
import { AdminEvaluationProResType } from '../../../../types/pages/admin-evaluation-pro/AdminEvaluationProType';
import { Button, Space } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { t } from 'i18next';
interface Props {
  handleEditProSkill: (record: any) => void;
}

const adminEvaluationProColumn = ({ handleEditProSkill }: Props) => {
  const onCell = () => ({ style: { verticalAlign: 'center' } });
  const columns: ColumnsType<AdminEvaluationProResType> = [
    {
      title: t('IDS_TYPE_DEPARTMENT_NAME'),
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: '25%',
      onCell,
    },
    {
      title: t('IDS_CATEGORIES'),
      dataIndex: 'typeD',
      key: 'departmentCategory',
      width: '10%',
      onCell,
      render(type) {
        let typeStr = '';

        switch (type) {
          case 0: // Department
            typeStr = t('IDS_TYPE_DEPARTMENT');
            break;
          case 1: // Division
            typeStr = t('IDS_TYPE_DIVISION');
            break;
          case 2: // Group
            typeStr = t('IDS_TYPE_GROUP');
            break;
          default:
            break;
        }

        return <>{typeStr}</>;
      },
    },
    {
      title: t('IDS_SETTER_PRO_SKILL'),
      key: 'skillSetters-key',
      dataIndex: 'skillSetters',
      render(text: { fullName: string; id: number }[]) {
        if (text.length > 0) {
          const skillSetters = text.map((v) => v.fullName);

          return skillSetters.join('、');
        }

        return <></>;
      },
      width: '25%',
      onCell,
    },
    {
      title: t('IDS_APPROVER_PRO_SKILL'),
      key: 'skillApprovers-key',
      dataIndex: 'skillApprovers',
      render(text: { fullName: string; id: number }[]) {
        if (text.length > 0) {
          const skillSetters = text.map((v) => v.fullName);

          return skillSetters.join('、');
        }

        return <></>;
      },
      width: '25%',
      onCell,
    },
    {
      title: t('IDS_GROUP_TYPE'),
      key: 'type-key',
      dataIndex: 'type',
      width: '20%',
      onCell,
      render(text, record) {
        if (record.typeD === 0) {
          return text;
        }
      },
    },
    {
      title: ' ',
      key: 'action',
      dataIndex: 'action',
      width: '20%',
      align: 'center',
      onCell,
      render(_, record) {
        if (record.typeD === 0)
          return (
            <Space>
              <Button icon={<FormOutlined />} style={{ color: '#007240' }} onClick={() => handleEditProSkill(record)} />
            </Space>
          );
      },
    },
  ];

  return columns;
};

export default adminEvaluationProColumn;
