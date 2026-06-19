import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import Icon, { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { Button, Form, Input, Row, Typography } from 'antd';
import './LoginForm.css';
import { useAuth } from '../../hooks/useAuth';
import { t } from 'i18next';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { encrypt } from '../../common/util';

// const DEFAULT_ERROR = { message: '', isActive: false };
const DOMAIN = '@geonet.co.jp';

const LoginForm: React.FC = () => {
  // ** State
  const [isLoading, setLoading] = useState(false);

  // ** Hook
  const auth = useAuth();

  if (auth.user) {
    return <Navigate to={'/home'} />;
  }

  // ** Function
  const onFinish = async (values: any) => {
    const { email, password } = values;
    setLoading(true);
    await auth.login({ email: email + DOMAIN, password: encrypt(password, true) });
    setLoading(false);
  };

  const LockIconSvg = () => (
    <svg viewBox="0 0 24 24" width="4rem" height="4rem" fill="red">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
    </svg>
  );

  const LockIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={LockIconSvg} {...props} />;

  return (
    <Form
      name="login_form"
      initialValues={{ remember: true }}
      className="login-form"
      onFinish={onFinish}
      layout="horizontal"
    >
      <LockIcon />
      <Typography.Title level={2}>{t('IDS_TITLE_SYSTEM')}</Typography.Title>
      <Row justify="center" align="middle" style={{ paddingBottom: 7 }}>
        <Form.Item
          name="email"
          style={{ width: '25rem' }}
          rules={[
            { required: true, message: `${t('MESSAGE.COMMON.IDM_BLANK_ITEM')}` },
            { max: 30, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '30') },
          ]}
        >
          <Input
            name="email"
            placeholder={t('IDS_USERNAME').toString()}
            prefix={<UserOutlined />}
            style={{ height: 45 }}
            maxLength={31}
          />
        </Form.Item>
      </Row>

      <Row justify="center" align="middle" style={{ paddingBottom: 7 }}>
        <Form.Item
          name="password"
          style={{ width: '25rem' }}
          rules={[
            { required: true, message: `${t('MESSAGE.COMMON.IDM_BLANK_ITEM')}` },
            { max: 100, message: t('MESSAGE.COMMON.IDM_EXCEED_CHARACTER').replace('{maxLength}', '100') },
          ]}
        >
          <Input.Password
            name="password"
            placeholder={t('IDS_PASSWORD').toString()}
            prefix={<KeyOutlined />}
            style={{ height: 45 }}
            maxLength={101}
          />
        </Form.Item>
      </Row>

      <Row justify="center" align="middle">
        <Form.Item style={{ width: '25rem' }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: '#007240',
              height: '3rem',
            }}
            block
            className="button-normal"
            loading={isLoading}
          >
            {t('IDS_BUTTON_LOGIN')}
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};

export default LoginForm;
