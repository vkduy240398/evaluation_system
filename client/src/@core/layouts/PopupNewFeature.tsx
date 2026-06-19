import React, { memo, useEffect } from 'react';
import { Button, Modal, Typography } from 'antd';
import { t } from 'i18next';
import { useAuth } from '../../hooks/useAuth';
import Paragraph from 'antd/lib/typography/Paragraph';
import Text from 'antd/lib/typography/Text';

interface NotifDetail {
  emails: string[];
}

const NOTIF_DETAIL_KEY = 'popup_notif';
const FONT_SIZE = '0.8em';

export default memo(() => {
  const auth = useAuth();
  const [shouldShowPopup, setShouldShowPopup] = React.useState(false);

  useEffect(() => {
    const isSettingShowNotif = process.env.REACT_APP_SHOW_NOTIF?.toLowerCase() === 'true';
    if (!isSettingShowNotif) {
      localStorage.removeItem(NOTIF_DETAIL_KEY);

      return;
    }

    const notifDetail = JSON.parse(localStorage.getItem(NOTIF_DETAIL_KEY) || '{}') as NotifDetail;
    setShouldShowPopup(!!auth.user && !notifDetail.emails?.includes(auth.user.email));
  }, []);

  const handleClose = () => {
    if (auth.user) {
      const notifDetail = JSON.parse(localStorage.getItem(NOTIF_DETAIL_KEY) || '{}') as NotifDetail;
      if (!notifDetail.emails) {
        localStorage.setItem(
          NOTIF_DETAIL_KEY,
          JSON.stringify({
            emails: [auth.user.email],
          } as NotifDetail),
        );
      } else if (!notifDetail.emails.includes(auth.user.email)) {
        notifDetail.emails.push(auth.user.email);
        localStorage.setItem(NOTIF_DETAIL_KEY, JSON.stringify(notifDetail));
      }
      setShouldShowPopup(false);
    }
  };

  return (
    <>
      <Modal
        style={{ position: 'absolute', top: 'auto', bottom: 0, right: 10 }}
        width="max(30%, min(100%, 200px))"
        title={
          <Typography.Title level={4} style={{ fontSize: FONT_SIZE }}>
            {t('IDS_TITLE_NOTIFICATION')}
          </Typography.Title>
        }
        open={shouldShowPopup}
        footer={null}
        maskClosable={false}
        onCancel={handleClose}
      >
        <Paragraph style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', fontSize: FONT_SIZE }}>
          {t('POPUP_DIALOG.CONTENT.IDM_NOTIF_NEW_FEATURE')}
        </Paragraph>
        <Button
          onClick={handleClose}
          type="primary"
          style={{ paddingBottom: 6, paddingTop: 3, paddingLeft: 15, paddingRight: 15 }}
        >
          <Text style={{ fontSize: FONT_SIZE, color: 'inherit' }}>{t('IDS_BUTTON_CLOSE')}</Text>
        </Button>
      </Modal>
    </>
  );
});
