import { Switch, Typography } from 'antd';
import { SwitchChangeEventHandler } from 'antd/es/switch';
import React from 'react';
interface SwitchFieldProps {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onChange: (e: boolean) => void;
}
const { Text } = Typography;

const SwitchComponent: React.FC<SwitchFieldProps> = ({ label, checked, disabled, onChange }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid #e8e8e8',
      borderRadius: '4px',
      padding: '8px 16px',
      marginBottom: '16px',
    }}
  >
    <Text>{label}</Text>
    <Switch disabled={disabled} checked={checked} onChange={onChange} />
  </div>
);

export default SwitchComponent;
