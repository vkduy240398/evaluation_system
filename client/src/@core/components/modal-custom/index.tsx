import Modal from 'antd/es/modal';
import { CSSProperties, FC, ReactNode } from 'react';
import Button from 'antd/es/button';
import { Space } from 'antd';
import Typography from 'antd/es/typography';
import React from 'react';
import { t } from 'i18next';

type DestroyOnCloseType = boolean | undefined;
type WidthType = string | number | undefined;
interface Props {
  isOpen: boolean;
  header: ReactNode;
  content: any;
  fnHandleOk: () => void;
  fnHandleCancel: () => void;
  footer?: ReactNode | null;
  width?: WidthType;
  okText?: string;
  cancelText?: string;
  isDestroyOnCloseType?: DestroyOnCloseType;
  bodyStyle?: CSSProperties | undefined;
  loading?: boolean | undefined;
  isCentered?: boolean;
}
const ModalCustomComponent: FC<Props> = ({
  isOpen,
  header,
  content,
  width,
  okText,
  cancelText,
  fnHandleOk,
  fnHandleCancel,
  footer,
  bodyStyle,
  loading,
  isCentered = false,
}) => {
  const [isLoading, setLoading] = React.useState(false);

  const handleOnOk = async () => {
    await setLoading(true);
    await fnHandleOk();
    await setLoading(false);
  };
  const handleOnCancel = () => {
    fnHandleCancel && fnHandleCancel();
  };

  const defaultFooter = () => {
    return (
      <Space size={12} align="start" style={{ width: '100%' }}>
        <Button key="submit" type="primary" size="middle" onClick={handleOnOk} loading={loading || isLoading} disabled={isLoading}>
          {okText || (t('IDS_BUTTON_SAVE') as string)}
        </Button>
        <Button
          size="middle"
          onClick={handleOnCancel}
          loading={loading || isLoading}
          disabled={isLoading}
        >
          {cancelText || (t('POPUP_DIALOG.BUTTON.CANCEL') as string)}
        </Button>
      </Space>
    );
  };

  return (
    <Modal
      style={{ top: 20 }}
      title={<Typography.Title level={4}>{header}</Typography.Title>}
      open={isOpen}
      width={width}
      destroyOnClose={true}
      okText={okText || 'Yes'}
      cancelText={cancelText || 'Cancel'}
      onOk={handleOnOk}
      onCancel={handleOnCancel}
      footer={footer === null ? null : defaultFooter()}
      bodyStyle={bodyStyle}
      maskClosable={false}
      centered={isCentered}
    >
      {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
      {content}
    </Modal>
  );
};

export default ModalCustomComponent;
