// Library imports
import { Button } from 'antd';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

// File imports
import ModalCustomComponent from '../../../@core/components/modal-custom';
import SettingSkillPopup from './SettingSkillPopup';

// Types
type Props = {
  onAddCallback: () => void;
  isLoading: boolean;
  skillList: any[];
};

const AddSkillButton = ({ onAddCallback, isLoading, skillList }: Props) => {
  // Other hooks
  const { t } = useTranslation();

  // useState
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const handleCloseAddModal = () => setIsOpenAddModal(false);

  return (
    <Fragment>
      <Button
        type="primary"
        className="main_button"
        style={{ marginBottom: 15 }}
        onClick={() => setIsOpenAddModal(true)}
        loading={isLoading}
      >
        {t('IDS_ADD')}
      </Button>

      <ModalCustomComponent
        isOpen={isOpenAddModal}
        header={t('IDS_ADD_TEMPLATE_SKILL')}
        content={
          <SettingSkillPopup onCancel={handleCloseAddModal} onAddCallback={onAddCallback} skillList={skillList} />
        }
        fnHandleOk={() => {}}
        width={420}
        fnHandleCancel={handleCloseAddModal}
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

export default AddSkillButton;
