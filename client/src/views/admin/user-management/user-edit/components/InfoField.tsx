import { LockFilled } from '@ant-design/icons';
import React from 'react';

interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
  hasLock?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, hasLock = false }) => (
  <div
    style={{
      border: '1px solid #e8e8e8',
      borderRadius: '4px',
      padding: '8px 12px',
      height: '100%',
    }}
  >
    <div style={{ color: '#007240', fontSize: '13px', marginBottom: '4px' }}>
      {label}{' '}
      {hasLock && (
        <>
          ( <LockFilled style={{ color: '#faad14', fontSize: '12px' }} />)
        </>
      )}
    </div>
    <div style={{ fontSize: '14px', color: '#262626' }}>{value}</div>
  </div>
);

export default InfoField;
