import { Button, Modal, Row, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { t } from 'i18next';

interface Props {
  isOpenPopup: boolean;
  setOpenPopup: (data: boolean) => void;
  tableSkill?: any;
  setTableSkill?: any;
}

export default function ShowMoreSkillUserPopUp(props: Props) {
  const { isOpenPopup, setOpenPopup, tableSkill, setTableSkill } = props;

  const handleClose = () => {
    setTableSkill([]);
    setOpenPopup(false);
  };

  const columns: TableProps<any>['columns'] = [
    {
      title: t('IDS_TEMPLATE'),
      dataIndex: 'skillName',
      key: 'skillName',
      width: '12%',
      render: (text: any, record: any, _index: any) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },
  ];

  return (
    <div>
      <Modal
        title={<Typography.Title level={3}>{t('IDS_TEMPLATE_LIST')}</Typography.Title>}
        width={'50%'}
        destroyOnClose={true}
        maskClosable={false}
        open={isOpenPopup}
        onCancel={handleClose}
        footer={null}
        centered
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)', maxWidth: 'calc(100vw - 50px)' }}
      >
        {/* <Form.Item label={t('IDS_FULLNAME')} className="ant-form-item-info">
          <Typography.Text>{userInfor}</Typography.Text>
        </Form.Item> */}
        <Table rowKey={(record) => record.id} dataSource={tableSkill} columns={columns} pagination={false} bordered />
        <Row>
          <Button onClick={handleClose} className="cancel_button" style={{ marginTop: 10, marginLeft: 5 }}>
            {t('IDS_BUTTON_CLOSE')}
          </Button>
        </Row>
      </Modal>
    </div>
  );
}
