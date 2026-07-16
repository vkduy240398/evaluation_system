import Form, { FormInstance } from 'antd/es/form';
import { t } from 'i18next';
import Button from 'antd/es/button';

interface Props {
  form: FormInstance;
  isLoading: boolean;
  isDisable: boolean;
  setOpen: (isBool: boolean) => void;
  handleSaveSubDivision: (args: any) => void;
  isHiddenTable: boolean;
}

const SearchFieldSettingEvaluationPro = (props: Props) => {
  // ** Props
  const { form, isLoading, isDisable, setOpen } = props;

  // ** Hook
  const { Item } = Form;

  // ** Functional
  // const onFinish = (values: any) => {
  //   handleSaveSubDivision({ ...values, limit: 20, offset: 0 });
  // };

  const layout = {
    labelCol: { span: 1 },
    wrapperCol: { xl: 4, lg: 6, md: 8, sm: 12, xs: 24 },
  };

  const handleOpenPopup = () => setOpen(true);

  return (
    <>
      <Form
        {...layout}
        form={form}
        colon={false}
        requiredMark={false}
        labelAlign="left"
        key={'form-department-custom-key-1'}
      >
        {/* <Item
          label="Type"
          name={'setting'}
          rules={[{ required: true, message: t('MESSAGE.COMMON.IDM_BLANK_SELECT_ITEM') as string }]}
        >
          <Radio.Group>
            <Radio value={1}>Div manage</Radio>
            <Radio value={0}>Dep manage</Radio>
          </Radio.Group>
        </Item> */}

        {/* <Item>
          <Button
            type="primary"
            className="main_button"
            htmlType="submit"
            style={{ marginTop: 10 }}
            loading={isLoading}

            // icon={<SearchOutlined />}
          >
            {t('IDS_BUTTON_SAVE')}
          </Button>
        </Item> */}

        <Item >
          <Button
            type="primary"
            className="main_button"
            disabled={isDisable}
            loading={isLoading}
            onClick={handleOpenPopup}
            style={{ marginBottom: 10 }}
          >
            {t('IDS_BUTTON_EDIT_SELECTED')}
          </Button>
        </Item>
      </Form>
    </>
  );
};

export default SearchFieldSettingEvaluationPro;
