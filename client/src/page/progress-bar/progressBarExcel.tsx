import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Progress, Typography, notification } from 'antd';
import { t } from 'i18next';
import './ProgressBarDescription.css';
const ProgressBarExcel: React.FC = () => {
  const notifKey = 'export-progress';

  const { isShowNotification, progress, isExporting, messageText, isShowProgressBar } = useSelector(
    (state: RootState) => state.excelStore,
  );

  const openedRef = useRef(false); // ✅ chỉ mở 1 lần

  // ✅ Cảnh báo khi reload nếu đang export
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isExporting) {
        e.preventDefault();

        (e as any).returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isExporting]);

  const isProcessing = messageText === t('IDS_EXCEL.IDS_WAITING_DATA');
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const progressBarDescription = () => {
    return (
      <div>
        {messageText || ''}
        {isProcessing && (
          <span className="dot-container">
            <span className="dot dot-1">.</span>
            <span className="dot dot-2">.</span>
            <span className="dot dot-3">.</span>
          </span>
        )}
        {isShowProgressBar && <Progress percent={progress} size="small" status="active" />}
      </div>
    );
  };

  const progressBarTitle = () => {
    return (
      <div>
        <Typography.Title level={4}>{t('IDS_EXCEL.IDS_TITLE_PROGRESS_EXCEL')}</Typography.Title>
      </div>
    );
  };

  useEffect(() => {
    if (!isShowNotification) return;

    if (isExporting && progress < 100) {
      if (!openedRef.current) {
        notification.open({
          key: notifKey,
          message: progressBarTitle(),
          description: progressBarDescription(),
          duration: 0,
          placement: 'bottomRight',
        });
        openedRef.current = true;
      } else {
        notification.open({
          key: notifKey,
          message: progressBarTitle(),
          description: progressBarDescription(),
          duration: 0,
          placement: 'bottomRight',
        });
      }
    }

    if (progress >= 100) {
      notification.success({
        key: notifKey,
        message: progressBarTitle(),
        description: progressBarDescription(),
        duration: 5,
        placement: 'bottomRight',
      });
      openedRef.current = false; // reset
    }

    if (progress == -1) {
      notification.error({
        key: notifKey,
        message: progressBarTitle(),
        description: progressBarDescription(),
        duration: 5,
        placement: 'bottomRight',
      });
      openedRef.current = false; // reset
    }
  }, [isShowNotification, progress, isExporting, messageText, dots]);

  return null;
};

export default ProgressBarExcel;
