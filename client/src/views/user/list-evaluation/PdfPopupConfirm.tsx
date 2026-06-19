/* eslint-disable @typescript-eslint/naming-convention */
import { Form, Radio } from 'antd';
import { t } from 'i18next';

interface Props {
  setOptionPdfList: any;
  optionPdfList: { orientation: string; size: string };
}

const PdfPopupConfirm = (props: Props) => {
  const { setOptionPdfList, optionPdfList } = props;

  return (
    <Form labelAlign="left" labelCol={{ span: 1 }}>
      <Form.Item label={t('IDS_PAGE_ORIENTATION')} colon={false} style={{ padding: 5 }}>
        <Radio.Group
          name="orientation"
          onChange={(e) =>
            setOptionPdfList({
              ...optionPdfList,
              orientation: e.target.value,
            })
          }
          defaultValue="p"
          style={{ paddingLeft: 20 }}
        >
          <Radio value={'p'}>{t('IDS_PORTRAIT')}</Radio>
          <Radio value={'l'}>{t('IDS_LANDSCAPE')}</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={t('IDS_PAPER_SIZE')} colon={false} style={{ padding: 5 }}>
        <Radio.Group
          name="size"
          onChange={(e) =>
            setOptionPdfList({
              ...optionPdfList,
              size: e.target.value,
            })
          }
          defaultValue="a4"
          style={{ paddingLeft: 20 }}
        >
          <Radio value={'a4'}>{t('A4')}</Radio>
          <Radio value={'a3'}>{t('A3')}</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};
export default PdfPopupConfirm;
