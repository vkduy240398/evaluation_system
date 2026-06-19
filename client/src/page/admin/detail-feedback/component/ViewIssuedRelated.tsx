/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Modal, Row, Skeleton, Typography } from 'antd';
import { t } from 'i18next';
import httpAxios from '../../../../common/http';
import UserInforSystemAdmin from './UserInforSystemAdmin';
import DetailAndEditlnforFeedback from './DetailAndEditlnforFeedback';
import CommentFeedbackDetail from './CommentFeedbackDetail';
interface Props {
  record: any;

  isOpen: any;
  setOpen: any;
}
const ViewIssueRelated: React.FC<Props> = (props: Props) => {
  const { record, isOpen, setOpen } = props;

  const [feedbackInfo, setFeedbackInfo] = useState();

  const [isLoading, setLoading] = useState(true);

  const id = record?.id;

  const [conditionSearchPopup, setConditionSearchPopup] = useState<{
    division: any;
    department: any;
    nameAndEmail: any;
  }>();

  useEffect(() => {
    getFeedbackInfo();
  }, [isOpen === true]);

  const getFeedbackInfo = async () => {
    if (id) {
      const url = '/api/v1/f9/system-admin/get-detail-feedback';
      setLoading(true);
      await httpAxios
        .Get(url, {
          params: {
            id: id,
          },
        })
        .then((res) => {
          if (res && res.status === 200) {
            if (res?.data) {
              setFeedbackInfo(res?.data);
            }
          }
        });
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', maxWidth: 'calc(100vw - 50px)' }}
        title={<Typography.Title level={4}>{t('IDS_RELATED_FEEDBACKS')}</Typography.Title>}
        open={isOpen}
        footer={null}
        style={{ top: 20 }}
        width="95%"
        maskClosable={false}
        onCancel={() => setOpen(false)}
      >
        {isLoading ? (
          <Skeleton active />
        ) : (
          <>
            <div style={{ marginBottom: '10px' }}>
              <UserInforSystemAdmin feedbackInfo={feedbackInfo} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <DetailAndEditlnforFeedback
                role={'admin'}
                feedbackInfo={feedbackInfo}
                isLoading={isLoading}
                setLoading={setLoading}
                loadData={getFeedbackInfo}
              />
            </div>
            <CommentFeedbackDetail
              role={'admin'}
              feedbackInfo={feedbackInfo}
              isLoading={isLoading}
              setLoading={setLoading}
              getFeedbackInfo={''}
              loadData={getFeedbackInfo}
            />
            <Row>
              <Button onClick={() => setOpen(false)} className="cancel_button" style={{ marginTop: 10, marginLeft: 5 }}>
                {t('IDS_BUTTON_CLOSE')}
              </Button>
            </Row>
          </>
        )}
      </Modal>
    </div>
  );
};
export default ViewIssueRelated;
