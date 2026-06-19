import { Skeleton, Typography } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import httpAxios from '../../../common/http';
import { decrypt, urlCompanyCode } from '../../../common/util';
import CommentFeedbackDetail from './component/CommentFeedbackDetail';
import DetailAndEditlnforFeedback from './component/DetailAndEditlnforFeedback';
import IssuesRelated from './component/IssuesRelated';
import UserInforSystemAdmin from './component/UserInforSystemAdmin';

interface Props {
  role: 'user' | 'admin' | 'systemAdmin';
}
const DetailFeedbackPage: React.FC<Props> = (props: Props) => {
  const { role } = props;

  const location = useLocation();

  const id = location.state;

  const [isLoading, setLoading] = useState(true);

  const params = useParams();

  const navigate = useNavigate();

  const [feedbackInfo, setFeedbackInfo] = useState();

  useEffect(() => {
    if (!id) {
      // access bằng copy và paste url detail
      if (decrypt(params.id?.toString() || '') === undefined) {
        if (role == 'user') {
          navigate(urlCompanyCode() + '/feedback', { state: { ...location.state, key: 'feedbackHistory' } });
        } else if (role == 'admin') {
          navigate(urlCompanyCode() + '/admin-evaluation/list-feedback');
        } else if (role == 'systemAdmin') {
          navigate(urlCompanyCode() + '/system-admin/list-feedback');
        }
      } else {
        //* access bằng link từ email
        getFeedbackInfo();
      }
    } else getFeedbackInfo();
  }, [id]);

  const getFeedbackInfo = async () => {
    let url = '';
    if (role == 'user') {
      url = '/api/v1/common/get-detail-feedback';
    } else if (role == 'admin') {
      url = '/api/v1/f5/management-evaluation-history/get-detail-feedback';
    } else if (role == 'systemAdmin') {
      url = '/api/v1/f9/system-admin/get-detail-feedback';
    }
    setLoading(true);
    await httpAxios
      .Get(url, {
        params: {
          id: !id ? Number(decrypt(params.id?.toString() || '')) : id,
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
  };

  const getFeedbackInfoForComment = async () => {
    let url = '';
    if (role == 'user') {
      url = '/api/v1/common/get-detail-feedback';
    } else if (role == 'admin') {
      url = '/api/v1/f5/management-evaluation-history/get-detail-feedback';
    } else if (role == 'systemAdmin') {
      url = '/api/v1/f9/system-admin/get-detail-feedback';
    }
    await httpAxios
      .Get(url, {
        params: {
          id: !id ? Number(decrypt(params.id?.toString() || '')) : id,
        },
      })
      .then((res) => {
        if (res && res.status === 200) {
          if (res?.data) {
            setFeedbackInfo(res?.data);
          }
        }
      });
  };

  return (
    <div>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <div>
          <Typography.Title level={3}>{t('IDS_DETAIL_FEEDBACK')}</Typography.Title>
          {role === 'systemAdmin' && (
            <div style={{ marginBottom: '10px' }}>
              <UserInforSystemAdmin feedbackInfo={feedbackInfo} />
            </div>
          )}
          {role === 'systemAdmin' && (
            <div style={{ marginBottom: '10px' }}>
              <IssuesRelated
                role={role}
                feedbackInfo={feedbackInfo}
                isLoading={isLoading}
                setLoading={setLoading}
                loadData={getFeedbackInfo}
                onAddSuccess={getFeedbackInfo}
              />
            </div>
          )}
          <div style={{ marginBottom: '10px' }}>
            <DetailAndEditlnforFeedback
              role={role}
              feedbackInfo={feedbackInfo}
              isLoading={isLoading}
              setLoading={setLoading}
              loadData={getFeedbackInfo}
            />
          </div>

          <CommentFeedbackDetail
            role={role}
            feedbackInfo={feedbackInfo}
            isLoading={isLoading}
            setLoading={setLoading}
            getFeedbackInfo={getFeedbackInfoForComment}
            loadData={getFeedbackInfo}
          />
        </div>
      )}
    </div>
  );
};
export default DetailFeedbackPage;
