// Library imports
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { Dispatch, SetStateAction } from 'react';

// File imports
import { SkillOptions } from '../../../../page/admin-evaluation/setting-evaluation-pro/SettingTemplate';
import { AdminSettingSkillType } from '../../../../types/pages/admin-evaluation-pro/AdminEvaluationProType';
import EditSkillButton from '../EditSkillButton';
interface Props {
  onEditCallback: () => void;
  handleDeleteSkill: (skillId: number) => void;
  skillList: any[];
  setSkillOptions: Dispatch<SetStateAction<SkillOptions[]>>;
}

const adminEvaluationSkillsColumn = ({ onEditCallback, handleDeleteSkill, skillList, setSkillOptions }: Props) => {
  const onCell = () => ({ style: { verticalAlign: 'center' } });
  const columns: ColumnsType<AdminSettingSkillType> = [
    {
      title: t('IDS_TEMPLATE'),
      dataIndex: 'skillName',
      key: 'name',
      width: '20%',
      onCell,
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
      width: '20%',
      onCell,
    },
    {
      title: t('IDS_APPROVER_PRO_SKILL'),
      key: 'skillApprovers-key',
      dataIndex: 'skillApprovers',
      render(text: { fullName: string; id: number }[]) {
        if (text.length > 0) {
          const skillApprovers = text.map((v) => v.fullName);

          return skillApprovers.join('、');
        }

        return <></>;
      },
      width: '20%',
      onCell,
    },
    {
      title: t('IDS_TYPE_DIVISION_DEPARTMENT'),
      key: 'type-key',
      dataIndex: 'skillDepartments',
      width: '20%',
      onCell,
      render(text: { departmentId: string; departmentName: number }[]) {
        if (text.length > 0) {
          const departments = text.map((v) => v.departmentName);

          return departments.join('、');
        }

        return <></>;
      },
    },
    {
      title: ' ',
      key: 'action',
      dataIndex: 'action',
      width: '10%',
      align: 'center',
      onCell,
      render(_, record) {
        return (
          <Space>
            <EditSkillButton
              record={record}
              onEditCallback={onEditCallback}
              skillList={skillList}
              setSkillOptions={setSkillOptions}
            />

            <Button
              icon={<DeleteOutlined />}
              style={{ color: '#007240' }}
              onClick={() => handleDeleteSkill(record.skillId)}
            />
          </Space>
        );
      },
    },
  ];

  return columns;
};

export default adminEvaluationSkillsColumn;
