import { NotificationPlacement } from 'antd/es/notification/interface';
import Typography from 'antd/es/typography';
import { Grid } from 'antd/lib';
import { t } from 'i18next';
import { FC, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TableCustomComponent from '../../../@core/components/table-custom/TableCustomComponent';
import userEvaluationApiService from '../../../common/api/userEvaluation';
import { statusEvaluationType } from '../../../common/status';
import { RootState } from '../../../store';
import {
  BasicBehaviorSkillType,
  UserEvaluationBasicBehaviorType,
} from '../../../types/pages/user-evaluation/UserEvaluationType';
import basicSkillColumn from './data/ColumnBasicSkill';

interface Props {
  evaluationBasicSkills: UserEvaluationBasicBehaviorType[];

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

  // ** F6
  isF5?: boolean;
  statusEvaluation: statusEvaluationType;
  openNotification: (placement: NotificationPlacement, mesage: string) => void;
  typeReview?: number;
  isReview?: boolean;
}

const BasicSkillComponent: FC<Props> = (props) => {
  const { useBreakpoint } = Grid;
  const { evaluationBasicSkills, isEvaluatorUser, isF5, typeReview, isReview } = props;

  // ** State
  const [dataSources, setDataSource] = useState<BasicBehaviorSkillType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  // ** Hook
  const screens = useBreakpoint();
  const storeLoading = useSelector((state: RootState) => state.loading);

  // ** Effect
  useLayoutEffect(() => {
    const callback = (data: any) => {
      setLoading(false);
      setDataSource(data);
    };
    if (evaluationBasicSkills.length === 0) {
      setLoading(true);
      userEvaluationApiService.getBasicBehaviorSkillPublic({
        basicBehaviorType: '1',
        callback,
        isEvaluatorUser,
        isF5,
        isReview,
      });
    } else {
      // console.log(evaluationBasicSkills);

      setDataSource(evaluationBasicSkills);
    }
  }, [storeLoading.isReloadComponent]);

  const columns = basicSkillColumn({ ...props });

  return (
    <>
      {/* Header */}
      <Typography.Title level={4}>{t('IDS_BASIC_SKILL')}</Typography.Title>
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

export default BasicSkillComponent;
