/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import ComponentReview17 from './componentDetailReview17';
import { t } from 'i18next';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import httpAxios from '../../../common/http';
interface Props {
  isEvaluatorUser: any;
  pdfId: any;
  isF5: any;
  statusEvaluation: any;
  fullName: any;
  financialYear: any;
}
const PrintDetailReview17: React.FC<Props> = (props: Props) => {
  const { isEvaluatorUser, pdfId, isF5, statusEvaluation, fullName, financialYear } = props;

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
      await httpAxios
        .Post('/api/v1/common/review/report/pdf/evaluation', {
          id: [pdfId],
          isEvaluatorUser: isEvaluatorUser,
          isF5: isF5,
        })
        .then((res) => {
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
        <ComponentReview17 componentRef={componentRef} dataSource={dataSource} />
      </div>

      <Button
        className="button-normal"
        type="primary"
        size="middle"
        loading={loading}
        disabled={isF5 ? !(statusEvaluation > 0) : statusEvaluation !== 100}
        onClick={handlePrint}
      >
        {t('IDS_BUTTON_OUTPUT_PDF')}
        <DownloadOutlined style={{ fontSize: 18 }} />
      </Button>
    </div>
  );
};

export default PrintDetailReview17;
