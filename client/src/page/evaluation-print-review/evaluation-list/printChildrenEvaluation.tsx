/* eslint-disable prefer-const */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { t } from 'i18next';
import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import httpAxios from '../../../common/http';
import ComponentChildren from './componentChildren';
interface Props {
  params: any;
  role: any;
  isDisabled: boolean;
}
const PrintChildrenEvaluation: React.FC<Props> = (props: Props) => {
  const { params, role, isDisabled } = props;

  const componentRef = useRef(null) as any;

  const onBeforeGetContentResolve = useRef(null) as any;

  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]) as any;

  const [filename, setFileName] = useState('') as any;

  const [text, setText] = useState('LOADING');

  const fileNamePDF = () => {
    if (role == 'f1') {
      return `【${params.financialYear}】${params?.userInfo?.fullName}評価表.pdf`;
    } else if (role == 'f2') {
      return `【${params.financialYear}】${params.fullName.split(': ')[1]}評価表.pdf`;
    } else if (role == 'f5') {
      return `【${params.financialYear}】${params.fullName}評価表.pdf`;
    }
  };

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
      if (role == 'f1') {
        // console.log('role: ', role);
        // console.log('params: ', params);

        const parameters = {
          evaluationId: params.evaluationId,
          role: 'user',
          userId: params.userInfo.id,
          level: params.level,
          isF5: role == 'f5' ? true : undefined,
        };

        await httpAxios.Post('/api/v1/common/review/report/list/pdf/evaluation', parameters).then((res) => {
          if (res && res?.status) {
            setDataSource(res?.data.dataReview);
            setFileName(res?.data.fileName);

            setTimeout(() => {
              setLoading(false);
              setText('LOADED');
              resolve();
            }, 1);
          }
        });
      } else if (role == 'f2') {
        // console.log('role: ', role);
        // console.log('params: ', params);

        const parameters = {
          evaluationId: params.evaluationId,
          role: 'evaluator',
          userId: params.evaluatorId,
          level: params.level,
          isF5: role == 'f5' ? true : undefined,
        };

        await httpAxios.Post('/api/v1/common/review/report/list/pdf/evaluation', parameters).then((res) => {
          if (res && res?.status) {
            setDataSource(res?.data.dataReview);
            setFileName(res?.data.fileName);

            setTimeout(() => {
              setLoading(false);
              setText('LOADED');
              resolve();
            }, 1);
          }
        });
      } else if (role == 'f5') {
        // console.log('role: ', role);
        // console.log('params: ', params);

        const parameters = {
          evaluationId: params.id,
          role: 'admin',
          userId: 1, // giá trị này trong trường hợp này không quan trọng, có thể là số bất kì
          level: params.level,
          isF5: role == 'f5' ? true : undefined,
        };

        await httpAxios.Post('/api/v1/common/review/report/list/pdf/evaluation', parameters).then((res) => {
          if (res && res?.status) {
            setDataSource(res?.data.dataReview);
            setFileName(res?.data.fileName);

            setTimeout(() => {
              setLoading(false);
              setText('LOADED');
              resolve();
            }, 1);
          }
        });
      }
    });
  }, [setLoading, setText]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: fileNamePDF(),
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
        <ComponentChildren componentRef={componentRef} dataSource={dataSource} />
      </div>

      <Tooltip placement="topRight" title={isDisabled ? '' : t('IDS_BUTTON_OUTPUT_PDF')} color="grey">
        <Button
          disabled={isDisabled}
          loading={loading}
          icon={<FilePdfOutlined />}
          style={{ color: '#007240 ' }}
          onClick={async (e) => {
            e.stopPropagation();
            await handlePrint();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default PrintChildrenEvaluation;
