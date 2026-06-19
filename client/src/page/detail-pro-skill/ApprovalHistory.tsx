import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Card, Form, Spin, Timeline, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import proSkillApiService from '../../common/api/proSkill';
import { t } from 'i18next';
import { from, map } from 'rxjs';
import { TimelineItemProps } from 'antd';
import moment from 'moment-timezone';
import { EvaluationApprovalHistory } from '../../model/EvaluationApprovalHistory';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  role: string;
}
const ApprovalHistory = (props: Props) => {
  const { role } = props;
  const [dataSources, setDataSource] = useState<EvaluationApprovalHistory[]>([]);
  const [info, setInfo] = useState({ skill: '', version: '' });
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const params = useParams();

  const { user } = useAuth();

  const setDataCallback = (data: any) => {
    setDataSource(data.approvalHistories);
    setInfo(data.info);
    setLoading(false);
  };
  const callbackError = () => {
    setLoading(false);
    navigate('/404page');
  };
  useEffect(() => {
    let url = '';
    if (role == 'f2') url = `/api/v1/f2/evaluator/history-approve/${params.id}`;
    if (role == 'f3') url = `/api/v1/f3/pro-setting/history-approve/${params.id}`;
    if (role == 'f4') url = `/api/v1/f4/pro-skill-approval/history-approve/${params.id}`;
    if (role == 'f6') url = `/api/v1/f6/management-evaluation/history-approve/${params.id}`;

    // if (role == 'f7') url = `/api/v1/f3/pro-setting/history-approve/${params.id}`;
    proSkillApiService.getApprovalHistory(url, Number(user?.id), setDataCallback, callbackError, setLoading);
  }, []);
  const processingData = () => {
    const results: TimelineItemProps[] = [];
    from(dataSources)
      .pipe(
        map((el) => {
          return {
            dot:
              el.status === t('IDS_APPROVE') ? (
                <CheckCircleOutlined style={{ fontSize: '14px', color: 'green' }} />
              ) : el.status === t('IDS_REJECT') ? (
                <CloseCircleOutlined style={{ fontSize: '14px', color: 'red' }} />
              ) : (
                <CheckCircleOutlined style={{ fontSize: '14px', color: 'blue' }} />
              ),
            children: (
              <>
                <div>
                  {moment(el.createdTime).format('YYYY/M/D H:mm')}　{el.approverUser?.fullName} : {el.status}
                </div>
                {el.comment ? <div style={{ whiteSpace: 'pre-wrap' }}>{el.comment}</div> : null}
              </>
            ),
          };
        }),
      )
      .subscribe((el) => results.push(el));

    return results;
  };

  return (
    <div>
      {isLoading ? (
        <Spin></Spin>
      ) : (
        <div>
          <Card>
            <Typography.Title level={3} style={{ paddingBottom: 10 }}>
              {t('IDS_HISTORY_APPROVE')}
            </Typography.Title>
            <Form
              labelAlign="left"
              labelCol={{ span: 1 }}
              colon={false}
              requiredMark={false}
              style={{ marginBottom: 0 }}
            >
              <Form.Item label={t('IDS_TEMPLATE')} colon={false} className="ant-form-item-info">
                <Typography>{info.skill}</Typography>
              </Form.Item>
              <Form.Item label={t('IDS_VERSION')} colon={false} className="ant-form-item-info">
                {info.version}
              </Form.Item>
            </Form>
          </Card>
          <Card style={{ marginTop: 15 }}>
            <Typography.Title level={4}>{t('IDS_HISTORY_APPROVE_PRO_SKILL')}</Typography.Title>
            {dataSources && dataSources.length ? (
              <div style={{ marginTop: 10 }}>
                <Timeline items={processingData()} />
              </div>
            ) : (
              t('MESSAGE.COMMON.IDM_EMPTY_DATA')
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default ApprovalHistory;
