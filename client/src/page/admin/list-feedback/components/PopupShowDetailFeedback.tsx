import { Button, Col, Form, Image, Modal, Row, Typography } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import image1 from '../data/1.png';
import image2 from '../data/2.png';
import image3 from '../data/3.png';

interface Props {
  isOpen: boolean;
  setIsOpen: any;
  userSelected: any;
  setUserSelected: any;
}

const previewProps = {
  mask: <div>Click to view</div>,
  movable: false,
};

const PopupShowDetailFeedback = (props: Props) => {
  const { isOpen, userSelected, setUserSelected, setIsOpen } = props;

  return (
    <>
      <div>
        <Modal
          bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
          title={<Typography.Title level={4}>{t('IDS_POPUP_DETAIL_FEEDBACK')}</Typography.Title>}
          open={isOpen}
          footer={null}
          style={{ top: 20 }}
          width="90%"
          maskClosable={false}
          onCancel={() => setIsOpen(false)}
          centered
        >
          <Form
            labelAlign="left"
            colon={false}
            requiredMark={false}
            labelCol={{ span: 1 }}
            wrapperCol={{ xs: { span: 24 }, sm: { span: 12 } }}
          >
            <Form.Item
              label={t('IDS_TYPE_FEEDBACK')}
              className="ant-form-item-info"
            >{`${userSelected?.typeFeedback}`}</Form.Item>
            <Form.Item label={t('IDS_SUBJECT')} className="ant-form-item-info">{`${userSelected?.subject}`}</Form.Item>
            <Form.Item label={t('IDS_CONTENT')} className="ant-form-item-info">{`${userSelected?.content}`}</Form.Item>
            <Form.Item
              label={t('IDS_USER')}
              className="ant-form-item-info"
            >{`${userSelected?.userId}: ${userSelected?.fullName}`}</Form.Item>
            <Form.Item label={t('IDS_TIME_CREATED')} className="ant-form-item-info">{`${
              userSelected.timeCreated ? moment(userSelected?.timeCreated).format('YYYY/M/D H:mm') : ''
            }`}</Form.Item>
            <Form.Item label={t('IDS_IMAGES')} className="ant-form-item-info">
              <Row gutter={[4, 4]}>
                <Col span={8}>
                  <Image src={image1} />
                </Col>
                <Col span={8}>
                  <Image src={image1} />
                </Col>
                <Col span={8}>
                  <Image src={image1} />
                </Col>
              </Row>
              <Row gutter={[4, 4]}>
                <Col span={8}>
                  <Image src={image2} />
                </Col>
                <Col span={8}>
                  <Image src={image2} />
                </Col>
                <Col span={8}>
                  <Image src={image2} />
                </Col>
              </Row>
              <Row gutter={[4, 4]}>
                <Col span={8}>
                  <Image src={image3} />
                </Col>
                <Col span={8}>
                  <Image src={image3} />
                </Col>
                <Col span={8}>
                  <Image src={image3} />
                </Col>
              </Row>
              <Row gutter={[4, 4]}>
                <Col span={8}>
                  <Image src={image1} />
                </Col>
                <Col span={8}>
                  <Image src={image2} />
                </Col>
                <Col span={8}>
                  <Image src={image3} />
                </Col>
              </Row>
            </Form.Item>
          </Form>
          <Row>
            <Button
              onClick={() => {
                setIsOpen(false);
              }}
              className="cancel_button"
              style={{ marginTop: 10, marginLeft: 5 }}
            >
              {t('IDS_BUTTON_CLOSE')}
            </Button>
          </Row>
        </Modal>
      </div>
    </>
  );
};

export default PopupShowDetailFeedback;
