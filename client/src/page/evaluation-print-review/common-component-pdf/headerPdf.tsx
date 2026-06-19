import React from 'react';
import { Image, Typography } from 'antd';
interface Props {
  item: any;
}

const HeaderPdf: React.FC<Props> = (props: Props) => {
  const { item } = props;

  return (
    <div>
      <Image src={item?.header?.logo} />
      <Typography.Title level={3} style={{ textAlign: 'center' }}>
        {item?.header?.titleHeader}
      </Typography.Title>
    </div>
  );
};

export default HeaderPdf;
