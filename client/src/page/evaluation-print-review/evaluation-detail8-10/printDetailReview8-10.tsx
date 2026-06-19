/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { t } from 'i18next';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import httpAxios from '../../../common/http';
import ComponentDetailReview810 from './componentDetailReview8-10';
interface Props {
  store: any;
  status: any;
  role: any;
  params: any;
  fullName: any;
  financialYear: any;
}
const PrintDetailReview810: React.FC<Props> = (props: Props) => {
  const { store, status, role, params, fullName, financialYear } = props;

  const componentRef = useRef(null) as any;

  const onBeforeGetContentResolve = useRef(null) as any;

  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]) as any;
  const [filename, setFileName] = useState('') as any;

  const [text, setText] = useState('LOADING');

  // const handleAfterPrint = useCallback(() => {
  //   console.log('`onAfterPrint` called'); // tslint:disable-line no-console
  // }, []);

  // const handleBeforePrint = useCallback(() => {
  //   console.log('`onBeforePrint` called'); // tslint:disable-line no-console
  // }, []);

  const handleOnBeforeGetContent = useCallback(async () => {
    setLoading(true);
    setText('LOADING ...');

    return await new Promise<void>(async (resolve) => {
      onBeforeGetContentResolve.current = resolve;
      await httpAxios.Post('/api/v1/common/review/report/pdf/evaluation-8-10', params).then((res) => {
        if (res && res?.status) {
          // console.log(res?.data);
          setDataSource(res?.data.dataReview);
          setFileName(res?.data.fileName);

          setTimeout(() => {
            setLoading(false);
            setText('LOADED');
            resolve();
          }, 1);
        }
      });
    });
  }, [setLoading, setText]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: `【${financialYear}】${fullName}評価表.pdf`,
    onBeforeGetContent: handleOnBeforeGetContent,

    // onBeforePrint: handleBeforePrint,
    // onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (text === 'LOADED' && typeof onBeforeGetContentResolve.current === 'function') {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  return (
    <div>
      <div style={{ display: 'none' }}>
        <ComponentDetailReview810 componentRef={componentRef} dataSource={dataSource} />
      </div>

      <Button
        className="button-normal"
        type="primary"
        size="middle"
        style={{ margin: 0, display: 'inline-block' }}
        loading={loading}
        disabled={
          store.calculateTotal.isDisable ||
          status < 1 ||
          (role === 'evaluator' && status !== 100) ||
          (role === 'user' && status !== 100)
        }
        onClick={handlePrint}
      >
        {t('IDS_BUTTON_OUTPUT_PDF')}
        <DownloadOutlined style={{ fontSize: 18 }} />
      </Button>
    </div>
  );
};

export default PrintDetailReview810;
