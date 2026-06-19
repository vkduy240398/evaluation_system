import 'antd/dist/reset.css';
import { Alert } from 'antd';
import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { t } from 'i18next';
import { useAuth } from '../../hooks/useAuth';
import Marquee from 'react-fast-marquee';
import commonApiService from '../../common/api/common';
import { NotificationFilled } from '@ant-design/icons';
import HeaderComponent from '../../@core/layouts/HeaderComponent';
import { Roles } from '../../constant/Roles';

const NotificationMemo = memo(function Notification({ notification }: { notification: string }) {
  return (
    <>
      {notification && (
        <Alert
          banner
          icon={<NotificationFilled style={{ color: '#C30101', fontSize: 18 }} />}
          message={
            <Marquee pauseOnHover gradient={false} direction="left" speed={20} style={{ backgroundColor: '#fffdbe' }}>
              {notification}
            </Marquee>
          }
          style={{ backgroundColor: '#fffdbe', height: 30 }}
        />
      )}
    </>
  );
});

const DashboardHeader = (props: any) => {
  const location = useLocation() as any;

  // ** Hook
  const auth = useAuth();

  useEffect(() => {
    const callback = (data: any) => {
      if (data && data.length > 0) {
        let notificationTmp = '';
        for (let i = 0; i < data.length; i++) {
          let message = data[i].type.includes(t('IDS_GOAL'))
            ? t('MESSAGE.COMMON.IDM_NOTIFICATION_GOAL')
            : t('MESSAGE.COMMON.IDM_NOTIFICATION_EVALUATION');

          message = message
            .replace('{0}', data[i].period)
            .replace(
              '{1}',
              data[i].dateDepartment && !data[i].dateDepartment.includes('null')
                ? (data[i].type.includes(t('IDS_GOAL'))
                    ? t('MESSAGE.COMMON.IDM_NOTIFICATION_GOAL_EVALUATOR')
                    : t('MESSAGE.COMMON.IDM_NOTIFICATION_EVALUATION_EVALUATOR')
                  ).replace('{0}', data[i].dateDepartment)
                : '',
            )
            .replace(
              '{2}',
              data[i].datePersonal && !data[i].datePersonal.includes('null')
                ? (data[i].type.includes(t('IDS_GOAL'))
                    ? t('MESSAGE.COMMON.IDM_NOTIFICATION_GOAL_USER')
                    : t('MESSAGE.COMMON.IDM_NOTIFICATION_EVALUATION_USER')
                  ).replace('{0}', data[i].datePersonal)
                : '',
            );

          notificationTmp += message;
        }
        props.setNotification(notificationTmp);
      }
    };
    if (
      !location.pathname.includes('/home') &&
      !location.pathname.includes('/404page') &&
      auth &&
      auth.user &&
      ((auth.user.roles.includes(Roles.F1) && location.pathname.includes('/user/')) ||
        (auth.user.roles.includes(Roles.F2) && location.pathname.includes('/evaluator/')) ||
        (auth.user.roles.some((role) => [Roles.F7, Roles.F5, Roles.F6].includes(role)) &&
          location.pathname.includes('/admin-evaluation/')))
    )
      commonApiService.getNotificationPeriod(callback);
    else props.setNotification(undefined);
  }, [location.pathname]);

  return (
    <>
      <HeaderComponent />
      <NotificationMemo notification={props.notification} />
    </>
  );
};

export default DashboardHeader;
