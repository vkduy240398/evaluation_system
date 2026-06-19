import { Global } from '@emotion/react';
import { ReactNode, useEffect, useState } from 'react';

const GlobalStyled = ({ children }: { children: ReactNode }) => {
  // ** State
  const [height, setHeight] = useState<number>(0);

  // ** Hook

  // ** Vars

  // ** Effect
  useEffect(() => {
    const element = document.getElementById('layout-main');

    const handleHeight = (clientHeight: number) => {
      if (height !== clientHeight) setHeight(clientHeight - 45);
    };
    if (element) {
      window.addEventListener('scroll', () => handleHeight(element.clientHeight));
    }

    return () => {
      window.removeEventListener('scroll', () => handleHeight(0));
    };
  }, [document.getElementById('layout-main')]);

  return (
    <>
      <Global
        styles={{
          '.ant-menu-submenu-popup .ant-menu-vertical.ant-menu-sub': {
            minHeight: `${height === 0 ? 'calc(100vh - 45px)' : `${height}px`}`,
          },
          'tr>td>div.ant-table-expanded-row-fixed': {
            padding: '4px !important',
          },

          'div.ant-form-item-explain.ant-form-item-explain-connected>div.ant-form-item-explain-error': {
            // fontSize: 10,
          },
          'div.ant-form-item-with-help.ant-form-item-has-error>div.ant-form-item-row>div.ant-form-item-control>div.ant-form-item-control-input>div.ant-form-item-control-input-content>div.ant-picker-range':
            {
              border: '1px solid #ff4d4f',
            },
        }}
      />
      {children}
    </>
  );
};

export default GlobalStyled;
