import { Typography } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { Grid } from 'antd/lib';
import { t } from 'i18next';
import { FC, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useDispatch } from 'react-redux';
import {
  BasicBehaviorSkillType,
  UserEvaluationBasicBehaviorType,
} from '../../../../types/pages/user-evaluation/UserEvaluationType';
import { statusEvaluationType } from '../../../../common/status';
import { AppDispatch, RootState } from '../../../../store';
import { userEvaluationBehaviorSkill } from '../../../../store/userEvaluation';
import userEvaluationApiService from '../../../../common/api/userEvaluation';
import TableCustomComponent from '../../../../@core/components/table-custom/TableCustomComponent';
import behaviorSkillColumn810 from './ColumnBehaviorSkill810';

interface Props {
  //   evaluationBehaviorSkills: UserEvaluationBasicBehaviorType[];

  // ** Display/Allow edit - column user to self-evaluate
  isDisplayUserEvaluator: boolean;
  isEditUserEvaluation: boolean;

  // ** evaluator 0.5
  isDisplayEvaluator05: boolean;
  isEditEvaluation05: boolean;

  // ** evaluator 1.0
  isDisplayEvaluator1: boolean;
  isEditEvaluation1: boolean;

  // ** evaluator 2.0
  isDisplayEvaluator2: boolean;
  isEditEvaluation2: boolean;

  isEvaluatorUser: boolean;

  // ** F5
  isF5?: boolean;
  level: number;

  isNoSkill?: boolean;
  statusEvaluation: statusEvaluationType;
  isEvaluationDate?: boolean;
  openNotification: (placement: NotificationPlacement, mesage: string) => void;

  //ponit basic
  pointUser: number | null;
  pointEvaluator05: number | null;
  pointEvaluator1: number | null;
  pointEvaluator2: number | null;
}
const BehaviorTabComponent810: FC<Props> = (props) => {
  const totalBehavior = {
    itemNo: -1,
    difficulty: '',
    content: '',
    key: 'totalPoint',
    pointUser: props.pointUser,
    pointEvaluator05: props.pointEvaluator05,
    pointEvaluator1: props.pointEvaluator1,
    pointEvaluator2: props.pointEvaluator2,
    title: t('IDS_SUB_TOTAL'),
  };
  const { useBreakpoint } = Grid;

  // ** Props

  // ** State
  //   const [dataSources, setDataSource] = useState<BasicBehaviorSkillType[]>([]);

  // ** Hook
  const store = useSelector((state: RootState) => state);
  const screens = useBreakpoint();
  const dataSources = store.userEvaluation.evaluationBehaviorSkills?.map((v) => ({ ...v }));

  // Redux

  // ** Effect

  const columns = behaviorSkillColumn810({ ...props });

  return (
    <>
      {/* Header */}
      <Typography.Title level={4}>{t('IDS_BEHAVIOR')}</Typography.Title>
      {/* Table */}
      <TableCustomComponent
        dataSources={
          (props.statusEvaluation >= 50 && props.isEvaluationDate) || props.statusEvaluation >= 51
            ? [...dataSources, totalBehavior]
            : dataSources
        }
        columns={columns}
        size="small"
        isLoading={store.loading.isLoading || store.loading.isDetailLoading}
        isSetScroll={{ x: screens.sm || screens.xs ? 1100 : undefined }}
      />
    </>
  );
};

export default BehaviorTabComponent810;
