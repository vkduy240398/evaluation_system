import { Modal, Typography } from 'antd';
import { MetaModal } from '../model/MetalModel';
import { ReactNode } from 'react';

interface Props {
  metaModal: MetaModal;
  setMetaModal: React.Dispatch<React.SetStateAction<MetaModal>>;
  FormModal: any;
  bodyStyle?: any;
  width?: any;
  footer?: ReactNode;
}

const ModalPopup: React.FC<Props> = (props: Props) => {
  const handleClose = () => {
    props.setMetaModal({ ...props.metaModal, isOpen: false });
  };

  const formModal = props.FormModal;

  return (
    <Modal
      destroyOnClose={true}
      open={props.metaModal.isOpen}
      title={<Typography.Title level={4}>{props.metaModal.title}</Typography.Title>}
      centered
      width={props.width}
      onCancel={handleClose}
      footer={props.footer ? props.footer : null}
      bodyStyle={props.bodyStyle}
      maskClosable={false}
    >
      {formModal}
    </Modal>
  );
};

export default ModalPopup;
