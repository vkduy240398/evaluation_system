import { FC } from 'react';
import { Feedback, FeedbackType } from '../../../model/Feedback';
import Form from 'antd/lib/form';
import moment from 'moment/moment';
import Image from "antd/lib/image";

interface Props {
  feedback: Feedback;
}

const FeedbackDetail: FC<Props> = ({ feedback }) => {
  let feedbackType = '';
  switch (feedback.type) {
    case FeedbackType.REQUEST:
      feedbackType = 'Requirement';
      break;
    case FeedbackType.BUG:
      feedbackType = 'Bug';
      break;
  }

  return (
    <Form colon={false} labelAlign="left" labelCol={{ span: 1 }} style={{ width: '100%' }}>
      <Form.Item label="Subject" className="ant-form-item-info">
        {feedback.subject}
      </Form.Item>
      <Form.Item label="Type" className="ant-form-item-info">
        {feedbackType}
      </Form.Item>
      <Form.Item label="Description" className="ant-form-item-info">
        {feedback.description}
      </Form.Item>
      <Form.Item label="Sent time" className="ant-form-item-info">
        {moment(feedback.sendTime).format('YYYY/M/D HH:mm')}
      </Form.Item>
      <Form.Item label="Images" className="ant-form-item-info">
        <Image.PreviewGroup>
            {/* TODO: Replace with actual image */}
            <Image width="25%" src="https://www.geonet.co.jp/english/images/bnr/geonline.png" />
            <Image width="25%" src="https://www.geonet.co.jp/english/images/bnr/2ndstreet.png" />
            <Image width="25%" src="https://www.geonet.co.jp/english/images/bnr/bnr_vietnam.png" />
            <Image width="25%" src="https://www.geonet.co.jp/english/images/bnr/geonline.png" />
            <Image width="25%" src="https://www.geonet.co.jp/english/images/bnr/2ndstreet.png" />
            <Image width="25%" src="https://www.geonet.co.jp/english/images/bnr/bnr_vietnam.png" />
        </Image.PreviewGroup>
      </Form.Item>
    </Form>
  );
};

export default FeedbackDetail;
