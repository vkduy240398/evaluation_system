/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/naming-convention */
import { DatePicker, Form, Radio, Space, Typography } from 'antd';
import { t } from 'i18next';
import { MainButton, CancelButton } from '../../../common/MainButton';
import moment from 'moment-timezone';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import httpAxios from '../../../common/http';
import ComponentParent from '../../evaluation-print-review/evaluation-list/componentParent';
import notification from 'antd/lib/notification';
import { NotificationPlacement } from 'antd/es/notification/interface';
interface Props {
  handleCancel: any;
  location: any;
}

const PopupPdfDetail: React.FC<Props> = (props: Props) => {
  const { handleCancel, location } = props;
  const [form] = Form.useForm();
  const state = location;
  const userId = state?.userId;
  const yearStart = state?.yearStart;
  const yearEnd = state?.yearEnd;

  const componentRef = useRef(null) as any;

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement: NotificationPlacement, mesage: string) => {
    api.warning({
      message: <Typography.Title level={4}>{t('IDS_NOTIFY')}</Typography.Title>,
      description: mesage,
      placement,
    });
  };

  const onBeforeGetContentResolve = useRef(null) as any;

  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]) as any;

  const [summaryData, setSummaryData] = useState({}) as any;

  const [filename, setFileName] = useState('') as any;

  const [sameLevel, setSameLevel] = useState('1-10') as any;

  const [multiLevel, setMultiLevel] = useState(false);

  const [text, setText] = useState('LOADING');

  const fileNamePDF = () => {
    // const year = dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY');
    // const period = form.getFieldValue('periodIndex') === 1 ? '上期' : '下期';
    // return `【${year}年${period}】${userName}評価表.pdf`;

    const userName = state?.userName;
    const employeeNumber = state?.employeeNumber;

    return `${employeeNumber}: ${userName}評価表.pdf`;
  };

  const handleAfterPrint = useCallback(() => {
    handleCancel();
  }, []);

  // const handleBeforePrint = useCallback(() => {
  //   console.log('`onBeforePrint` called'); // tslint:disable-line no-console
  // }, []);

  const handleOnBeforeGetContent = useCallback(async () => {
    setLoading(true);
    setText('LOADING ...');
    const year = dayjs(form.getFieldValue('year'), 'YYYY').format('YYYY');
    const periodIndex = form.getFieldValue('periodIndex');
    const parameters = {
      year: year,
      periodIndex: periodIndex,
      userId: userId,
    };

    return await new Promise<void>(async (resolve) => {
      onBeforeGetContentResolve.current = resolve;

      await httpAxios.Post('/api/v1/f2/evaluator/export-pdf-pro-skill-expertise', parameters).then((res) => {
        if (res && res?.status) {
          if (res?.data?.dataPdf?.length === 0) {
            openNotification('bottomRight', t('IDS_NO_DATA_PDF'));
          } else {
            if (res?.data?.dataLenght === 1) {
              setDataSource(res?.data?.dataPdf?.dataReview);
            } else if (res?.data?.dataLenght > 1) {
              setDataSource(res?.data?.dataPdf?.dataReview);
              setSummaryData(res?.data?.dataPdf?.summaryData);
              setSameLevel(res?.data?.dataPdf?.sameLevel);
              setMultiLevel(res?.data?.dataPdf?.multiLevel);
            }
          }

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
    documentTitle: fileNamePDF(),
    onBeforeGetContent: handleOnBeforeGetContent,

    // onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (text === 'LOADED' && typeof onBeforeGetContentResolve.current === 'function') {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  return (
    <div>
      {dataSource && dataSource.length > 0 ? (
        <div style={{ display: 'none' }}>
          <ComponentParent
            componentRef={componentRef}
            dataSource={dataSource}
            summaryData={summaryData}
            sameLevel={sameLevel}
            multiLevel={multiLevel}
          />
        </div>
      ) : (
        <div>{contextHolder}</div>
      )}

      <Form labelAlign="left" labelCol={{ span: 1 }} colon={false} requiredMark={false} form={form} initialValues={{}}>
        <Form.Item label={t('REVIEW_SUMMARY.IDS_CALENDAR_POPUP_CONFIRM_PDF')} style={{ marginBottom: 0 }}>
          <Space direction="horizontal" size={'small'}>
            <Form.Item name={'year'} initialValue={dayjs(moment(yearStart, 'YYYY').format('YYYY'))}>
              <DatePicker
                format={'YYYY'}
                picker="year"
                disabledDate={(current) => {
                  return current && current > dayjs().set('year', yearEnd);
                }}
                size="small"
                placeholder="YYYY"
                allowClear={true}
                clearIcon={false}
                style={{ width: 100 }}
                onChange={(e: any) => {
                  setDataSource([]);
                  setSummaryData({});
                  setSameLevel('1-10');
                  setMultiLevel(false);
                }}
              />
            </Form.Item>
            <Form.Item name="periodIndex" initialValue={1}>
              <Radio.Group
                onChange={(e: any) => {
                  setDataSource([]);
                  setSummaryData({});
                  setSameLevel('1-10');
                  setMultiLevel(false);
                }}
              >
                <Radio value={1}>{t('IDS_FIRST_PERIOD')}</Radio>
                <Radio value={2}>{t('IDS_SECOND_PERIOD')}</Radio>
              </Radio.Group>
            </Form.Item>
          </Space>
        </Form.Item>
        <Space
          size={'middle'}
          style={{
            marginTop: 10,
          }}
        >
          <MainButton
            type="primary"
            name="Search"
            value="txt_evaluation_search"
            onClick={async (e) => {
              e.stopPropagation();
              await handlePrint();
            }}
            loading={loading}
          >
            {t('IDS_OUTPUT')}
          </MainButton>
          <CancelButton form="form" onClick={handleCancel} loading={loading}>
            {t('IDS_BUTTON_CANCEL')}
          </CancelButton>
        </Space>
      </Form>
    </div>
  );
};

export default PopupPdfDetail;
