import Row from 'antd/es/row';
import Spin from 'antd/es/spin';

const LoadingScreenComponent = () => {
  return (
    <Row justify={'center'} style={{ height: '100%', width: '100%' }} align="middle">
      <Spin size="large" />
    </Row>
  );
};

export default LoadingScreenComponent;
