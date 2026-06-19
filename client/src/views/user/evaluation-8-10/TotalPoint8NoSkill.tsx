import { Table, Tooltip, Typography } from 'antd';
import { t } from 'i18next';
import { useEffect } from 'react';
import { EvaluationInfo, EvaluatorInfo } from './interfaces/response.interface';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useDispatch } from 'react-redux';
import {
  summaryPointEvaluator05,
  summaryPointEvaluator1,
  summaryPointEvaluator2,
  summaryPointUsers,
} from '../../../store/total';
import Icon, { InfoCircleOutlined } from '@ant-design/icons';
interface Props {
  status: number;
  role: string;
  listEvalutors: EvaluatorInfo[];
  allowSeeList: EvaluatorInfo[];
  checkList: EvaluatorInfo[];
  setCheckList: (data: any) => void;
  isEvaluationDate: boolean;
  evaluationData: EvaluationInfo;
  maxPoint: number | undefined;
  minPoint: number | undefined;
  location: any;
}
const TotalPoint8NoSkill = (props: Props) => {
  const store = useSelector((state: RootState) => state.calculateTotal);
  const dispatch = useDispatch<AppDispatch>();

  const { checkList, evaluationData, status, maxPoint, minPoint, isEvaluationDate, location, listEvalutors } = props;
  const evaluationPersonalGoalsList = store.evaluationPersonalGoals?.map((v: any) => ({ ...v })) as any[];
  useEffect(() => {
    dispatch(
      summaryPointUsers(
        status < 99
          ? caculatorTotalPointUser()
          : evaluationData.summaryPointUser
          ? Math.round(evaluationData.summaryPointUser)
          : null,
      ),
    );
    dispatch(
      summaryPointEvaluator05(
        status < 99
          ? caculatorTotalPointEvaluator05()
          : evaluationData.summaryPointEvaluator05
          ? Math.round(evaluationData.summaryPointEvaluator05)
          : null,
      ),
    );
    dispatch(
      summaryPointEvaluator1(
        status < 99
          ? caculatorTotalPointEvaluator1()
          : evaluationData.summaryPointEvaluator1
          ? Math.round(evaluationData.summaryPointEvaluator1)
          : null,
      ),
    );
    dispatch(
      summaryPointEvaluator2(
        status < 99
          ? caculatorTotalPointEvaluator2()
          : evaluationData.summaryPointEvaluator2
          ? Math.round(evaluationData.summaryPointEvaluator2)
          : null,
      ),
    );
  }, [evaluationPersonalGoalsList]);
  const caculatorTotalPointUser = () => {
    let totalPoint =
      (store.behaviorTotalPointUser !== null
        ? Number(store.behaviorTotalPointUser) * (evaluationData.behaviorPercent / 100)
        : 0) +
      (store.personalGoals !== null ? Number(store.personalGoals) * (evaluationData.achievementPercent / 100) : 0) +
      (store.achievementUser !== null ? Number(store.achievementUser) : 0);

    if (totalPoint > Number(maxPoint)) {
      totalPoint = Number(maxPoint);
    }
    if (totalPoint < Number(minPoint)) {
      totalPoint = Number(minPoint);
    }

    return (store.behaviorTotalPointUser !== null || store.personalGoals !== null || store.achievementUser !== null) &&
      totalPoint !== null
      ? Math.round(totalPoint)
      : null;
  };
  const caculatorTotalPointEvaluator05 = () => {
    let totalPoint =
      (store.behaviorTotalPointEvaluator05 !== null
        ? Number(store.behaviorTotalPointEvaluator05) * (evaluationData.behaviorPercent / 100)
        : 0) +
      (store.personalGoals05 !== null ? Number(store.personalGoals05) * (evaluationData.achievementPercent / 100) : 0) +
      (store.achievementEvaluator05 !== null ? Number(store.achievementEvaluator05) : 0);
    if (totalPoint > Number(maxPoint)) {
      totalPoint = Number(maxPoint);
    }
    if (totalPoint < Number(minPoint)) {
      totalPoint = Number(minPoint);
    }

    return store.behaviorTotalPointEvaluator05 !== null && store.personalGoals05 !== null && totalPoint
      ? Math.round(totalPoint)
      : null;
  };
  const caculatorTotalPointEvaluator1 = () => {
    let totalPoint =
      (store.behaviorTotalPointEvaluator1 !== null
        ? Number(store.behaviorTotalPointEvaluator1) * (evaluationData.behaviorPercent / 100)
        : 0) +
      (store.personalGoal1 !== null ? Number(store.personalGoal1) * (evaluationData.achievementPercent / 100) : 0) +
      (store.achievementEvaluator1 !== null ? Number(store.achievementEvaluator1) : 0);
    if (totalPoint > Number(maxPoint)) {
      totalPoint = Number(maxPoint);
    }
    if (totalPoint < Number(minPoint)) {
      totalPoint = Number(minPoint);
    }

    return store.behaviorTotalPointEvaluator1 !== null && store.personalGoal1 !== null && totalPoint
      ? Math.round(totalPoint)
      : null;
  };
  const caculatorTotalPointEvaluator2 = () => {
    let totalPoint =
      (store.behaviorTotalPointEvaluator2 !== null
        ? Number(store.behaviorTotalPointEvaluator2) * (evaluationData.behaviorPercent / 100)
        : 0) +
      (store.personalGoal2 !== null ? Number(store.personalGoal2) * (evaluationData.achievementPercent / 100) : 0) +
      (store.achievementEvaluator2 !== null ? Number(store.achievementEvaluator2) : 0);

    if (totalPoint > Number(maxPoint)) {
      totalPoint = Number(maxPoint);
    }
    if (totalPoint < Number(minPoint)) {
      totalPoint = Number(minPoint);
    }

    return store.behaviorTotalPointEvaluator2 !== null && store.personalGoal2 !== null && totalPoint
      ? Math.round(totalPoint)
      : null;
  };

  const dataSources = [
    {
      key: 0,
      user: t('IDS_POINT_USER'),
      behavior: status >= 50 && store.behaviorTotalPointUser,
      weightBehavior: `${evaluationData.behaviorPercent}%`,
      personalGoal: store.personalGoals,
      weightPersonal: `${evaluationData.achievementPercent}%`,
      achivementPersonal:
        status >= 50 && store.achievementUser !== null && store.achievementUser !== undefined
          ? Number(store.achievementUser)
          : null,
      summaryPoint: status >= 50 ? store.summaryPointUser : null,
    },
  ];

  const dataSource2s: {
    key: number;
    user: string;
    achivementPersonal: string | number | null;
    summaryPoint: string | number | null | undefined;
    behavior: any;
    weightBehavior: string | number;
    personalGoal: any;
    weightPersonal: string | number;
  }[] = [...dataSources];
  if (checkList.length) {
    checkList.forEach((item: EvaluatorInfo) => {
      if (item.evaluationOrder === '0.5' && status > 53) {
        dataSource2s[3] = {
          key: 1,
          user: t('IDS_EVALUATOR_0_5'),
          behavior: store.behaviorTotalPointEvaluator05,
          weightBehavior: `${evaluationData.behaviorPercent}%`,
          personalGoal: store.personalGoals05 && Math.round(store.personalGoals05),
          weightPersonal: `${evaluationData.achievementPercent}%`,
          achivementPersonal:
            store.achievementEvaluator05 !== null && store.achievementEvaluator05 !== undefined
              ? store.achievementEvaluator05
              : null,
          summaryPoint: store.summaryPointEvaluator05,
        };
      }
      if (item.evaluationOrder === '1.0' && status > 56) {
        dataSource2s[4] = {
          key: 2,
          user: t('IDS_POINT_EVALUATOR_1'),
          behavior: store.behaviorTotalPointEvaluator1,
          weightBehavior: `${evaluationData.behaviorPercent}%`,
          personalGoal: store.personalGoal1 && Math.round(store.personalGoal1),
          weightPersonal: `${evaluationData.achievementPercent}%`,
          achivementPersonal:
            store.achievementEvaluator1 !== null && store.achievementEvaluator1 !== undefined
              ? store.achievementEvaluator1
              : null,
          summaryPoint: store.summaryPointEvaluator1,
        };
      }
      if (item.evaluationOrder === '2.0' && status > 59) {
        dataSource2s[5] = {
          key: 3,
          user: t('IDS_POINT_EVALUATOR_2'),
          behavior: store.behaviorTotalPointEvaluator2,
          weightBehavior: `${evaluationData.behaviorPercent}%`,
          personalGoal: store.personalGoal2 && Math.round(store.personalGoal2),
          weightPersonal: `${evaluationData.achievementPercent}%`,
          achivementPersonal:
            store.achievementEvaluator2 !== null && store.achievementEvaluator2 !== undefined
              ? store.achievementEvaluator2
              : null,
          summaryPoint: store.summaryPointEvaluator2,
        };
      }
    });
  }

  const onCell = () => {
    return {
      style: {
        background: 'rgb(237, 237, 237)',
      },
    };
  };

  const isEvaluation = status > 50 || (status >= 50 && isEvaluationDate);

  return (
    <>
      <Typography.Title level={4}>
        {isEvaluation ? t('IDS_EVALUATION_PERSONAL') : t('IDS_ACHIEVEMENT_PERSONAL')}
      </Typography.Title>
      <Table
        columns={[
          {
            title: ' ',
            dataIndex: 'user',
            align: 'center' as const,
          },
          {
            title: t('IDS_BEHAVIOR_EVALUATION_METER'),
            align: 'center' as const,
            dataIndex: 'behavior',
          },
          {
            title: t('IDS_WEIGHT'),
            align: 'center' as const,
            dataIndex: 'weightBehavior',
            onCell,
          },
          {
            title: t('IDS_ACHIEVEMENT_EVALUATION_METER'),
            align: 'center' as const,
            dataIndex: 'personalGoal',
          },
          {
            title: t('IDS_WEIGHT'),
            align: 'center' as const,
            dataIndex: 'weightPersonal',
            onCell,
          },
          {
            title: t('IDS_ACHIEVEMENT_ADDITIONAL'),
            align: 'center' as const,
            dataIndex: 'achivementPersonal',
          },
          {
            title: (
              <>
                {t('IDS_TOTAL_POINTS')}
                <Tooltip
                  title={
                    (t('IDS_TOOLTIP_TOTAL_COLUMN_2') as string) +
                    ` (${t('IDS_MIN_POINT')}：${Number(minPoint) || 0}～${t('IDS_MAX_POINT')}：${
                      Number(maxPoint) || 100
                    })`
                  }
                  color="#424242"
                  overlayInnerStyle={{ fontSize: '11px' }}
                >
                  <Icon
                    component={InfoCircleOutlined as React.ForwardRefExoticComponent<any>}
                    style={{ cursor: 'default', paddingLeft: 2 }}
                  />
                </Tooltip>
              </>
            ),
            dataIndex: 'summaryPoint',
            align: 'center' as const,
          },
        ]}
        bordered
        dataSource={dataSource2s}
        pagination={false}
      />
    </>
  );
};

export default TotalPoint8NoSkill;
