/* eslint-disable complexity */
import { Table, Image, Typography, Form } from 'antd';
import { t } from 'i18next';
import { ColumnPDF17 } from '../common-component-pdf/columnPDF17';
import { ColumnPDF810 } from '../common-component-pdf/columnPDF810';
import ComponentPdf1_7 from '../common-component-pdf/componentPdf1-7';
import HeaderPdf from '../common-component-pdf/headerPdf';
import UserInformationPdf from '../common-component-pdf/userInformationPdf';
import ComponentPdf8_10 from '../common-component-pdf/componentPdf8-10';
interface Props {
  componentRef: any;
  dataSource: any;
  summaryData: any;
  sameLevel: any;
  multiLevel: any;
}

const ComponentParent: React.FC<Props> = (props: Props) => {
  const { componentRef, dataSource, summaryData, sameLevel, multiLevel } = props;

  return (
    <div ref={componentRef}>
      <div style={{ padding: 35 }}>
        {(() => {
          const componentNodes = [];
          //** pdf cùng trong level 1-7 hoặc cùng trong level 8-10 */
          if (!multiLevel) {
            {
              Object.keys(summaryData).length > 0 &&
                componentNodes.push(
                  <div>
                    <Image src={summaryData?.header?.logo} />
                    <Typography.Title level={3} style={{ textAlign: 'center' }}>
                      {summaryData?.header?.titleHeader}
                    </Typography.Title>
                    <Form
                      name="create_template_form"
                      colon={false}
                      requiredMark={false}
                      labelCol={{ span: 0 }}
                      style={{ width: '100%' }}
                      labelAlign="left"
                    >
                      <Form.Item label={t('IDS_FULLNAME') + ': '} className="ant-form-item-info">
                        <Typography.Text>{summaryData?.header?.fullName}</Typography.Text>
                      </Form.Item>
                      <Form.Item label={t('IDS_EMPLOYEE') + ': '} className="ant-form-item-info">
                        <Typography.Text>{summaryData?.header?.employeeNumber}</Typography.Text>
                      </Form.Item>
                    </Form>
                    <div style={{ paddingTop: 25 }}>
                      <Table
                        dataSource={summaryData?.dataSource || []}
                        columns={sameLevel === '1-7' ? ColumnPDF17.columnSummary17() : ColumnPDF810.columnSummary810()}
                        pagination={false}
                        bordered
                        locale={{
                          emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
                        }}
                      />
                    </div>
                  </div>,
                );
            }

            for (let i = 0; i < dataSource.length; i++) {
              const item = dataSource[i][0];
              if (item.level <= 7) {
                // **level 1-7 */
                componentNodes.push(
                  <>
                    <div style={{ pageBreakBefore: 'always' }} />
                    <div style={{ paddingTop: Object.keys(summaryData).length <= 0 && i === 0 ? 0 : 35 }}>
                      <HeaderPdf item={item} />
                      <UserInformationPdf item={item} />
                      <ComponentPdf1_7 item={item} />
                    </div>
                  </>,
                );
              } else {
                // **level 8-10 */
                componentNodes.push(
                  <>
                    <div style={{ pageBreakBefore: 'always' }} />
                    <div style={{ paddingTop: Object.keys(summaryData).length <= 0 && i === 0 ? 0 : 35 }}>
                      <HeaderPdf item={item} />
                      <UserInformationPdf item={item} />
                      <ComponentPdf8_10 item={item} />
                    </div>
                  </>,
                );
              }
            }
          } else {
            for (let i = 0; i < dataSource.length; i++) {
              const item = dataSource[i][0];
              if (item.level <= 7) {
                // **level 1-7 */
                componentNodes.push(
                  <>
                    <div style={{ pageBreakBefore: 'always' }} />
                    <div style={{ paddingTop: 35 }}>
                      <HeaderPdf item={item} />
                      <UserInformationPdf item={item} />
                      <ComponentPdf1_7 item={item} />
                    </div>
                  </>,
                );
              } else {
                // **level 8-10 */
                componentNodes.push(
                  <>
                    <div style={{ pageBreakBefore: 'always' }} />
                    <div style={{ paddingTop: 35 }}>
                      <HeaderPdf item={item} />
                      <UserInformationPdf item={item} />
                      <ComponentPdf8_10 item={item} />
                    </div>
                  </>,
                );
              }
            }
          }

          return componentNodes;
        })()}
      </div>
    </div>
  );
};

export default ComponentParent;
