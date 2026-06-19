// ** React Imports
import { FC } from 'react';

// ** Antd import
import { Tabs, Badge } from 'antd';
import type { TabsProps } from 'antd';

// ** Type Imports
import {
  AchievementAdditionalType,
  UserEvaluationAchievementType,
  UserEvaluationBasicBehaviorType,
  UserEvaluationPeriodType,
} from '../../../types/pages/user-evaluation/UserEvaluationType';

//  ** Component Imports
import { statusEvaluationType } from '../../../common/status';
import CommentComponent from '../evaluation/CommentComponent';
import AchievementComponent from '../evaluation/AchievementComponent';
import BehaviorSkillComponent from '../evaluation/BehaviorSkillComponent';
import AchievementAdditionalComponent from '../evaluation/AchievementAdditionalComponent';

// ** I18 Imports
import { t } from 'i18next';
import { NotificationPlacement } from 'antd/es/notification/interface';

interface Props {
  userEvaluationAchievements: UserEvaluationAchievementType[];
  achievementDatas: UserEvaluationAchievementType[];
  tabId: string;
  handleSetActiveKey: (activeKey: any) => void;
  statusEvaluation: statusEvaluationType;

  isCreationGoalDate: boolean;
  evaluationBehaviorSkills: UserEvaluationBasicBehaviorType[];
  achievementAdditionals: AchievementAdditionalType[];

  isEvaluatorUser: boolean;

  // order array
  evaluatorOrderList: number[];
  evaluatorOrder: number;

  // ** Evaluator exception
  isNotEvaluator2: boolean;

  // ** Achievement Additional
  achievementAdditionalTotalPointUser: number;
  achievementAdditionalTotalPointEvaluator05: number;
  achievementAdditionalTotalPointEvaluator1: number;
  achievementAdditionalTotalPointEvaluator2: number;

  // ** Is f5
  isF5?: boolean;

  // ** User
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

  // ** Level
  level: any;
  isNoSkill: boolean;

  isEvaluatorException: boolean;

  isLoading?: boolean;

  openNotification: (placement: NotificationPlacement, mesage: string) => void;
  fullName: string;
  evaluators: string[];
  isReview?: boolean;
  typeReview?: number;
  status: number;
  evaluationPeriod: UserEvaluationPeriodType;
}

const TabEvaluationComponentNoSkill: FC<Props> = (props) => {
  const {
    achievementDatas,
    tabId,
    handleSetActiveKey,
    statusEvaluation,
    isCreationGoalDate,
    evaluationBehaviorSkills,
    achievementAdditionals,

    isEvaluatorUser,

    evaluatorOrderList,
    evaluatorOrder,

    isNotEvaluator2,
    achievementAdditionalTotalPointUser,
    achievementAdditionalTotalPointEvaluator05,
    achievementAdditionalTotalPointEvaluator1,
    achievementAdditionalTotalPointEvaluator2,

    // ** Display column user to self-evaluate
    isDisplayUserEvaluator,

    // ** Allow edit column user to self-evaluate
    isEditUserEvaluation,

    // ** evaluator 0.5
    // ** Display column evaluator 0.5 to evaluation
    isDisplayEvaluator05,

    // ** Allow edit column evaluator 0.5 to evaluation
    isEditEvaluation05,

    // ** evaluator 1.0
    // ** Display column evaluator 1.0 to evaluation
    isDisplayEvaluator1,

    // ** Allow edit column evaluator 1.0 to evaluation
    isEditEvaluation1,

    // ** evaluator 2.0
    // ** Display column evaluator 2.0 to evaluation
    isDisplayEvaluator2,

    // ** Allow edit column evaluator 2.0 to evaluation
    isEditEvaluation2,

    isF5,

    level,
    isNoSkill,

    // ** Exception when don't any evaluator or evaluator default is delete
    isEvaluatorException,

    isLoading,

    openNotification,
    fullName,
    evaluators,
    isReview,
    typeReview,
    status,

    evaluationPeriod,
  } = props;

  // ** Hidden button 項目選択(Add pro skill modal) of 専門スキル && Hidden button 追加(Add new row) when this evaluation display for the user created
  const isHiddenButtonUserCreateContent: boolean =
    [3, 4, 5, 6, 7, 8, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 100, 101].includes(
      statusEvaluation,
    ) ||
    ([0, 1, 2].includes(statusEvaluation) && !isCreationGoalDate && isEvaluatorUser) ||
    isNotEvaluator2 ||
    isEvaluatorException; // && isEvaluatorUser;

  // ** Hidden button 項目選択(Add pro skill modal) of 専門スキル && Hidden button 追加(Add new row) when this evaluation display for the evaluator 0.5, 1, 2
  const isHiddenButtonEvaluator: boolean = [0, 1, 2].includes(statusEvaluation) && !isEvaluatorUser;

  // ** Change text 入力 || 参照
  const isChangeTextInputEx =
    ([0, 1, 2].includes(statusEvaluation) && isEvaluatorUser && isCreationGoalDate) ||
    isEditUserEvaluation ||
    isEditEvaluation05 ||
    isEditEvaluation1 ||
    isEditEvaluation2
      ? t('IDS_INPUT')
      : t('IDS_REFERENCE');

  // ** Change text 入力 || 参照
  const isChangeTextInput =
    isEditUserEvaluation || isEditEvaluation05 || isEditEvaluation1 || isEditEvaluation2
      ? t('IDS_INPUT')
      : t('IDS_REFERENCE');

  const evaluatorProps = {
    isEditUserEvaluation,
    isDisplayEvaluator05,
    isEditEvaluation05,
    isDisplayEvaluator1,
    isEditEvaluation1,
    isDisplayEvaluator2,
    isEditEvaluation2,
    isHiddenButtonUserCreateContent,
    isHiddenButtonEvaluator,
    isEvaluatorUser,
    isDisplayUserEvaluator,

    isNotEvaluator2,
    isNoSkill,
    statusEvaluation,
    isReview,
    typeReview,
  };
  const propsAdditional = {
    achievementAdditionalTotalPointUser,
    achievementAdditionalTotalPointEvaluator05,
    achievementAdditionalTotalPointEvaluator1,
    achievementAdditionalTotalPointEvaluator2,
  };

  const renderTabs: TabsProps['items'] | any = [
    {
      key: !isDisplayUserEvaluator ? '4' : '2',
      label: (
        <Badge count={isChangeTextInputEx} offset={[-50, -12]}>
          {isDisplayUserEvaluator ? t('IDS_PERSONAL_RESULT') : t('IDS_ACHIEVEMENT_PERSONAL')}
        </Badge>
      ),
      forceRender: true,
      children: (
        <AchievementComponent
          achievementDatas={achievementDatas}
          {...evaluatorProps}
          isF5={isF5}
          isLoading={isLoading}
          openNotification={openNotification}
          fullName={fullName}
          evaluatorOrderList={evaluatorOrderList}
          evaluatorOrder={evaluatorOrder}
          evaluators={evaluators}
          evaluationPeriodId={evaluationPeriod.id}
        />
      ),
    },
    {
      key: !isDisplayUserEvaluator ? '2' : '4',
      label: (
        <Badge count={isChangeTextInput} offset={[-65, -12]}>
          {t('IDS_BEHAVIOR')}
        </Badge>
      ),
      children: (
        <BehaviorSkillComponent
          evaluationBehaviorSkills={evaluationBehaviorSkills}
          {...evaluatorProps}
          level={level}
          openNotification={openNotification}
          isLoading={isLoading}
          isF5={isF5}
        />
      ),
    },
  ];

  const renderTabsForEvaluations = [
    {
      key: '4',
      label: (
        <Badge count={isChangeTextInput} offset={[-65, -12]}>
          {t('IDS_BEHAVIOR')}
        </Badge>
      ),
      children: (
        <BehaviorSkillComponent
          evaluationBehaviorSkills={evaluationBehaviorSkills}
          {...evaluatorProps}
          level={level}
          openNotification={openNotification}
          isLoading={isLoading}
          isF5={isF5}
        />
      ),
    },
    {
      key: '2',
      label: (
        <Badge count={isChangeTextInputEx} offset={[-55, -12]}>
          {isDisplayUserEvaluator ? t('IDS_PERSONAL_RESULT') : t('IDS_ACHIEVEMENT_PERSONAL')}
        </Badge>
      ),
      forceRender: true,
      children: (
        <AchievementComponent
          achievementDatas={achievementDatas}
          {...evaluatorProps}
          isF5={isF5}
          isLoading={isLoading}
          openNotification={openNotification}
          fullName={fullName}
          evaluatorOrderList={evaluatorOrderList}
          evaluatorOrder={evaluatorOrder}
          evaluators={evaluators}
          evaluationPeriodId={evaluationPeriod.id}
        />
      ),
    },
    isDisplayUserEvaluator && {
      key: '5',
      label: (
        <Badge count={isChangeTextInput} offset={[-85, -12]}>
          {t('IDS_ACHIEVEMENT_ADDITIONAL')}
        </Badge>
      ),
      children: (
        <AchievementAdditionalComponent
          {...propsAdditional}
          achievementAdditionals={achievementAdditionals}
          {...evaluatorProps}
          isF5={isF5}
          status={status}
          isLoading={isLoading}
        />
      ),
      forceRender: true,
    },
    isDisplayUserEvaluator && {
      key: '6',
      label: (
        <Badge count={isChangeTextInput} offset={[-80, -12]}>
          {t('IDS_COMMENT')}
        </Badge>
      ),
      children: (
        <CommentComponent
          evaluatorOrder={evaluatorOrder}
          evaluatorOrderList={evaluatorOrderList}
          {...evaluatorProps}
          isF5={isF5}
          isLoading={isLoading}
        />
      ),
    },
  ];

  const renderTabsBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => <DefaultTabBar {...props} />;

  return (
    <div style={{ overflowX: 'clip', paddingTop: 5 }}>
      <Tabs
        hideAdd
        size="small"
        tabPosition="top"
        type="card"
        defaultActiveKey={tabId}
        renderTabBar={renderTabsBar}
        items={isDisplayUserEvaluator ? renderTabsForEvaluations : renderTabs}
        onChange={handleSetActiveKey}
        activeKey={tabId}
      />
    </div>
  );
};

export default TabEvaluationComponentNoSkill;
