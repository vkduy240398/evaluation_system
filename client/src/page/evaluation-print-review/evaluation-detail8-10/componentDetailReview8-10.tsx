import React from 'react';
import HeaderPdf from '../common-component-pdf/headerPdf';
import UserInformationPdf from '../common-component-pdf/userInformationPdf';
import ComponentPdf8_10 from '../common-component-pdf/componentPdf8-10';

interface Props {
  componentRef: any;
  dataSource: any;
}

const ComponentDetailReview810: React.FC<Props> = (props: Props) => {
  const { componentRef, dataSource } = props;

  return (
    <div ref={componentRef}>
      <div style={{ padding: 35 }}>
        {(() => {
          const componentNodes = [];
          for (let i = 0; i < dataSource.length; i++) {
            const item = dataSource[i][0];
            componentNodes.push(
              <>
                <HeaderPdf item={item} />
                <UserInformationPdf item={item} />
                <ComponentPdf8_10 item={item} />
              </>,
            );
          }

          return componentNodes;
        })()}
      </div>
    </div>
  );
};

export default ComponentDetailReview810;
