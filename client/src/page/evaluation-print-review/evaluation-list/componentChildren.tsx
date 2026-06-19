import ComponentPdf1_7 from '../common-component-pdf/componentPdf1-7';
import HeaderPdf from '../common-component-pdf/headerPdf';
import UserInformationPdf from '../common-component-pdf/userInformationPdf';
import ComponentPdf8_10 from '../common-component-pdf/componentPdf8-10';
interface Props {
  componentRef: any;
  dataSource: any;
}

const ComponentChildren: React.FC<Props> = (props: Props) => {
  const { componentRef, dataSource } = props;

  return (
    <div ref={componentRef}>
      <div style={{ padding: 35 }}>
        {(() => {
          const componentNodes = [];
          for (let i = 0; i < dataSource.length; i++) {
            const item = dataSource[i][0];
            if (item.level <= 7) {
              //** level 1-7 */
              componentNodes.push(
                <>
                  <HeaderPdf item={item} />
                  <UserInformationPdf item={item} />
                  <ComponentPdf1_7 item={item} />
                </>,
              );
            } else {
              // **level 8-10 */
              componentNodes.push(
                <>
                  <HeaderPdf item={item} />
                  <UserInformationPdf item={item} />
                  <ComponentPdf8_10 item={item} />
                </>,
              );
            }
          }

          return componentNodes;
        })()}
      </div>
    </div>
  );
};

export default ComponentChildren;
