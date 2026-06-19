/* eslint-disable prefer-const */
import { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import LoadingScreenComponent from '../../views/loading/LoadingScreenComponent';
import { DetailNotificationModel } from '../../model/version-notification/DetailNotificationModel';
import notificationApiService from '../../common/api/version-notification';

const NotificationScreen = () => {
  const [dataSource, setDataSource] = useState<DetailNotificationModel>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    notificationApiService.getPublicNotification(callback, callBackNotFound, setLoading);
  };

  const callback = async (data: DetailNotificationModel) => {
    setDataSource(data);
  };

  const callBackNotFound = () => {
    navigate('/404page');
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreenComponent />
      ) : (
        <>
          <Card style={{ overflowX: 'auto' }}>
            <Typography.Title level={3} style={{ paddingBottom: 10 }}>
              {t('IDS_TITLE_NOTIFICATION')}
            </Typography.Title>
            <div className="parse-table-content">
              {parse(!dataSource?.content ? t('MESSAGE.COMMON.IDM_EMPTY_DATA').toString() : dataSource.content)}
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default NotificationScreen;
