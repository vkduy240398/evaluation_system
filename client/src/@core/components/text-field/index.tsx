import { InputProps, FormItemProps, Form, Input } from 'antd';

import './TextField.css';

type Props = {
  inputProps?: InputProps;
  formItemProps?: FormItemProps;
  colorLabel?: string;
  label: string;
};

const TextField = ({ formItemProps, inputProps, label, colorLabel = 'black' }: Props) => {
  return (
    <Form.Item {...formItemProps} noStyle>
      <div className="text-field-wrapper">
        <label className="text-field-label" style={{ color: colorLabel }}>
          {label}
        </label>
        <div className="text-field-input-wrapper">
          <Input {...inputProps} className="text-field-input" />
          <fieldset className="text-field-fieldset">
            <legend className="text-field-legend-wrapper">
              <span className="text-field-legend-content">{label}</span>
            </legend>
          </fieldset>
        </div>
      </div>
    </Form.Item>
  );
};

export default TextField;
