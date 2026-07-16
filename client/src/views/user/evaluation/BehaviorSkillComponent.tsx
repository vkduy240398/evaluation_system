import { Typography } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { Grid } from 'antd/lib';
import { t } from 'i18next';
import { FC, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
import userEvaluationApiService from '../../../common/api/userEvaluation';
import { statusEvaluationType } from '../../../common/status';
import { RootState, AppDispatch } from '../../../store';
import {
  BasicBehaviorSkillType,
  UserEvaluationBasicBehaviorType,
} from '../../../types/pages/user-evaluation/UserEvaluationType';
import behaviorSkillColumn from './data/ColumnBehaviorSkill';
import { useDispatch } from 'react-redux';
import { userEvaluationBehaviorSkill } from '../../../store/userEvaluation';

interface Props {
  evaluationBehaviorSkills: UserEvaluationBasicBehaviorType[];

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
  openNotification: (placement: NotificationPlacement, mesage: string) => void;
  isLoading: boolean | undefined;
  typeReview?: number;
  isReview?: boolean;
}
const BehaviorSkillComponent: FC<Props> = (props) => {
  const { useBreakpoint } = Grid;

  // ** Props
  const { evaluationBehaviorSkills, isEvaluatorUser, isF5, level, isNoSkill, typeReview, isReview } = props;

  // ** State
  const [dataSources, setDataSource] = useState<BasicBehaviorSkillType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  // ** Hook
  const storeLoading = useSelector((state: RootState) => state.loading);
  const screens = useBreakpoint();

  // Redux
  const dispatch = useDispatch<AppDispatch>();

  // ** Effect
  useLayoutEffect(() => {
    const callback = (data: any) => {
      setLoading(false);
      setDataSource(data);
      dispatch(
        userEvaluationBehaviorSkill(
          data
            .filter((f: any) => f.content !== null)
            .map((v: any, i: number) => {
              v.itemNo = i;

              return v;
            }),
        ),
      );
    };
    if (evaluationBehaviorSkills.length === 0) {
      setLoading(true);
      userEvaluationApiService.getBasicBehaviorSkillPublic({
        basicBehaviorType: isNoSkill ? '3' : '2',
        callback,
        isEvaluatorUser,
        level,
        isF5,
        isReview
      });
    } else {
      setDataSource(evaluationBehaviorSkills);
    }
  }, [storeLoading.isReloadComponent]);
  const columns = behaviorSkillColumn({ ...props });

  return (
    <>
      {/* Header */}
      <Typography.Title level={4}>{t('IDS_BEHAVIOR')}</Typography.Title>
      {/* Table */}
      <TableCustomComponent
        dataSources={
          !(typeReview && isReview && typeReview < 3) ? dataSources : dataSources.filter((v) => v.title !== '小計')
        }
        columns={columns}
        size="small"
        isLoading={isLoading || storeLoading.isLoading || storeLoading.isDetailLoading}
        isSetScroll={{ x: screens.sm || screens.xs ? 1100 : undefined }}
      />
    </>
  );
};

export default BehaviorSkillComponent;
