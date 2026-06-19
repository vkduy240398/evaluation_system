import { Card, Typography } from 'antd';
import { Form } from 'antd/lib';
import { t } from 'i18next';

interface Props {
  feedbackInfo: any;
}
const UserInforSystemAdmin: React.FC<Props> = (props: Props) => {
  const { feedbackInfo } = props;
  const userPost = feedbackInfo?.feedbackDetail?.userPost;

  return (
    <div>
      <Card>
        <Typography.Title level={5}>{t('IDS_FEEDBACK_USER_INFO')}</Typography.Title>
        <Form labelAlign="left" labelCol={{ span: 1 }} colon={false} requiredMark={false}>
          <Form.Item colon={false} label={t('IDS_COMPANY')}>
            <Typography.Text>{userPost?.company?.name}</Typography.Text>
          </Form.Item>
          <Form.Item colon={false} label={t('IDS_TYPE_DIVISION')}>
            <Typography.Text>
              {userPost?.leve < 8 ? userPost?.deparment?.name : userPost?.division?.name}
            </Typography.Text>
          </Form.Item>
          <Form.Item colon={false} label={t('IDS_FEEDBACK_USER_NAME')}>
            <Typography.Text>{userPost?.fullName + ': ' + userPost?.email}</Typography.Text>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default UserInforSystemAdmin;
