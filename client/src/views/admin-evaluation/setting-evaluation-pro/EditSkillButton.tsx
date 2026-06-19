// Library imports
import { FormOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';

// File imports
import ModalCustomComponent from '../../../@core/components/modal-custom';
import { AdminSettingSkillType } from '../../../types/pages/admin-evaluation-pro/AdminEvaluationProType';
import SettingSkillPopup, { SettingSkillForm } from './SettingSkillPopup';
import { SkillOptions } from '../../../page/admin-evaluation/setting-evaluation-pro/SettingTemplate';

// Types
type Props = {
  record: AdminSettingSkillType;
  onEditCallback: () => void;
  skillList: any[];
  setSkillOptions: Dispatch<SetStateAction<SkillOptions[]>>;
};

const EditSkillButton = ({ record, onEditCallback, skillList, setSkillOptions }: Props) => {
  // Other hooks
  const { t } = useTranslation();

  // useState
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SettingSkillForm>();

  // Functional
  const handleCloseEditModal = () => {
    setSelectedSkill(undefined);
    setIsOpenEditModal(false);
  };

  return (
    <Fragment>
      <Button
        icon={<FormOutlined />}
        style={{ color: '#007240' }}
        onClick={() => {
          setIsOpenEditModal(true);
          setSelectedSkill({
            skillId: record.skillId,
            skillName: record.skillName,
            skillSetters: record.skillSetters.map((setter) => [setter.id]),
            skillApprovers: record.skillApprovers.map((approver) => [approver.id]),
            departments: record.skillDepartments
              .filter((department) => department.departmentType === 0)
              .map((dep) => [dep.departmentId]),
            divisions: record.skillDepartments
              .filter((department) => department.departmentType === 1)
              .map((dep) => [dep.departmentId]),
          });
        }}
      />

      <ModalCustomComponent
        isOpen={isOpenEditModal}
        header={t('IDS_EDIT_TEMPLATE_SKILL')}
        content={
          <SettingSkillPopup
            onCancel={handleCloseEditModal}
            onAddCallback={onEditCallback}
            selectedSkill={selectedSkill}
            skillList={skillList}
            setSkillOptions={setSkillOptions}
          />
        }
        fnHandleOk={() => {}}
        width={420}
        fnHandleCancel={handleCloseEditModal}
        okText={t('IDS_BUTTON_SAVE') as string}
        cancelText={t('POPUP_DIALOG.BUTTON.CANCEL') as string}
        footer={null}
        bodyStyle={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 150px)',
          maxWidth: 'calc(100vw - 100px)',
        }}
      />
    </Fragment>
  );
};

export default EditSkillButton;
